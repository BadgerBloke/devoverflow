"use client";

import { useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { downVoteAnswer, upVoteAnswer } from "~/lib/actions/answer.action";
import { viewQuestion } from "~/lib/actions/interaction.action";
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
  const handleSave = async () => {
    await toggleSaveQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
      path: pathname,
    });

    if (hasSaved) {
      toast.error("Question Removed from your collection");
    } else {
      toast.success("Question Saved in your collection");
    }
  };

  const handleVote = async (action: "upVote" | "downVote") => {
    if (!userId) {
      toast.warning("Please log in", {
        description: "You must be logged in to perform this action",
      });
      return;
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
        if (hasUpVoted) {
          toast.error(`Up vote Removed`);
        } else {
          toast.success(`Up vote Successful`);
        }
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

        if (hasDownVoted) {
          toast.success("Down vote Removed");
        } else {
          toast.error(`Down vote Successful`);
        }
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname]);
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
