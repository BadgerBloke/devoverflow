"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

import { Button } from "~/components/ui/button";
import { HomePageFilters } from "~/constants/filters";
import { cn, formUrlQuery } from "~/lib/utils";

const HomeFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [active, setActive] = useState(searchParams.get("filter") || "");

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => handleTypeClick(item.value)}
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
