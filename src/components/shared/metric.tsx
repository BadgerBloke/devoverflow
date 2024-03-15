import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

import { cn, formatBigNumber } from "~/lib/utils";

interface MetricProps {
  imgUrl: string;
  alt: string;
  value: number | string;
  title: string;
  href?: string;
  isAuthor?: boolean;
  textStyles?: string;
}

const Metric: FC<MetricProps> = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  isAuthor,
  textStyles,
}) => {
  const MetricContent = () => (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={cn("object-contain", href ? "rounded-full" : "")}
      />
      <p className={cn("flex items-center gap-1", textStyles)}>
        {formatBigNumber(value)}
        <span
          className={cn(
            "small-regular line-clamp-1 h-fit",
            isAuthor ? "max-sm:hidden" : ""
          )}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (isAuthor && href) {
    return (
      <Link href={href} className="flex-center flex-wrap gap-1">
        <MetricContent />
      </Link>
    );
  }
  return (
    <div className="flex-center flex-wrap gap-1">
      <MetricContent />
    </div>
  );
};

export default Metric;
