import { UserForm } from "@/components/UserForm";
import { getUserById } from "@/lib/data";
import { notFound } from "next/navigation";

const EditUserPage = async ({ params }: { params: { id: string } }) => {
  const user = await getUserById(+params.id);

  if (!user) {
    return notFound();
  }

  return (
    <div className="bg-white p-4 rounded-md space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Edit User</h1>
      </div>
      <UserForm mode="edit" user={user} />
    </div>
  );
};

export default EditUserPage;
