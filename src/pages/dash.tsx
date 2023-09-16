import dynamic from "next/dynamic";

const DynamicDash = dynamic(() => import("../components/Dashboard"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Dash() {
  return (
    <>
      <main className="min-h-screen w-full bg-white">
        <DynamicDash />
      </main>
    </>
  );
}
