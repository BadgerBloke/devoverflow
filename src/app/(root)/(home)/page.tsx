import { Fragment } from "react";
import { Metadata } from "next";
import Link from "next/link";

import { auth } from "@clerk/nextjs";

import QuestionCard from "~/components/cards/question-card";
import Filter from "~/components/shared/filter";
import NoResult from "~/components/shared/no-result";
import Pagination from "~/components/shared/pagination";
import LocalSearch from "~/components/shared/search/local-search";
import { Button } from "~/components/ui/button";
import { HomePageFilters } from "~/constants/filters";
import {
  getQuestions,
  getRecommendedQuestions,
} from "~/lib/actions/question.action";
import { URLProps } from "~/types";

import HomeFilter from "./components/home-filter";

export const metadata: Metadata = {
  title: "Home | Question Overflow",
  description:
    "Question Overflow is a community of 1,000,000+ explorer. Join us.",
};

const Home = async ({ searchParams }: URLProps) => {
  const { userId } = auth();

  let result;
  if (searchParams?.filter === "recommended") {
    if (userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: searchParams.q,
        page: searchParams.page ? +searchParams.page : 1,
      });
    } else {
      result = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? +searchParams.page : 1,
    });
  }

  return (
    <Fragment>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-11 px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-14 sm:min-w-44"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilter />
      <div className="mt-10 flex w-full flex-col gap-6">
        {result?.questions?.length ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upVotes={question.upVotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </Fragment>
  );
};

export default Home;
