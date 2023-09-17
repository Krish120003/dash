import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Dash from "./mydash";

import { api } from "~/utils/api";
import React from "react";
import { GetServerSidePropsContext } from "next/types";
import { getServerAuthSession } from "~/server/auth";
import { ThemeProvider } from "~/components/theme-provider";
import { ModeToggle } from "~/components/ui/toggle";

export default function Home() {
  return (
    <>
      <Head>
        <title>Dash</title>
        <meta name="Dash" content="What you need, when you need it." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Red+Hat+Display:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#401d6f] to-[#5559a5]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ModeToggle />
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 font-red-hat">
            <Dash />
          </div>
        </ThemeProvider>
      </main>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);

  return { redirect: { destination: "/login", permanent: false } };
};
