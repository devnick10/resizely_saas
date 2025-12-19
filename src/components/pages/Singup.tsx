"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { sendOTP } from "@/actions/sendOtp";
import { verifyOtp } from "@/actions/verifyOtp";

import { Header } from "@/components/core/header";
import { Loader } from "@/components/core/Loader";
import { useLoader } from "@/hooks/useLoader";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { registerUser } from "@/actions/registerUser";

export const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verification, setVerification] = useState(false);
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, setLoading } = useLoader();
  const router = useRouter();

  if (loading) return <Loader />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!emailAddress || !password || !username) {
      return toast.error("Please provide all fields.");
    }

    setLoading(true);
    try {
      const { success } = await registerUser({
        email: emailAddress,
        password,
        username,
      });

      if (!success) {
        throw new Error("Registration failed");
      }

      await signIn("credentials", {
        email: emailAddress,
        password,
        redirect: false,
      });

      await sendOTP(emailAddress);
      toast.success("OTP sent to your email.");
      setVerification(true);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { success } = await verifyOtp(emailAddress, code);
      if (!success) return toast.error("Invalid verification code.");

      toast.success("Email verified successfully.");
      router.push("/social-share");
    } catch (err) {
      console.error(err);
      return toast.error("Signup failed, try again.");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="relative flex justify-center items-center min-h-screen px-4">
        <div className="absolute top-0 w-full">
          <Header />
        </div>

        <Card className="w-full max-w-xs z-10">
          <CardHeader>
            <CardTitle className="text-xl text-center">Sign Up</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {!verification ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label>Email</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Username</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Password</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Choose a password"
                      required
                    />
                    {showPassword ? (
                      <EyeOff
                        className="cursor-pointer"
                        size={20}
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <Eye
                        className="cursor-pointer"
                        size={20}
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </div>
                </div>

                <Button type="submit" className="text-md w-full">
                  Sign Up
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-1">
                  <Label>Enter Verification Code</Label>
                  <Input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter the code sent to your email"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            )}

            {!verification && (
              <Button
                variant="outline"
                className="w-full text-md flex gap-2"
                onClick={() => signIn("google", { callbackUrl: "/home" })}
              >
                <Image
                  src="https://res.cloudinary.com/dnr1sgjrx/image/upload/v1744802382/google_ysyp3i.png"
                  width={20}
                  height={20}
                  alt="Google logo"
                />
                Sign Up with Google
              </Button>
            )}

            <p className="text-center text-sm">
              Already have an account?
              <Link
                href="/sign-in"
                className="ml-1 text-blue-600 font-medium underline"
              >
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
