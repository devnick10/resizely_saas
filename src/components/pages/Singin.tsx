"use client";

import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { Header } from "@/components/core/Header";
import { useLoading } from "@/hooks/useLoading";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "../core/Spinner";
import { credentialsSchema } from "@/schema";

export const Signin: React.FC = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { loading, setLoading } = useLoading();

  async function submit(e: FormEvent) {
    e.preventDefault();

    const { success, error } = credentialsSchema.safeParse({
      email: emailAddress,
      password,
    });

    if (!success) {
      error.issues.forEach((i) => {
        toast.error(i.message);
      });
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: emailAddress,
        password,
        redirect: false,
      });

      if (!result?.ok) {
        toast.error(result?.error || "Signin failed");
        return;
      }

      toast.success("Signed in successfully.");
      router.push("/dashboard");
    } catch (err) {
      console.error("Unexpected signin error:", err);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Image
        className="absolute bottom-0"
        src="/bottomwave.svg"
        alt=""
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
      />
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="absolute top-0 w-full">
          <Header />
        </div>

        <Card className="z-10 w-full max-w-xs">
          <CardHeader>
            <CardTitle className="text-center text-xl">Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={submit} className="space-y-4">
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Password</Label>

                <div className="flex items-center gap-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  {showPassword ? (
                    <EyeOff
                      className="cursor-pointer"
                      onClick={() => setShowPassword(false)}
                      size={20}
                    />
                  ) : (
                    <Eye
                      className="cursor-pointer"
                      onClick={() => setShowPassword(true)}
                      size={20}
                    />
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="text-md w-full"
                disabled={loading}
              >
                Sign In {loading && <Spinner />}
              </Button>
            </form>

            <Button
              variant="outline"
              className="text-md flex w-full gap-2"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <Image
                src="https://res.cloudinary.com/dnr1sgjrx/image/upload/v1744802382/google_ysyp3i.png"
                width={20}
                height={20}
                alt="Google logo"
              />
              Sign In with Google
            </Button>

            <p className="text-center text-sm">
              Don&apos;t have an account?
              <Link
                href="/sign-up"
                className="ml-1 font-medium text-blue-600 underline"
              >
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
