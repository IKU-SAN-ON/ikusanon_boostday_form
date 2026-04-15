"use client";

import Image from "next/image";
import { useState } from "react";

import { getRandomRalseiImage } from "@/utils/picture";

export default function RandomImage() {
  const [randomImage] = useState(() => getRandomRalseiImage());

  return (
    <Image
      src={randomImage}
      alt="Random Ralsei Image"
      width={240}
      height={240}
      unoptimized
      loading="eager"
    />
  );
}
