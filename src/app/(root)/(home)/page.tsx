import { Fragment } from "react";
import Link from "next/link";

import Filter from "~/components/shared/filter";
import LocalSearch from "~/components/shared/search/local-search";
import { Button } from "~/components/ui/button";
import { HomePageFilters } from "~/constants/filters";

import HomeFilter from "./components/home-filter";

const Home = () => {
  return (
    <Fragment>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-11 px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-14 sm:min-w-44"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilter />
    </Fragment>
  );
};

export default Home;
