"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { downVoteAnswer, upVoteAnswer } from "~/lib/actions/answer.action";
import {
  downVoteQuestion,
  upVoteQuestion,
} from "~/lib/actions/question.action";
import { toggleSaveQuestion } from "~/lib/actions/user.action";
import { formatBigNumber } from "~/lib/utils";

interface Props {
  type: "question" | "answer";
  itemId: string;
  userId: string;
  upVotes: number;
  hasUpVoted: boolean;
  downVotes: number;
  hasDownVoted: boolean;
  hasSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upVotes,
  hasUpVoted,
  downVotes,
  hasDownVoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleSave = async () => {
    await toggleSaveQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
      path: pathname,
    });
  };

  const handleVote = async (action: "upVote" | "downVote") => {
    if (!userId) {
      router.push("/sign-in");
    }

    switch (action) {
      case "upVote": {
        if (type === "question") {
          await upVoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasUpVoted,
            hasDownVoted,
            path: pathname,
          });
        } else if (type === "answer") {
          await upVoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasUpVoted,
            hasDownVoted,
            path: pathname,
          });
        }
        // TODO: show a toast
        break;
      }
      case "downVote": {
        if (type === "question") {
          await downVoteQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasUpVoted,
            hasDownVoted,
            path: pathname,
          });
        } else if (type === "answer") {
          await downVoteAnswer({
            answerId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            hasUpVoted,
            hasDownVoted,
            path: pathname,
          });
        }
        // TODO: show a toast
        break;
      }
      default:
        break;
    }
  };
  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasUpVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt="upvote"
            className="cursor-pointer"
            onClick={() => handleVote("upVote")}
          />
          <div className="flex-center background-light700_dark400 shrink-0 p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatBigNumber(upVotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              hasDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt="down vote"
            className="cursor-pointer"
            onClick={() => handleVote("downVote")}
          />
          <div className="flex-center background-light700_dark400 shrink-0 p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatBigNumber(downVotes)}
            </p>
          </div>
        </div>
      </div>
      {type === "question" && (
        <Image
          src={
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }
          width={18}
          height={18}
          alt="star"
          className="cursor-pointer"
          onClick={handleSave}
        />
      )}
    </div>
  );
};

export default Votes;
