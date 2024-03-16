"use server";

import { revalidatePath } from "next/cache";

import Question from "~/database/question.model";
import User from "~/database/user.model";

import { connectToDatabase } from "../mongoose";

import {
  CreateUserParams,
  DeleteUserParams,
  UpdateUserParams,
} from "./shared.types";

export const getUserById = async (params: { userId: string }) => {
  try {
    connectToDatabase();
    const { userId } = params;
    return await User.findOne({ clerkId: userId });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createUser = async (userData: CreateUserParams) => {
  try {
    connectToDatabase();

    return await User.create(userData);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUser = async (params: UpdateUserParams) => {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteUser = async (params: DeleteUserParams) => {
  try {
    connectToDatabase();

    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });

    if (!user) throw new Error("User not found");

    // Delete user from DB along with questions, answers, comments, etc.
    // const userQuestionIds =
    await Question.find({ author: user._id }).distinct("_id");

    // Delete user questions
    await Question.deleteMany({ author: user._id });

    // TODO: delete user answers, comments, etc.

    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
