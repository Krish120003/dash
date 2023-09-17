import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Button } from "./ui/button";

import GridLayout from "react-grid-layout";
import GridCard from "./GridCard";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import WeatherCard from "./WeatherCard";

interface DashboardGridProps {
  editable: boolean;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ editable }) => {
  // getLayouts

  const { data: layouts, isLoading } = api.layout.getLayouts.useQuery();
  const mutation = api.layout.updateLayout.useMutation();

  if (isLoading || !layouts) {
    return <div>Loading</div>;
  }

  const Tlayout = layouts[0];

  const asdf =
    Tlayout?.layoutData.map((l) => {
      return l.layout;
    }) ?? [];

  const deepEqual = function (
    x: Record<string, unknown>,
    y: Record<string, unknown>,
  ) {
    if (x === y) {
      return true;
    } else if (
      typeof x == "object" &&
      x != null &&
      typeof y == "object" &&
      y != null
    ) {
      if (Object.keys(x).length != Object.keys(y).length) return false;

      for (const prop in x) {
        if (y.hasOwnProperty(prop)) {
          if (
            !deepEqual(
              x[prop] as Record<string, unknown>,
              y[prop] as Record<string, unknown>,
            )
          )
            return false;
        } else return false;
      }

      return true;
    } else return false;
  };

  return (
    <GridLayout
      className="w-full overflow-x-hidden"
      layout={asdf}
      cols={12}
      autoSize={true}
      rowHeight={60}
      allowOverlap={false}
      width={1200}
      preventCollision={false}
      isResizable={editable}
      isDraggable={editable}
      isDroppable={editable}
      onLayoutChange={(newLayout) => {
        // console.log("Layout changed at", new Date(), layout);
        if (!layouts[0]) {
          return;
        }

        const temp = newLayout.map((e) => {
          return { h: e.h, i: e.i, w: e.w, x: e.x, y: e.y };
        });

        if (
          !deepEqual(
            temp as unknown as Record<string, unknown>,
            asdf as unknown as Record<string, unknown>,
          )
        ) {
          console.log("LAYOUT CHANGED", temp, asdf);

          const mapper = new Map();

          temp.forEach((e) => {
            mapper.set(e.i, e);
          });

          const newLayoutData = layouts[0].layoutData.map((e) => {
            return {
              ...e,
              layout: mapper.get(e.layout.i) as unknown as GridLayout.Layout,
            };
          });

          console.log("newLayoutData", newLayoutData);

          mutation.mutate({
            id: layouts[0].id,
            data: {
              layoutData: newLayoutData,
            },
          });
        }
      }}
    >
      {asdf.map((card) => (
        <GridCard key={card.i} className="" editable={editable}>
          <WeatherCard />
        </GridCard>
      ))}
    </GridLayout>
  );
};

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [editing, setEditing] = useState(false);
  // extract the name of the user
  const name = session?.user?.name ?? "World";

  return (
    <div className="min-h-screen max-w-[100vw] overflow-hidden bg-zinc-900 text-white">
      <Button onClick={() => setEditing((t) => !t)}>
        {editing ? "Normal Mode" : "Edit Mode"}
      </Button>
      <div
        className={cn(
          editing ? "scale-95 border border-white" : "scale-100",
          "transition-all",
        )}
      >
        <DashboardGrid editable={editing} />
      </div>
    </div>
  );
};

export default Dashboard;
