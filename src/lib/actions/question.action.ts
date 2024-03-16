"use server";

import { revalidatePath } from "next/cache";

import Question from "~/database/question.model";
import Tag from "~/database/tag.model";
import User from "~/database/user.model";

import { connectToDatabase } from "../mongoose";

import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";

export const createQuestion = async (params: CreateQuestionParams) => {
  try {
    connectToDatabase();
    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    // Create the tags or get them if they already exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      await Question.findByIdAndUpdate(question._id, {
        $addToSet: {
          tags: existingTag._id,
        },
      });
    }

    revalidatePath(path);
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getQuestions = async (params: GetQuestionsParams) => {
  try {
    connectToDatabase();
    const questions = await Question.find({}, {}, { sort: { createdAt: -1 } })
      .populate({ path: "author", model: User })
      .populate({ path: "tags" });
    return { questions };
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};
