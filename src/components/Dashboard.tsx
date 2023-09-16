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
  // layout is an array of objects, see the demo for more complete usage
  const layout = [
    { i: "a", x: 0, y: 0, w: 4, h: 4 },
    { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 4, y: 0, w: 1, h: 2 },
  ];

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
      onLayoutChange={(layout) => {
        console.log("Layout changed at", new Date(), layout);
      }}
    >
      <GridCard key="a" className="">
        <div className="h-full w-full rounded-md border border-zinc-700 bg-zinc-800 p-4 ">
          <h2 className="text-2xl font-bold">Card Name</h2>
          <p>Card Details</p>
        </div>
      </GridCard>
      <GridCard key="b" className="bg-blue-500" />
      {/* <GridCard key="c" className="bg-green-500" /> */}
      <div key="c" className="bg-green-500">
        c
      </div>
    </GridLayout>
  );
}
const Dashboard = () => {
  const gridRef = useRef(null);

  return (
    <div ref={gridRef} className="bg-zinc-900 text-white">
      DashboardGrid
      <DashboardGrid />
    </div>
  );
};

export default Dashboard;
