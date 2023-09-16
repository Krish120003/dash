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
      {/* Some other content */}
      {children} {/* Make sure to include children to add resizable handle */}
    </div>
  );
});

function MyFirstGrid() {
  // layout is an array of objects, see the demo for more complete usage
  const layout = [
    { i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
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
    >
      <GridCard key="a" className="bg-red-500" />
      <GridCard key="b" className="bg-blue-500" />
      <GridCard key="c" className="bg-green-500" />
    </GridLayout>
  );
}
const Dashboard = () => {
  const gridRef = useRef(null);

  return (
    <div ref={gridRef}>
      MyFirstGrid
      <MyFirstGrid />
    </div>
  );
};

export default Dashboard;
