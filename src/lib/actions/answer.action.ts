"use server";

import { revalidatePath } from "next/cache";

import Answer from "~/database/answer.model";
import Interaction from "~/database/interaction.model";
import Question from "~/database/question.model";

import { connectToDatabase } from "../mongoose";

import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";

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

export const getAnswers = async (params: GetAnswersParams) => {
  try {
    connectToDatabase();

    const { questionId, sortBy, page = 1, pageSize = 5 } = params;

    const skipAmount = (page - 1) * pageSize;

    let sortOptions = {};

    switch (sortBy) {
      case "highestUpVotes":
        sortOptions = { upVotes: -1 };
        break;
      case "lowestUpVotes":
        sortOptions = { upVotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalAnswers = await Answer.countDocuments({
      question: questionId,
    });

    const isNext = totalAnswers > skipAmount + answers.length;

    return { answers, isNext };
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const upVoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectToDatabase();

    const { answerId, userId, hasDownVoted, hasUpVoted, path } = params;

    let updateQuery = {};
    if (hasUpVoted) {
      updateQuery = { $pull: { upVotes: userId } };
    } else if (hasDownVoted) {
      updateQuery = {
        $pull: { downVotes: userId },
        $push: { upVotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upVotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) throw new Error("Question not found");

    // Increment author's reputation
    revalidatePath(path);
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const downVoteAnswer = async (params: AnswerVoteParams) => {
  try {
    connectToDatabase();

    const { answerId, userId, hasDownVoted, hasUpVoted, path } = params;

    let updateQuery = {};
    if (hasDownVoted) {
      updateQuery = { $pull: { downVotes: userId } };
    } else if (hasUpVoted) {
      updateQuery = {
        $pull: { upVotes: userId },
        $push: { downVotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downVotes: userId } };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) throw new Error("Question not found");

    // Increment author's reputation
    revalidatePath(path);
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const deleteAnswer = async (params: DeleteAnswerParams) => {
  try {
    connectToDatabase();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);
    if (!answer) throw new Error("Answer not found");

    await answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );
    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};
