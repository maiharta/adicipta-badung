import { ChangePasswordForm } from "@/components/ChangePasswordForm";

const ChangePasswordPage = () => {
  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="bg-white p-4 rounded-xl space-y-4 w-full max-w-sm">
        <div>
          <p className="text-2xl font-semibold">Ganti Password</p>
          <p className="text-sm text-muted-foreground">
            Perbarui kata sandi Anda dengan memasukkan kata sandi lama dan yang
            baru.
          </p>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
