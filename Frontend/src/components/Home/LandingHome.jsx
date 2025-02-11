"use client";
import React from "react";
import home from "../../assets/homev.webm";
import { BackgroundBeams } from "../ui/background-beams";

export default function LandingHome() {
  return (
    <div>
      <div className="h-[40rem] font-mono mt-14 text-white w-full rounded-md bg-transparent relative flex flex-col items-center justify-center antialiased">
        <div className="mt-6">
          <div className="text-xl font-semibold px-8 py-4 border-2 shadow-lg shadow-violet-300 border-violet-300 rounded-full text-white ">
            <span>Welcome to Our Platform!</span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-600 text-center font-sans font-bold pb-4">
            Become a Better Software Engineer
          </h1>

          <p></p>
          <p className="text-neutral-500 max-w-lg mx-auto my-2 text-xl text-center relative z-10">
            Unlock your potential by joining our platform! Whether you're a
            beginner or an experienced developer, we have something for
            everyone. Sign up now and take your coding journey to the next
            level!
          </p>
        </div>
        <BackgroundBeams />
      </div>
      <div className="max-w-screen-xl container mx-auto">
      <video
        src={home}
        autoPlay
        muted
        className="w-full h-auto rounded-lg shadow-lg" // Adjust styles as needed
      >
        Your browser does not support the video tag.
      </video>
    </div>
    </div>
  );
}
