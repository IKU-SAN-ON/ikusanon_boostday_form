import Image from "next/image";
import Link from "next/link";

export default function Forbidden() {
  
  return (
    <main className="hero min-h-screen">
      <div className="hero-content flex-col gap-4 lg:flex-row lg:gap-8">
        <div className="flex flex-col gap-2 items-center rounded-(--radius-box) p-4">
          <Image src={`/images/ralsei_beats.png`} alt="Random Ralsei Image" width={240} height={240} unoptimized loading="eager"/>
          <span className="w-full text-right text-xs opacity-50">Source:{" "}
            <Link 
              className="underline hover:cursor-pointer" 
              href="https://www.youtube.com/@Cwitchy"
              target="_blank" rel="noopener noreferrer"
            >
              Cwitchy
            </Link>
            {" | "}
            <Link 
              className="underline hover:cursor-pointer" 
              href="https://discord.gg/fluffcord" 
              target="_blank" 
              rel="noopener noreferrer">
              d/fluffcord
            </Link>
          </span>
        </div>
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold">404 - Not Found</h1>
          <p className="py-6">
            The page you are looking for does not exist~
          </p>
          <div className="divider" />
          <h1 className="text-5xl font-bold">404 - 找不到頁面</h1>
          <p className="py-6">
            所請求的頁面不存在呢~
          </p>
        </div>
      </div>
    </main>
  );
}