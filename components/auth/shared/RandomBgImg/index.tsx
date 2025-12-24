import Image from "next/image";
import React from "react";

function RandomBgImg() {
  return (
    <>
      {/* BG Image */}
      <Image
        src={"/images/home-hero-cover.webp"}
        alt="alkhodr-gallery"
        priority
        fill
        className="object-cover"
      />
      {/* BG Shadow */}
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-black-original/40 via-black-original/20 via-40% to-transparent"></div>
    </>
  );
}

export default RandomBgImg;

