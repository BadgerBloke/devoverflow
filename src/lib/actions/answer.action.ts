"use server";

import { revalidatePath } from "next/cache";

import Answer from "~/database/answer.model";
import Question from "~/database/question.model";

import { connectToDatabase } from "../mongoose";

import { CreateAnswerParams } from "./shared.types";

export const createAnswer = async (params: CreateAnswerParams) => {
  try {
    connectToDatabase();

    const { content, path, author, question } = params;
    const newAnswer = await Answer.create({ content, author, question });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: add interaction....
    console.log("newAnswer: ", newAnswer);
    revalidatePath(path);
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};
