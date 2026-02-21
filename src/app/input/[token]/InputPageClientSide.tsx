'use client';

import React from "react";
import { useState } from "react";

import { TickIcon, CrossIcon } from "@/components/icons";

import DateSelection from "@/components/DateSelect";

import { useSelectedDates } from "@/stores/selectedDate";

import { cn } from "@/lib/utils";
import { set } from "zod";

export interface InputPageClientSideProps extends React.HTMLAttributes<HTMLDivElement> {
  userId: string;
  token: string;
  previousData?: Date[];
}

const InputPageSuccess = ({className, ...rest}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-4 md:p-16", className)} {...rest}>
    <h1 className="divider text-3xl p-4 font-bold mb-16">加成日提案</h1>
    <div className="flex flex-col items-center gap-4">
      <TickIcon className="opacity-25" width={96} height={96} />
      <h2 className="text-2xl font-semibold">提交成功</h2>
      <p className="text-center">你的加成日提案已經成功送出。現在可以關閉此頁面。</p>
    </div>
  </div>
);

const InputPageFailure = ({className, error_message, ...rest}: React.HTMLAttributes<HTMLDivElement> & { error_message?: string }) => {
  const knownErrors: Record<string, string> = {
    "Invalid data provided.": "Token無效。請確保鏈接未被修改。如有需要，請從 Discord 機器人獲取新的訪問鏈接。",
    "Token expired or invalid, or userId does not match with token.": "Token已過期。請從 Discord 機器人獲取新的訪問鏈接。",
    "Internal Server Error.": "服務器發生錯誤。",
  };

  const renderMessage = error_message && knownErrors[error_message] ? knownErrors[error_message] : "提交失敗，請稍後再試。";

  return (<div className={cn("p-4 md:p-16", className)} {...rest}>
    <h1 className="divider text-3xl p-4 font-bold mb-16">加成日提案</h1>
    <div className="flex flex-col items-center gap-4">
      <CrossIcon className="opacity-25" width={96} height={96} />
      <h2 className="text-2xl font-semibold">提交失敗</h2>
      <p className="text-center">{renderMessage}</p>
    </div>
  </div>);
}

const InputPageClientSide = ({className, userId, token, previousData, ...rest}: InputPageClientSideProps) => {

  const selectedDates = useSelectedDates(state => state.selectedDates);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | undefined>(undefined);  // 3-state: undefined (not submitted), true (success), false (failure)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/v1/submit", {
        method: "POST",
        body: JSON.stringify({
          token,
          userId,
          selectedDates,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(true);
      } else {
        console.error("Submission failed:", data.message);
        setErrorMessage(data.message);
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setErrorMessage("Network error or server is unreachable.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  
  if (success === undefined) {
  return (
    <div className={cn("p-4 md:p-16", className)} {...rest}>
      <h1 className="divider text-3xl p-4 font-bold mb-16">加成日提案</h1>
      <p className="">請在下列的日曆中選擇有空遊玩CHUNITHM的日子。</p>
      <div className="flex justify-center p-4 md:m-16">
        <DateSelection className="min-h-80"initialSelectedDates={previousData} />
      </div>
      <div className="flex justify-center">
        <button className={cn("w-full max-w-sm btn btn-accent", loading && "btn-disabled")} onClick={handleSubmit}>
          {loading ? 
            <span className="loading loading-spinner loading-md" /> : 
            "提交"
          }
        </button>
      </div>
    </div>
  );
  } else if (success) {
    return <InputPageSuccess className={className} {...rest} />;
  } else {
    return <InputPageFailure className={className} {...rest} error_message={errorMessage} />;
  }
}

export default InputPageClientSide;