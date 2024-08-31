import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/UserColumns";
import { getUsers } from "@/lib/data";
import Link from "next/link";
import React from "react";
import { LuPlus } from "react-icons/lu";

const UserPage = async () => {
  const users = await getUsers();

  return (
    <div className="bg-white p-4 rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Daftar User</h1>
        <Link href="user/tambah">
          <Button variant="outline" size="icon">
            <LuPlus />
          </Button>
        </Link>
      </div>
      <DataTable data={users} columns={columns} />
    </div>
  );
};

export default UserPage;
