import { Fragment } from "react";
import Link from "next/link";

import QuestionCard from "~/components/cards/question-card";
import Filter from "~/components/shared/filter";
import NoResult from "~/components/shared/no-result";
import LocalSearch from "~/components/shared/search/local-search";
import { Button } from "~/components/ui/button";
import { HomePageFilters } from "~/constants/filters";
import { getQuestions } from "~/lib/actions/question.action";

import HomeFilter from "./components/home-filter";

// const questions = [
//   {
//     _id: "1",
//     title: "Cascading Deletes in SQLAlchemy?",
//     tags: [
//       { _id: "1", name: "python" },
//       { _id: "2", name: "sql" },
//     ],
//     author: { _id: "1", name: "John Doe", picture: "url_to_picture" },
//     upvotes: 93489489834,
//     views: 100000000,
//     answers: [{}, {}], // Array of objects representing answers
//     createdAt: new Date("2024-02-23T12:00:00.000Z"),
//   },
//   {
//     _id: "2",
//     title: "How to center a div?",
//     tags: [
//       { _id: "1", name: "css" },
//       { _id: "2", name: "styling" },
//     ],
//     author: { _id: "2", name: "Jane Doe", picture: "url_to_picture" },
//     upvotes: 15,
//     views: 200,
//     answers: [{}, {}], // Array of objects representing answers
//     createdAt: new Date("2024-02-24T12:00:00.000Z"),
//   },
// ];

const Home = async () => {
  const { questions } = await getQuestions({});
  // console.log("questions: ", questions);
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
        {questions.length > 0 ? (
          questions.map((question) => (
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
    </Fragment>
  );
};

export default Home;
