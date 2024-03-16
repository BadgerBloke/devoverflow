"use server";

import User from "~/database/user.model";

import { connectToDatabase } from "../mongoose";

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
