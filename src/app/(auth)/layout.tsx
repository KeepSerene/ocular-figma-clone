import type { Metadata } from "next";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | Ocular",
    default: "Welcome | Ocular",
  },
};

async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (session) {
    return redirect("/dashboard");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-4">
      {children}
    </main>
  );
}

export default AuthLayout;
