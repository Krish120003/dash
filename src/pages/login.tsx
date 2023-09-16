import { signIn } from "next-auth/react";
import Image from "next/image";
import google_logo from "../../public/google_logo.svg";
import Head from "next/head";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerAuthSession } from "~/server/auth";

interface LoginProps {
  image?: HTMLImageElement;
  title: string;
  main: boolean;
  provider: string;
  Icon?: () => JSX.Element;
}

const LoginButton = (prop: LoginProps) => {
  const { title, image, main, Icon, provider } = prop;

  const iconExists = Icon === undefined;
  // const normalizedTitle = title.toLowerCase();
  const buttonStyling = main
    ? "align-items-center flex gap-4 h-32 items-center justify-center rounded-lg bg-primary py-6 text-center text-xl font-medium"
    : "text-black dark:text-white text-lg flex items-center justify-center gap-2 rounded-md border border-zinc-700 py-2 text-center font-medium hover:bg-[#dedede] dark:hover:bg-zinc-700";
  const iconStyling = main ? "aspect-square w-8" : "w-5 dark:text-white";
  return (
    <button className={buttonStyling} onClick={() => void signIn(provider)}>
      <div className={iconStyling}>
        {image !== undefined ? (
          <Image src={image} alt={`${title} Logo`} layout="responsive"></Image>
        ) : iconExists ? null : (
          <Icon />
        )}
      </div>
      {main ? `Sign in with ${title}` : title}
    </button>
  );
};

const Login: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login - Dash</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 dark:bg-black">
        <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
          DASH Dashboard
        </h2>

        <div className="flex w-1/2 flex-col gap-1 rounded-xl border border-zinc-600  bg-white text-white dark:bg-zinc-800">
          <LoginButton
            key={"google"}
            title={"Google"}
            image={google_logo as HTMLImageElement}
            main={true}
            provider={"google"}
          />
        </div>
      </div>
    </>
  );
};

export default Login;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);
  if (session?.user) {
    return { redirect: { destination: "/mydash", permanent: false } };
  }
  return { props: {} };
};
