import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Button } from "./ui/button";

import GridLayout from "react-grid-layout";
import GridCard from "./GridCard";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import WeatherCard from "./WeatherCard";
import StockCard from "./widgets/StockCard";
import GithubCard from "./GithubCard";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { ThemeProvider } from "./theme-provider";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Grid } from "lucide-react";
import SaveLocation from "./SaveLocation";
import ClockCard from "./widgets/ClockCard";

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
      <GridCard editable={editable} key="stock">
        <StockCard />
      </GridCard>
      <GridCard editable={editable} key="clock">
        <ClockCard />
      </GridCard>
    </GridLayout>
  );
};

const Dashboard = () => {
  const { data: session } = useSession();
  const [editing, setEditing] = useState(false);

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="min-h-screen max-w-[100vw] gap-8 overflow-hidden bg-zinc-900 font-red-hat text-white">
      <SaveLocation />
      <Button className="text-md" onClick={() => setEditing((t) => !t)}>
        {editing ? "Normal Mode" : "Edit Mode"}
      </Button>
      <Sheet>
        <SheetTrigger className="text-md font-red-hat">
          Add a Wigdet
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[900px]">
          <SheetHeader className="gap-4">
            <SheetTitle className="text-2xl">
              Chose a widget from below to add to your board.
            </SheetTitle>
            <SheetDescription className=" "></SheetDescription>
            <div className="flex h-full w-full justify-around">
              <Button className="w-1/3 text-lg">Weather</Button>
              <Dialog>
                <DialogTrigger className="w-1/3 bg-white text-lg font-medium text-black">
                  Stocks
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Input the ticker for the stock you would like to track.
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Ticker
                    </Label>
                    <Input id="ticker" value="APPL" className="col-span-3" />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Widget</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex h-full w-full justify-around">
              <Button className="w-1/3 text-lg">Location</Button>
              <Button className="w-1/3 text-lg">News</Button>
            </div>
            <div className="flex h-full w-full justify-around">
              <Button className="w-1/3 text-lg">Calendar</Button>
              <Button className="w-1/3 text-lg">Gmail</Button>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <div
        className={cn(
          editing ? "scale-[85%] border border-white" : "scale-100",
          "transition-all",
        )}
      >
        <DashboardGrid editable={editing} />
      </div>
    </div>
  );
};

export default Dashboard;
