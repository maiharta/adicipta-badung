import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import prisma from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      session?.user.role !== Role.ADMIN &&
      session?.user.role !== Role.INPUTER
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 }
      );
    }

    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF or image file." },
        { status: 400 }
      );
    }

    if (file.size >= 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "The file must be less than 5 MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const filename = Date.now() + file.name.replaceAll(" ", "_");

    const dFile = await prisma.$transaction(async (tx) => {
      const dFile = tx.file.create({
        data: {
          fileName: filename,
          filePath: `uploads/${filename}`,
          fileType: file.type,
        },
      });

      await writeFile(
        path.join(process.cwd(), "public/uploads/" + filename),
        buffer
      );

      return dFile;
    });

    return NextResponse.json({ data: dFile }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
};
