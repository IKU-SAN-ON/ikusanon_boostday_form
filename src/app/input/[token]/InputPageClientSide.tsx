'use client';

import React from "react";

import DateSelection from "@/components/DateSelect";
import { cn } from "@/lib/utils";

export interface InputPageClientSideProps extends React.HTMLAttributes<HTMLDivElement> {
  userId: string;
}

const InputPageClientSide = ({className, userId, ...rest}: InputPageClientSideProps) => {
  return (
    <div className={cn(className)} {...rest}>
      <h1>Input Page (Client Side)</h1>
      <DateSelection />
    </div>
  );
}

export default InputPageClientSide;