"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import linear from "../../assets/h1.png"

export default function Landing() {
  return (
    (<div className="flex font-mono font-bold flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-white dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Mock Interview and Communtiy.
              </span>
            </h1>
          </>
        }>
        <img
          src={"https://courseconnect.in/assets/images/blog2/what-is-mock-interview.svg"}
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-fill h-full object-left-top"
          draggable={false} />
      </ContainerScroll>
    </div>)
  );
}
