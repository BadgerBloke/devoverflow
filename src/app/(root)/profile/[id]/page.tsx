import Image from "next/image";
import Link from "next/link";

import { auth, SignedIn } from "@clerk/nextjs";

import AnswerTab from "~/components/shared/answer-tab";
import ProfileLink from "~/components/shared/profile-link";
import QuestionTab from "~/components/shared/question-tab";
import Stats from "~/components/shared/stats";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getUserInfo } from "~/lib/actions/user.action";
import { getJoinedDate } from "~/lib/utils";

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string };
}

const ProfileDetailsPage = async ({ params, searchParams }: Props) => {
  const { userId: clerkId } = auth();
  const userInfo = await getUserInfo({ userId: params.id });
  return (
    <div>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
          <Image
            src={userInfo.user.picture}
            alt="profile picture"
            width={140}
            height={140}
            className="rounded-full object-cover"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo.user.name}
            </h2>
            <p className="paragraph-regular text-dark200_light800">
              @{userInfo.user.username}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {userInfo.user.portfolioWebsite && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={userInfo.user.portfolioWebsite}
                  title="Portfolio"
                />
              )}
              {userInfo.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo.user.location}
                />
              )}
              {userInfo.user.joinedAt && (
                <ProfileLink
                  imgUrl="/assets/icons/calendar.svg"
                  title={`Joined ${getJoinedDate(userInfo.user.joinedAt)}`}
                />
              )}
            </div>
            {userInfo.user.bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {userInfo.user.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {clerkId === userInfo.user.clerkId && (
              <Link href="/profile/edit">
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-11 min-w-44 px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        totalQuestions={userInfo.totalQuestions}
        totalAnswers={userInfo.totalAnswers}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-1">
          <TabsList className="background-light800_dark400 min-h-10 p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QuestionTab />
          </TabsContent>
          <TabsContent value="answers">
            <AnswerTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileDetailsPage;
