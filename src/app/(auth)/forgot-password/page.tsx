import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center" />}>
      <AuthForm mode="forgot" />
    </Suspense>
  );
}
