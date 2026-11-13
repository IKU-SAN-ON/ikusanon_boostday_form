"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const RandomImage = dynamic(() => import("@/components/nossr/random_image"), {
  ssr: false,
});

export default function InternalError() {
  return (
    <main className="hero min-h-screen">
      <div className="hero-content flex-col gap-4 lg:flex-row lg:gap-8">
        <div className="flex flex-col gap-2 items-center rounded-(--radius-box) p-4">
          <RandomImage />
          <span className="w-full text-right text-xs opacity-50">
            Source:{" "}
            <Link
              className="underline hover:cursor-pointer"
              href="https://www.youtube.com/@Cwitchy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cwitchy
            </Link>
            {" | "}
            <Link
              className="underline hover:cursor-pointer"
              href="https://discord.gg/fluffcord"
              target="_blank"
              rel="noopener noreferrer"
            >
              d/fluffcord
            </Link>
          </span>
        </div>
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold">500 - Internal Server Error</h1>
          <p className="py-6">
            Looks like our server was not behaving. If the problem persists,
            please email to{" "}
            <Link
              className="link link-primary"
              href="mailto:me@3underscoreN.work"
            >
              me@3underscoreN.work
            </Link>
            .
          </p>
          <div className="divider" />
          <h1 className="text-5xl font-bold">500 - 內部伺服器錯誤</h1>
          <p className="py-6">
            看起來我們的伺服器不乘喔。如果問題持續，請發送電郵至
            <Link
              className="link link-primary"
              href="mailto:me@3underscoreN.work"
            >
              me@3underscoreN.work
            </Link>
            。
          </p>
        </div>
      </div>
    </main>
  );
}
