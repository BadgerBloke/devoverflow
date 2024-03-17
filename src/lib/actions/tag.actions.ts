"use server";

// import Tag from "~/database/tag.model";
import User from "~/database/user.model";

import { connectToDatabase } from "../mongoose";

import { GetTopInteractedTagsParams } from "./shared.types";

export const getTopInteractedTags = async (
  params: GetTopInteractedTagsParams
) => {
  try {
    connectToDatabase();

    const {
      userId,
      // limit
    } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    return [
      {
        _id: "1",
        name: "tag1",
      },
      {
        _id: "2",
        name: "tag2",
      },
      {
        _id: "3",
        name: "tag3",
      },
    ];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};
