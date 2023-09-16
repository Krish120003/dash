import dynamic from "next/dynamic";

const DynamicDash = dynamic(() => import("../components/Dashboard"), {
  loading: () => <p>Loading...</p>,
});

export default function Dash() {
  return (
    <>
      <main className="min-h-screen w-full bg-yellow-400">
        <DynamicDash />
      </main>
    </>
  );
}
