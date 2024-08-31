import { LoginForm } from "@/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="container min-h-screen flex items-center justify-center">
      <div className="bg-white p-4 rounded-xl space-y-4 w-full max-w-sm">
        <div>
          <p className="text-2xl font-semibold">Login</p>
          <p className="text-sm text-muted-foreground">
            Masukkan username dan password
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
