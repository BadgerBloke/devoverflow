import { SignIn } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="background-light850_dark100 flex min-h-svh w-full items-center justify-center">
      <SignIn />
    </div>
  );
};

export default Page;
