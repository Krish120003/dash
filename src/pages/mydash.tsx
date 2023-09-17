import dynamic from "next/dynamic";
import { GetServerSidePropsContext } from "next/types";
import Dashboard from "../components/Dashboard";
import { getServerAuthSession } from "~/server/auth";
import React from "react";
import { ThemeProvider } from "~/components/theme-provider";

// const DynamicDash = dynamic(() => import("../components/Dashboard"), {
//   loading: () => <p>Loading...</p>,
//   ssr: false,
// });

export default function Dash() {
  return (
    <>
      <main className="min-h-screen w-full">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* <DynamicDash /> */}
          <Dashboard />
        </ThemeProvider>
      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (!session || !session.user) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  return { props: {} };
}
