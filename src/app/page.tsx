"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const RandomImage = dynamic(() => import("@/components/nossr/random_image"), {
  ssr: false,
});

export default function Home() {
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
          <h1 className="text-5xl font-bold">Hello there!</h1>
          <p className="py-6">
            This website is supposed to be accessed from the Discord bot, so you
            won't find much here.
          </p>
          <div className="divider" />
          <h1 className="text-5xl font-bold">你好鴨！</h1>
          <p className="py-6">
            這個網站需要通過 Discord 機器人來訪問，所以這裏不會有什麼東西。
          </p>
        </div>
      </div>
    </main>
  );
}
