import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";

import GridLayout from "react-grid-layout";
import GridCard from "./GridCard";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import WeatherCard from "./WeatherCard";
import StockCard from "./widgets/StockCard";
import CalendarCard from "./CalendarCard";
import NewsCard from "./NewsCard";
import { getQueryKey } from "@trpc/react-query";

import {
  Sheet,
  SheetClose,
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
import GmailCard from "./widgets/GmailCard";

// import GithubCard from "./widgets/GithubCard";
import { deepEqual } from "../utils/deepEqual";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRouter } from "next/router";
import GithubCard from "./GithubCard";

interface DashboardGridProps {
  editable: boolean;
  layoutIdx: number;
}

type WidgetTypes =
  | "Spacer"
  | "Weather"
  | "Gmail"
  | "Calendar"
  | "Stock"
  | "Github"
  | "News"
  | "Clock";

const Temp: React.FC = () => {
  return <></>;
};

const getWidget = (type: WidgetTypes) => {
  const mapping: Record<WidgetTypes, React.FC<any>> = {
    Spacer: () => (
      <div className="flex h-full w-full items-center justify-center">
        Spacer
      </div>
    ),
    Weather: WeatherCard,
    Gmail: GmailCard,
    Calendar: CalendarCard,
    Stock: StockCard,
    Github: GithubCard,
    News: NewsCard,
    Clock: ClockCard,
  };
  return mapping[type as WidgetTypes] || (() => <></>);
};

const DashboardGrid: React.FC<DashboardGridProps> = ({
  layoutIdx,
  editable,
}) => {
  // getLayouts

  const { data: layouts, isLoading } = api.layout.getLayouts.useQuery();
  const mutation = api.layout.updateLayout.useMutation();

  if (isLoading || !layouts) {
    return <div>Loading</div>;
  }

  // pull the first layout temporarily
  const Tlayout = layouts[layoutIdx];

  // map component min sizes

  // 2 things
  // - The list of components to map over
  // - The cleanedup grid to pass to the GridLayout

  const extractedComponents =
    Tlayout?.layoutData.map((l) => {
      return {
        id: l.layout.i,
        widget_type: l.widget_type as WidgetTypes,
        data: l.data,
      };
    }) ?? [];

  // extracts layout for use by GridLayout
  const cleanedUpGrid =
    Tlayout?.layoutData.map((l) => {
      let toSpread = {};
      switch (l.widget_type as WidgetTypes) {
        case "Spacer":
          toSpread = { minH: 1, minW: 1 };
          break;
        case "Weather":
          toSpread = { minH: 2, minW: 2 };
          break;
        case "Gmail":
          toSpread = { minH: 1, minW: 1 };
          break;
        case "Calendar":
          toSpread = { minH: 1, minW: 1 };
          break;
        case "Stock":
          toSpread = { minH: 1, minW: 1 };
          break;
        case "Github":
          toSpread = { minH: 8, minW: 1 };
          break;
        case "News":
          toSpread = { minH: 1, minW: 1 };
          break;
        case "Clock":
          toSpread = { minH: 1, minW: 1 };
          break;
      }
      const baka = { ...l.layout, ...toSpread };

      return { ...l.layout, ...toSpread };
    }) ?? [];

  return (
    <GridLayout
      className="w-full overflow-x-hidden"
      layout={cleanedUpGrid}
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
        if (!layouts[layoutIdx]) {
          return;
        }

        const temp = newLayout.map((e) => {
          return { h: e.h, i: e.i, w: e.w, x: e.x, y: e.y };
        });

        if (
          !deepEqual(
            temp as unknown as Record<string, unknown>,
            cleanedUpGrid as unknown as Record<string, unknown>,
          )
        ) {
          const mapper = new Map();

          temp.forEach((e) => {
            mapper.set(e.i, e);
          });

          const newLayoutData = layouts[layoutIdx]?.layoutData.map((e) => {
            return {
              ...e,
              layout: mapper.get(e.layout.i) as unknown as GridLayout.Layout,
            };
          });

          mutation.mutate({
            id: layouts[layoutIdx]?.id ?? "",
            data: {
              layoutData: newLayoutData,
            },
          });
        }
      }}
    >
      {extractedComponents.map((c) => {
        const Widget = getWidget(c.widget_type as WidgetTypes);
        return (
          <GridCard
            key={c.id}
            editable={editable}
            className={cn(
              (c.widget_type === "Spacer" || c.widget_type === "Clock") &&
                !editable
                ? "border-none bg-transparent"
                : null,
              c.widget_type === "Spacer" && !editable && "opacity-0",
            )}
          >
            <Widget {...(c.data as object)} />
          </GridCard>
        );
      })}
      {/* <GridCard editable={editable} key="github">
        <GithubCard />
      </GridCard> */}
    </GridLayout>
  );
};

interface AddSheetProps {
  layoutIdx: number;
  setLayoutIdx: React.Dispatch<React.SetStateAction<number>>;
}

const AddSheet: React.FC<AddSheetProps> = ({ layoutIdx, setLayoutIdx }) => {
  const [stockTicker, setStockTicker] = useState("AAPL");
  const closeRef = useRef<HTMLButtonElement>(null);

  const { data: layouts, isLoading } = api.layout.getLayouts.useQuery();
  const mutation = api.layout.updateLayout.useMutation({
    onMutate: async (variables) => {
      await utils.layout.getLayouts.cancel();

      if (Tlayout === undefined || !layouts) {
      } else {
        layouts[layoutIdx] = Tlayout;
        utils.layout.getLayouts.setData(undefined, (_) => {
          return variables.data as any;
        });
      }
    },
    onSettled: async () => {
      await utils.layout.getLayouts.invalidate();
    },
  });

  const createLayout = api.layout.createLayout.useMutation();

  const Tlayout = layouts?.[layoutIdx];
  const utils = api.useContext();

  return (
    <Sheet>
      <div className="flex gap-4 p-4">
        <SheetTrigger className="text-md font-red-hat">
          <Button>Add a Wigdet</Button>
        </SheetTrigger>
        <Button
          onClick={(e) => {
            createLayout.mutate({
              layoutData: [],
              name: "Layout",
            });
          }}
        >
          Add a Layout
        </Button>
        <Input
          onSubmit={(e) => {
            setLayoutIdx(Number.parseInt(e.currentTarget.value));
          }}
        />
      </div>
      <SheetContent className="w-[400px] sm:w-[900px]">
        <SheetHeader className="">
          <SheetTitle className="text-md text-center">
            Chose a widget to add to your board
          </SheetTitle>
          <SheetDescription className=""></SheetDescription>
          <SheetClose ref={closeRef} />
          <div className="grid grid-cols-2 gap-4 text-white">
            <Dialog>
              <DialogTrigger className="aspect-square h-auto rounded-2xl border border-white bg-black text-lg font-medium">
                Stock Ticker
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
                  <Input
                    id="ticker"
                    value={stockTicker}
                    onChange={(e) =>
                      setStockTicker(e.target.value.toUpperCase())
                    }
                    className="col-span-3"
                  />
                </div>
                <DialogFooter>
                  <DialogClose
                    onClick={(e) => {
                      let biggestY = 0;
                      Tlayout?.layoutData.forEach((l) => {
                        if (l.layout.y + l.layout.h > biggestY) {
                          biggestY = l.layout.y + l.layout.h;
                        }
                      });

                      Tlayout?.layoutData.push({
                        layout: {
                          h: 2,
                          w: 3,
                          i: (Math.random() + 1).toString(36).substring(7),
                          x: 0,
                          y: biggestY,
                        },
                        widget_type: "Stock" as WidgetTypes,
                        data: { ticker: stockTicker },
                      });

                      if (Tlayout === undefined || !layouts) {
                      } else {
                        layouts[layoutIdx] = Tlayout;

                        mutation.mutate({
                          id: Tlayout.id,
                          data: {
                            layoutData: Tlayout.layoutData,
                          },
                        });
                      }

                      if (closeRef && closeRef.current) {
                        closeRef.current.click();
                      }
                      return e;
                    }}
                  >
                    <Button>Add Widget</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              className="aspect-square h-auto rounded-2xl border border-white text-lg  dark:bg-black dark:text-white dark:hover:bg-neutral-900"
              onClick={(e) => {
                let biggestY = 0;
                Tlayout?.layoutData.forEach((l) => {
                  if (l.layout.y + l.layout.h > biggestY) {
                    biggestY = l.layout.y + l.layout.h;
                  }
                });

                Tlayout?.layoutData.push({
                  layout: {
                    h: 2,
                    w: 3,
                    i: (Math.random() + 1).toString(36).substring(7),
                    x: 0,
                    y: biggestY,
                  },
                  widget_type: "Weather" as WidgetTypes,
                  data: { ticker: stockTicker },
                });

                if (Tlayout === undefined || !layouts) {
                } else {
                  layouts[layoutIdx] = Tlayout;

                  mutation.mutate({
                    id: Tlayout.id,
                    data: {
                      layoutData: Tlayout.layoutData,
                    },
                  });
                }

                if (closeRef && closeRef.current) {
                  closeRef.current.click();
                }
                return e;
              }}
            >
              <div className="scale-75">
                <WeatherCard />
              </div>
            </Button>
            <Button
              className="aspect-square h-auto rounded-2xl border border-white text-lg  dark:bg-black dark:text-white dark:hover:bg-neutral-900"
              onClick={(e) => {
                let biggestY = 0;
                Tlayout?.layoutData.forEach((l) => {
                  if (l.layout.y + l.layout.h > biggestY) {
                    biggestY = l.layout.y + l.layout.h;
                  }
                });

                Tlayout?.layoutData.push({
                  layout: {
                    h: 2,
                    w: 3,
                    i: (Math.random() + 1).toString(36).substring(7),
                    x: 0,
                    y: biggestY,
                  },
                  widget_type: "Clock" as WidgetTypes,
                  data: {},
                });

                if (Tlayout === undefined || !layouts) {
                } else {
                  layouts[layoutIdx] = Tlayout;

                  mutation.mutate({
                    id: Tlayout.id,
                    data: {
                      layoutData: Tlayout.layoutData,
                    },
                  });
                }

                if (closeRef && closeRef.current) {
                  closeRef.current.click();
                }
                return e;
              }}
            >
              <div className="w-full overflow-visible">
                <ClockCard />
              </div>
            </Button>
            <Button
              className="aspect-square h-auto rounded-2xl border border-white text-lg  dark:bg-black dark:text-white dark:hover:bg-neutral-900"
              onClick={(e) => {
                let biggestY = 0;
                Tlayout?.layoutData.forEach((l) => {
                  if (l.layout.y + l.layout.h > biggestY) {
                    biggestY = l.layout.y + l.layout.h;
                  }
                });

                Tlayout?.layoutData.push({
                  layout: {
                    h: 2,
                    w: 3,
                    i: (Math.random() + 1).toString(36).substring(7),
                    x: 0,
                    y: biggestY,
                  },
                  widget_type: "News" as WidgetTypes,
                  data: { ticker: stockTicker },
                });

                if (Tlayout === undefined || !layouts) {
                } else {
                  layouts[layoutIdx] = Tlayout;

                  mutation.mutate({
                    id: Tlayout.id,
                    data: {
                      layoutData: Tlayout.layoutData,
                    },
                  });
                }

                if (closeRef && closeRef.current) {
                  closeRef.current.click();
                }
                return e;
              }}
            >
              <NewsCard />
            </Button>

            <Button
              className=" h-auto rounded-2xl border border-white  text-lg dark:bg-black dark:text-white dark:hover:bg-neutral-900"
              onClick={(e) => {
                let biggestY = 0;
                Tlayout?.layoutData.forEach((l) => {
                  if (l.layout.y + l.layout.h > biggestY) {
                    biggestY = l.layout.y + l.layout.h;
                  }
                });

                Tlayout?.layoutData.push({
                  layout: {
                    h: 2,
                    w: 3,
                    i: (Math.random() + 1).toString(36).substring(7),
                    x: 0,
                    y: biggestY,
                  },
                  widget_type: "Calendar" as WidgetTypes,
                  data: { ticker: stockTicker },
                });

                if (Tlayout === undefined || !layouts) {
                } else {
                  layouts[layoutIdx] = Tlayout;

                  mutation.mutate({
                    id: Tlayout.id,
                    data: {
                      layoutData: Tlayout.layoutData,
                    },
                  });
                }

                if (closeRef && closeRef.current) {
                  closeRef.current.click();
                }
                return e;
              }}
            >
              <CalendarCard />
            </Button>
            <Button
              className="aspect-square h-auto rounded-2xl border border-white text-lg  dark:bg-black dark:text-white dark:hover:bg-neutral-900"
              onClick={(e) => {
                let biggestY = 0;
                Tlayout?.layoutData.forEach((l) => {
                  if (l.layout.y + l.layout.h > biggestY) {
                    biggestY = l.layout.y + l.layout.h;
                  }
                });

                Tlayout?.layoutData.push({
                  layout: {
                    h: 2,
                    w: 3,
                    i: (Math.random() + 1).toString(36).substring(7),
                    x: 0,
                    y: biggestY,
                  },
                  widget_type: "Gmail" as WidgetTypes,
                  data: { ticker: stockTicker },
                });

                if (Tlayout === undefined || !layouts) {
                } else {
                  layouts[layoutIdx] = Tlayout;

                  mutation.mutate({
                    id: Tlayout.id,
                    data: {
                      layoutData: Tlayout.layoutData,
                    },
                  });
                }

                if (closeRef && closeRef.current) {
                  closeRef.current.click();
                }
                return e;
              }}
            >
              Gmail Recent Mail
            </Button>
            <Button
              className="aspect-square h-auto rounded-2xl border border-white text-lg  dark:bg-black dark:text-white dark:hover:bg-neutral-900"
              onClick={(e) => {
                let biggestY = 0;
                Tlayout?.layoutData.forEach((l) => {
                  if (l.layout.y + l.layout.h > biggestY) {
                    biggestY = l.layout.y + l.layout.h;
                  }
                });

                Tlayout?.layoutData.push({
                  layout: {
                    h: 2,
                    w: 3,
                    i: (Math.random() + 1).toString(36).substring(7),
                    x: 0,
                    y: biggestY,
                  },
                  widget_type: "Spacer" as WidgetTypes,
                  data: { ticker: stockTicker },
                });

                if (Tlayout === undefined || !layouts) {
                } else {
                  layouts[layoutIdx] = Tlayout;

                  mutation.mutate({
                    id: Tlayout.id,
                    data: {
                      layoutData: Tlayout.layoutData,
                    },
                  });
                }

                if (closeRef && closeRef.current) {
                  closeRef.current.click();
                }
                return e;
              }}
            >
              Spacer
            </Button>
            <Button
              className="aspect-square h-auto rounded-2xl border border-white text-lg  dark:bg-black dark:text-white dark:hover:bg-neutral-900"
              onClick={(e) => {
                let biggestY = 0;
                Tlayout?.layoutData.forEach((l) => {
                  if (l.layout.y + l.layout.h > biggestY) {
                    biggestY = l.layout.y + l.layout.h;
                  }
                });

                Tlayout?.layoutData.push({
                  layout: {
                    h: 2,
                    w: 3,
                    i: (Math.random() + 1).toString(36).substring(7),
                    x: 0,
                    y: biggestY,
                  },
                  widget_type: "Github" as WidgetTypes,
                  data: { ticker: stockTicker },
                });

                if (Tlayout === undefined || !layouts) {
                } else {
                  layouts[layoutIdx] = Tlayout;

                  mutation.mutate({
                    id: Tlayout.id,
                    data: {
                      layoutData: Tlayout.layoutData,
                    },
                  });
                }

                if (closeRef && closeRef.current) {
                  closeRef.current.click();
                }
                return e;
              }}
            >
              Github
            </Button>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

const Dashboard = () => {
  const { data: session } = useSession();
  const [editing, setEditing] = useState(false);
  const [layoutIdx, setLayoutIdx] = useState(0);

  // get params
  const router = useRouter();
  const { im } = router.query;

  // if its list use the first one
  const to_use = im ? (Array.isArray(im) ? im[0] : im) : "mount.jpeg";

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div
      className={`relative min-h-screen max-w-[100vw] gap-8 overflow-hidden bg-white bg-cover font-red-hat text-white`}
      style={{
        backgroundImage: `url(${to_use})`,
      }}
    >
      <Button
        className="absolute bottom-5 right-5 z-10 rounded-full"
        onClick={() => setEditing((t) => !t)}
      >
        {editing ? "Normal Mode" : "Edit Mode"}
      </Button>
      {editing && (
        <AddSheet layoutIdx={layoutIdx} setLayoutIdx={setLayoutIdx} />
      )}
      <div
        className={cn(
          editing ? "scale-[85%] border border-white" : "scale-100",
          "transition-all",
        )}
      >
        <DashboardGrid editable={editing} layoutIdx={layoutIdx} />
      </div>
    </div>
  );
};

export default Dashboard;
