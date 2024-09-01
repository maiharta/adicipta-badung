import { UploadIcon } from "@radix-ui/react-icons";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";

export const MyDropzone = ({
  onDrop,
}: {
  onDrop: (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => void;
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected(fileRejections) {
      fileRejections.forEach((file) => {
        file.errors.forEach((err) => {
          if (err.code === "file-too-large") {
            toast("Maksimal size file 5MB.");
          }

          if (err.code === "file-invalid-type") {
            toast("File harus pdf atau gambar.");
          }
        });
      });
    },
    multiple: false,
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
    maxSize: 1000 * 1000 * 5,
  });

  return (
    <div {...getRootProps()}>
      <div className="flex items-center justify-center gap-2 border-2 border-dashed hover:bg-muted hover:cursor-pointer hover:border-muted-foreground/50 px-2 py-4 rounded-md">
        <input {...getInputProps()} />
        <UploadIcon />
        <p className="text-xs text-center text-gray-500">
          Browse Files to upload
        </p>
      </div>
    </div>
  );
};
