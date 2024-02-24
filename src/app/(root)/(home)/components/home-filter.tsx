"use client";
import clsx from "clsx";

import { Button } from "~/components/ui/button";
import { HomePageFilters } from "~/constants/filters";
import { cn } from "~/lib/utils";

const HomeFilter = () => {
  const active = "newest";
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => {}}
          className={cn(
            "body-medium rounded-lg px-6 py-3 capitalize shadow-none",
            clsx({
              "bg-primary-100 text-primary-500": active === item.value,
              "bg-light-800 text-light-500 hover:bg-light-900 dark:bg-dark-300 dark:hover:bg-dark-300 dark:text-light-500":
                active !== item.value,
            })
          )}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
