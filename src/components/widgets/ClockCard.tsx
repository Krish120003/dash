import { useQuery } from "@tanstack/react-query";
import * as React from "react";

export default function ClockCard() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const timerID = window.setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timerID);
    };
  }, []);

  if (time === null) return null;

  return (
    <div className="relative flex h-full w-full items-center justify-center text-white">
      <svg viewBox="0 0 56 18" color="white" className="w-[80%]">
        <text color="white" x="0" y="15" fill="white">
          {time.toLocaleTimeString()}
        </text>
      </svg>
    </div>
  );
}
