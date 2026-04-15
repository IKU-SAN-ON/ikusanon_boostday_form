"use client";

import Link from "next/link";

import dynamic from "next/dynamic";

const RandomImage = dynamic(() => import("@/components/nossr/random_image"), {
  ssr: false,
});

export default function Forbidden() {
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
          <h1 className="text-5xl font-bold">403 - Forbidden</h1>
          <p className="py-6">
            You have been forbidden from accessing. Maybe check your link?
          </p>
          <div className="divider" />
          <h1 className="text-5xl font-bold">403 - 拒絕訪問</h1>
          <p className="py-6">你被伺服器拒絕訪問了。不然檢查一下鏈接看看？</p>
        </div>
      </div>
    </main>
  );
}
