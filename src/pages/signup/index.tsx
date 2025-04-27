"use client";
import {SessionProvider} from "next-auth/react"
import UserButton from "@/components/user-button";

const Home = () => {
  return (
    <div>
      <SessionProvider>
        <UserButton />
      </SessionProvider>
    </div>
  );
};

export default Home;