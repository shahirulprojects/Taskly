import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Taskly</h1>
      <p className="text-gray-500">A simple task management app</p>
      <Link href="/todolist">
        <Button className="mt-4">Get Started</Button>
      </Link>
    </div>
  );
};

export default Home;
