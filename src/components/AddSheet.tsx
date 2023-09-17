import React, { useState } from "react";
import { Button } from "./ui/button";
import WeatherCard from "./WeatherCard";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { DialogClose } from "@radix-ui/react-dialog";

export const AddSheet: React.FC = () => {
  const [stockTicker, setStockTicker] = useState("AAPL");

  return (
    <Sheet>
      <SheetTrigger className="text-md font-red-hat">Add a Wigdet</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[900px]">
        <SheetHeader className="gap-4">
          <SheetTitle className="text-2xl">
            Chose a widget from below to add to your board.
          </SheetTitle>
          <SheetDescription className=""></SheetDescription>
          <div className="grid grid-cols-2 gap-4 text-white">
            <Dialog>
              <DialogTrigger className="aspect-square h-auto rounded-2xl border border-white bg-black text-lg font-medium text-black">
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
                      console.log("ASLDKJDLKFJSKFDJ");
                      return e;
                    }}
                  >
                    <Button>Add Widget</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button className="aspect-square h-auto rounded-2xl border border-white text-lg  dark:bg-black dark:text-white dark:hover:bg-neutral-900">
              <div className="scale-75">
                <WeatherCard />
              </div>
            </Button>
            <Button className="aspect-square h-auto rounded-2xl border border-white text-lg  dark:bg-black dark:text-white dark:hover:bg-neutral-900">
              Location
            </Button>
            <Button className="aspect-square h-auto rounded-2xl border border-white text-lg  dark:bg-black dark:text-white dark:hover:bg-neutral-900">
              News
            </Button>

            <Button className="aspect-square h-auto rounded-2xl border border-white text-lg  dark:bg-black dark:text-white dark:hover:bg-neutral-900">
              Calendar
            </Button>
            <Button className="aspect-square h-auto rounded-2xl border border-white text-lg  dark:bg-black dark:text-white dark:hover:bg-neutral-900">
              Gmail
            </Button>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
