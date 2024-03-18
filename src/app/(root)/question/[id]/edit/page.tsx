import { auth } from "@clerk/nextjs";

import Question from "~/components/forms/question";
import { getQuestionById } from "~/lib/actions/question.action";
import { getUserById } from "~/lib/actions/user.action";
import { URLProps } from "~/types";

const EditQuestionPage = async ({ params }: URLProps) => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <Question
          type="edit"
          mongoUserId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </div>
  );
};

export default EditQuestionPage;
