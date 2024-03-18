import Image from "next/image";
import Link from "next/link";

import { AnswerFilters } from "~/constants/filters";
import { getAnswers } from "~/lib/actions/answer.action";
import { getTimestamp } from "~/lib/utils";

import Filter from "./filter";
import ParseHTML from "./parse-html";
import Votes from "./votes";

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: string;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Props) => {
  const result = await getAnswers({
    questionId: JSON.parse(questionId),
    page: page ? +page : 1,
    sortBy: filter,
  });
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
      <div className="my-10">
        {result.answers.map((answer) => (
          <article key={answer._id}>
            <div className="flex items-center justify-between">
              <div className="mb-8 flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className="flex flex-1 items-start gap-1 sm:items-center"
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt="profile"
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {answer.author.name}
                    </p>
                    <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1">
                      <span className="mx-1 max-sm:hidden">-</span>answered{" "}
                      {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <Votes
                    type="answer"
                    itemId={JSON.stringify(answer._id)}
                    userId={userId}
                    upVotes={answer.upVotes.length}
                    hasUpVoted={answer.upVotes.includes(
                      JSON.parse(userId || "{}")
                    )}
                    downVotes={answer.downVotes.length}
                    hasDownVoted={answer.downVotes.includes(
                      JSON.parse(userId || "{}")
                    )}
                  />
                </div>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
