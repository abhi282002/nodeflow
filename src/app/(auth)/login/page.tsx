import { LoginForm } from "@/app/features/auth/components/login-form";
import { Button } from "@/components/ui/button";
import { requireUnAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnAuth();
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default Page;
