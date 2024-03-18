import { Fragment } from "react";

import { auth } from "@clerk/nextjs";

import QuestionCard, {
  QuestionCardProps,
} from "~/components/cards/question-card";
import Filter from "~/components/shared/filter";
import NoResult from "~/components/shared/no-result";
import LocalSearch from "~/components/shared/search/local-search";
import { QuestionFilters } from "~/constants/filters";
import { getSavedQuestions } from "~/lib/actions/user.action";
import { URLProps } from "~/types";

const Home = async ({ searchParams }: URLProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const { questions } = await getSavedQuestions({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
  });
  return (
    <Fragment>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/collection"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for saved questions"
          otherClasses="flex-1"
        />
        <Filter filters={QuestionFilters} otherClasses="min-h-14 sm:min-w-44" />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions.length > 0 ? (
          questions.map((question: QuestionCardProps) => (
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
            title="There's no question saved to show"
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
