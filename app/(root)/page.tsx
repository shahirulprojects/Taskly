"use client";
import React from "react";
import Link from "next/link";
import SplashCursor from "@/components/ui/splashcursor";
import { Button } from "@/components/ui/button";
import Threads from "@/components/ui/threads";
const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <SplashCursor />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white">Taskly</h1>
        <p className="text-gray-500">A simple task management app</p>
        <Link href="/todolist">
          <Button className="mt-4 bg-white text-black">Get Started</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
