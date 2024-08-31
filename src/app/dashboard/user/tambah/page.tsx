import { UserForm } from "@/components/UserForm";
import React from "react";

const AddUserPage = () => {
  return (
    <div className="bg-white p-4 rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Tambah User</h1>
      </div>
      <UserForm mode="create" />
    </div>
  );
};

export default AddUserPage;
