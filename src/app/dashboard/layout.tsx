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
    <div className="min-h-screen flex">
      {/* LEFT */}
      <div className="bg-white w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
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
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-hidden flex flex-col p-4 gap-4">
        <Navbar session={session} />
        {children}
      </div>
    </div>
  );
}
