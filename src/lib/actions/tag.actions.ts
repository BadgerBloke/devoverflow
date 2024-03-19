"use server";

import { FilterQuery } from "mongoose";

import Question from "~/database/question.model";
import Tag, { ITag } from "~/database/tag.model";
import User from "~/database/user.model";

import { connectToDatabase } from "../mongoose";

import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";

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

export const getAllTags = async (params: GetAllTagsParams) => {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<ITag> = {};
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const totalTags = await Tag.countDocuments();

    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const getQuestionsByTagId = async (
  params: GetQuestionsByTagIdParams
) => {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;

    const tagFilters: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilters).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) throw new Error("User not found");

    const currentTagTotalQuestion = await Tag.findOne(tagFilters).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      select: "_id",
    });

    const isNext =
      currentTagTotalQuestion.questions.length >
      skipAmount + tag.questions.length;

    return { tagTitle: tag.name, questions: tag.questions, isNext };
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

export const getTopPopularTags = async () => {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};
