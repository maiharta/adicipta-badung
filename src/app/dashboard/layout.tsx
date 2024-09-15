import { auth } from "@/auth";
import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* LEFT */}
      <div className="h-screen fixed z-50 overflow-y-auto hidden sm:block bg-white w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image
            src="/logo.webp"
            alt="logo"
            width={140}
            height={32}
            className="hidden lg:block"
          />
          <Image
            src="/logo-mobile.webp"
            alt="logo"
            width={32}
            height={32}
            className="lg:hidden"
          />
        </Link>
        <Menu session={session} />
      </div>
      {/* RIGHT */}
      <div className="md:pl-[8%] lg:pl-[16%] xl:pl-[14%] overflow-hidden">
        <div className="flex flex-col p-4 gap-4">
          <Navbar session={session} />
          {children}
        </div>
      </div>
    </div>
  );
}
