"use server";

import { connectToDatabase } from "../mongoose";
import { QuestionType } from "../validations";

export const createQuestion = (params: QuestionType) => {
  try {
    connectToDatabase();
  } catch (error) {}
};
