import { SignUp } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <SignUp />
    </div>
  );
};

export default Page;
