import { Fragment } from "react";
import Link from "next/link";

import UserCard from "~/components/cards/user-card";
import Filter from "~/components/shared/filter";
import LocalSearch from "~/components/shared/search/local-search";
import { UserFilters } from "~/constants/filters";
import { getAllUsers } from "~/lib/actions/user.action";
import { URLProps } from "~/types";

const CommunityPage = async ({ searchParams }: URLProps) => {
  const result = await getAllUsers({ searchQuery: searchParams.q });
  return (
    <Fragment>
      <h1 className="h1-bold text-dark100_light900">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/community"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for amazing minds"
          otherClasses="flex-1"
        />
        <Filter filters={UserFilters} otherClasses="min-h-14 sm:min-w-44" />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {result.users.length > 0 ? (
          result.users.map((user) => <UserCard key={user._id} user={user} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No users yet</p>
            <Link href="/sign-up" className="mt-1 font-bold text-accent-blue">
              Join to be the first!
            </Link>
          </div>
        )}
      </section>
    </Fragment>
  );
};

export default CommunityPage;
