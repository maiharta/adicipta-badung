import React from "react";

export const ActionButtonsWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex justify-end gap-1">{children}</div>;
};
