import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "mt-2 w-full border border-[#F5F7F9] placeholder:text-[#767676] text-[#767676] bg-white outline-none rounded-[8px] pl-[16px] pr-[36px] py-[12px]",

        className
      )}
      {...props}
    />
  );
}

export { Input };
