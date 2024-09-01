import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LuAlignJustify } from "react-icons/lu";
import Menu from "./Menu";
import { Session } from "next-auth";

export const Drawer = ({ session }: { session: Session | null }) => {
  return (
    <Sheet>
      <SheetTrigger>
        <LuAlignJustify className="sm:hidden" />
      </SheetTrigger>
      <SheetContent>
        <Menu session={session} />
      </SheetContent>
    </Sheet>
  );
};
