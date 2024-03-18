"use client";

import { ReactNode } from "react";

import { ClerkProvider as ClerkProviderPrimitive } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { useTheme } from "~/context/theme-provider";

const ClerkProvider = ({ children }: { children: ReactNode }) => {
  const { mode } = useTheme();
  return (
    <ClerkProviderPrimitive
      appearance={{
        baseTheme: mode === "dark" ? dark : undefined,
        elements: {
          formButtonPrimary: "primary-gradient",
          footerActionLink: "primary-text-gradient hover:text-primary-500",
        },
      }}
    >
      {children}
    </ClerkProviderPrimitive>
  );
};

export default ClerkProvider;
