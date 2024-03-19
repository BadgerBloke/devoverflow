import { getUserAnswers } from "~/lib/actions/user.action";
import { SearchParamsProps } from "~/types";

import AnswerCard from "../cards/answer-card";

import Pagination from "./pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswersTab = async ({ searchParams, userId, clerkId }: Props) => {
  const { answers, isNext } = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <>
      <div className="space-y-4">
        {answers.map((item) => (
          <AnswerCard
            key={item._id}
            clerkId={clerkId}
            _id={item._id}
            question={item.question}
            author={item.author}
            upVotes={item.upVotes.length}
            createdAt={item.createdAt}
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

export default AnswersTab;
