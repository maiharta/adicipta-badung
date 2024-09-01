import React from "react";
import { LuFile, LuTrash2 } from "react-icons/lu";
import { Button } from "./ui/button";
import { File } from "@/lib/definitions";

type FileItemProps =
  | {
      mode: "upload";
      file?: File;
      onRemove: () => void;
    }
  | {
      mode: "view";
      file?: File;
      onRemove?: () => void;
    };

export const FileItem = ({ mode, file, onRemove }: FileItemProps) => {
  return (
    <div className="bg-secondary px-2 py-2 rounded-md flex items-center justify-between gap-2 flex-1">
      <div
        onClick={() => window.open(`/${file?.filePath}`, "_blank")}
        className="flex gap-2 cursor-pointer"
      >
        <LuFile />
        <p className="text-xs">{file?.fileName}</p>
      </div>
      {mode === "upload" && (
        <Button
          variant="ghost"
          onClick={onRemove}
          className="h-fit p-1 group hover:bg-destructive"
        >
          <LuTrash2 className="group-hover:text-white" />
        </Button>
      )}
    </div>
  );
};
