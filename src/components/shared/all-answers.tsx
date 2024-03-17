import { AnswerFilters } from "~/constants/filters";
import { getAnswers } from "~/lib/actions/answer.action";

import Filter from "./filter";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: number;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) => {
  const result = await getAnswers({ questionId: JSON.parse(questionId) });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers > 1
            ? `${totalAnswers} Answers`
            : `${totalAnswers} Answer`}
        </h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div>
        {result.answers.map((answer) => (
          <article key={answer._id}>
            <div className="flex items-center justify-between">
              {JSON.stringify(answer)}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
