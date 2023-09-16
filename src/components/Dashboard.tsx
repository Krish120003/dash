import { useSession } from "next-auth/react";
import React, { useRef, forwardRef } from "react";

import GridLayout from "react-grid-layout";

interface GridCardProps {
  style?: React.CSSProperties;
  className?: string;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}

const GridCard: React.FC<GridCardProps> = forwardRef(function GridCardInner(
  { style, className, onMouseDown, onMouseUp, onTouchEnd, children, ...props },
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div
      style={{ ...style }}
      className={className}
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      {...props}
    >
      {children}
    </div>
  );
});

function DashboardGrid() {
  const [cardCount, setCardCount] = React.useState(2);
  // layout is an array of objects, see the demo for more complete usage
  const [layout, setLayout] = React.useState([
    { i: "a", x: 0, y: 0, w: 4, h: 4 },
    { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 4, y: 0, w: 1, h: 2 },
  ]);

  function addCard() {
    console.log("card ", cardCount);

    setLayout((layout) => [
      ...layout,
      { i: String(cardCount), x: 0, y: 0, w: 3, h: 3 },
    ]);
    setCardCount(cardCount + 1);
  }

  const mape = layout.map((card) => {
    return (
      <GridCard key={card.i} className="bg-blue-500">
        Dummy Data
      </GridCard>
    );
  });
  return (
    <div>
      <button onClick={addCard}>Add Card</button>
      <GridLayout
        className="overflow-x-hidden"
        layout={layout}
        cols={12}
        autoSize={true}
        rowHeight={60}
        allowOverlap={false}
        width={1200}
        preventCollision={false}
        onLayoutChange={(layout) => {
          console.log("Layout changed at", new Date(), layout);
        }}
      >
        {mape}
      </GridLayout>
    </div>
  );
}
const Dashboard = () => {
  const { data: session, status } = useSession();

  // extract the name of the user
  const name = session?.user?.name ?? "World";

  return (
    <div className="min-h-screen max-w-[100vw] overflow-hidden bg-zinc-900 text-white">
      DashboardGrid
      <div className="text-2xl">Hello {name}!</div>
      <DashboardGrid />
    </div>
  );
};

export default Dashboard;

/*
<GridCard key="a" className="">
          <div className="h-full w-full rounded-md border border-zinc-700 bg-zinc-800 p-4 ">
            <h2 className="text-2xl font-bold">Card Name</h2>
            <p>Card Details</p>
          </div>
        </GridCard>
        <GridCard key="b" className="bg-blue-500" />
        {/* <GridCard key="c" className="bg-green-500" /> } /*
        <div key="c" className="bg-green-500">
          WHAT
        </div>
        */
