import { useSession } from "next-auth/react";
import React, { useRef, forwardRef, useState } from "react";
import { Button } from "./Button";

import GridLayout from "react-grid-layout";

interface GridCardProps {
  style?: React.CSSProperties;
  className?: string;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
}

interface Card {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number | undefined;
  maxW?: number | undefined;
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
  const [cardCount, setCardCount] = useState(3);
  const [settingsModal, setSettingsModal] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);
  // layout is an array of objects, see the demo for more complete usage
  const [layout, setLayout] = useState<Card[]>([
    { i: "0", x: 0, y: 0, w: 4, h: 2, minW: 1, maxW: 6 },
    { i: "1", x: 0, y: 1, w: 2, h: 2, minW: 1, maxW: 4 },
    { i: "2", x: 4, y: 0, w: 1, h: 2, minW: 1, maxW: 4 },
  ]);

  function addCard() {
    console.log("card ", cardCount);

    setLayout((layout) => [
      ...layout,
      {
        i: String(cardCount),
        x: cardCount * 3 - 4,
        y: 0,
        w: 3,
        h: 3,
      },
    ]);
    setCardCount(cardCount + 1);
  }

  const cards = layout.map((card) => {
    return (
      <GridCard
        key={card.i}
        className=" rounded-md bg-blue-600 bg-opacity-25 p-2"
      >
        <button
          className="h-full w-full"
          onClick={() => {
            setLayout((layout) => {
              const newLayout = removeMode
                ? layout.filter((layout) => layout != card)
                : layout;
              return newLayout;
            });
          }}
        >
          CONTENTS
        </button>
      </GridCard>
    );
  });
  const editButtons = (
    <div className="flex gap-2">
      <Button variant="outline" onClick={addCard} className="w-24 text-black">
        Add Card
      </Button>
      <Button
        variant="outline"
        className="w-48 text-black"
        onClick={() =>
          setRemoveMode((old) => {
            return !old;
          })
        }
      >
        {removeMode ? "Removing Enabled" : "Enable Removing Cards"}
      </Button>
    </div>
  );

  // ensures removal mode is disabled when modal closed/opened
  function closeModal() {
    setRemoveMode(false);
    setSettingsModal((old) => {
      return !old;
    });
  }

  return (
    <div>
      <div className="flex gap-2 px-12">
        <Button
          variant="outline"
          size="icon"
          className=" bg-opacity-25 text-2xl text-black"
          onClick={closeModal}
        >
          {settingsModal ? "< " : ">"}
        </Button>
        {settingsModal ? editButtons : ""}
      </div>
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
          setLayout(layout);
        }}
      >
        {cards}
      </GridLayout>
    </div>
  );
}
const Dashboard = () => {
  const { data: session, status } = useSession();

  // extract the name of the user
  const name = session?.user?.name ?? "World";

  return (
    <div className="min-h-screen max-w-[100vw] overflow-hidden text-white">
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


         function removeCard(card: Card) {
    console.log("removing ", card);
    setLayout((layout) => {
      const newLayout = layout.filter((layout) => layout != card);
      return newLayout;
    });
  }
        */
