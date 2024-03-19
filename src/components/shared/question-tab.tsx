import { getUserQuestions } from "~/lib/actions/user.action";
import { SearchParamsProps } from "~/types";

import QuestionCard from "../cards/question-card";

import Pagination from "./pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
  const { questions, isNext } = await getUserQuestions({ userId, page: 1 });
  return (
    <>
      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            clerkId={clerkId}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upVotes={question.upVotes}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
          />
        ))}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </>
  );
};

export default QuestionTab;
