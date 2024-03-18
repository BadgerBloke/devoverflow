import { auth } from "@clerk/nextjs";

import Profile from "~/components/forms/profile";
import { getUserById } from "~/lib/actions/user.action";

const ProfileEditPage = async () => {
  const { userId } = auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>

      <div className="mt-9">
        <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </div>
  );
};

export default ProfileEditPage;
