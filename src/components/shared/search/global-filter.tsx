"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

import { Button } from "~/components/ui/button";
import { GlobalSearchFilters } from "~/constants/filters";
import { cn, formUrlQuery } from "~/lib/utils";

const GlobalFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [active, setActive] = useState(searchParams.get("type") || "");

  const handleTypeClick = (type: string) => {
    if (active === type) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(type);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: type.toLowerCase(),
      });

      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type:</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <Button
            key={item.value}
            type="button"
            className={cn(
              "light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 dark:hover:text-primary-500 hover:text-primary-500 dark:bg-dark-500 bg-light-700 text-dark-400",
              clsx({
                "bg-primary-500 text-light-900 dark:bg-primary-500 dark:text-light-900 hover:dark:text-light-900/75":
                  active === item.value,
              })
            )}
            onClick={() => handleTypeClick(item.value)}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilter;
