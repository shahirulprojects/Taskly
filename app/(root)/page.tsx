"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Threads from "@/components/ui/threads";
const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Threads amplitude={1} distance={0} enableMouseInteraction={true} />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white">Taskly</h1>
        <p className="text-emerald-400 m-2">
          Stay organized, stay productive – all in one place.
        </p>
        <Link href="/todolist">
          <Button className="mt-4 bg-white text-black">Get Started</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
