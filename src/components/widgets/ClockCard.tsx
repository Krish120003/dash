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
    <div>
      <p className="text-center text-8xl">{time.toLocaleTimeString()}</p>
    </div>
  );
}
