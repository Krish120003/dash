import React from "react";
import { forwardRef } from "react";
import GridLayout from "react-grid-layout";
import { cn } from "~/lib/utils";

interface GridCardProps {
  style?: React.CSSProperties;
  className?: string;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
  editable: boolean;
}

const GridCard: React.FC<GridCardProps> = forwardRef(function GridCardInner(
  {
    style,
    className,
    onMouseDown,
    onMouseUp,
    onTouchEnd,
    children,
    editable,
    ...props
  },
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div
      style={{ ...style }}
      className={cn(
        className,
        "rounded-none	border-2	 border-none bg-[#ffffff34] p-4 backdrop-blur-sm ",
        editable && "",
      )}
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

export default GridCard;
