"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { EyeOff, Eye } from "lucide-react";

import Header from "@/components/core/header";
import Loader from "@/components/core/Loader";
import { useLoader } from "@/hooks/useLoader";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Signin() {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<unknown>();

  const router = useRouter();
  const { loading, setLoading } = useLoader();

  async function submit(e: FormEvent) {
    e.preventDefault();

    if (!emailAddress || !password) {
      toast.error("Please provide both fields.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: emailAddress,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password.");
      }

      if (result?.ok) {
        toast.success("Signed in successfully.");
        router.push("/home");
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  if (error) toast.error("Something went wrong");
  if (loading) return <Loader />;

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
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute top-0 w-full">
          <Header />
        </div>

        <Card className="w-full max-w-xs z-10">
          <CardHeader>
            <CardTitle className="text-xl text-center">Sign In</CardTitle>
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

              <Button type="submit" className="w-full text-md">
                Sign In
              </Button>
            </form>

            <Button
              variant="outline"
              className="w-full flex text-md gap-2"
              onClick={() => signIn("google", { callbackUrl: "/home" })}
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
                className="ml-1 text-blue-600 font-medium underline"
              >
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
