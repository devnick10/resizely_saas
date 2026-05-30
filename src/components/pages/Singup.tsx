"use client";

import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { sendOTP } from "@/actions/sendOtp";
import { verifyOtp } from "@/actions/verifyOtp";

import { Header } from "@/components/core/Header";
import { useLoading } from "@/hooks/useLoading";

import { registerUser } from "@/actions/registerUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { credentialsSchema } from "@/schema";
import { Spinner } from "../core/Spinner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verification, setVerification] = useState(false);
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, setLoading } = useLoading();
  const router = useRouter();
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailAddress || !password || !username) {
      return toast.error("Please provide all fields.");
    }

    const { success, error } = credentialsSchema.safeParse({
      email: emailAddress,
      password,
      username,
    });

    if (!success) {
      error.issues.forEach((i) => {
        toast.error(i.message);
      });
      return;
    }

    setLoading(true);
    try {
      const response = await registerUser({
        email: emailAddress,
        password,
        username,
      });

      if (!response.success) {
        toast.error(response.error);
        return;
      }

      await signIn("credentials", {
        email: emailAddress,
        password,
        redirect: false,
      });

      const otpResponse = await sendOTP(emailAddress);
      if (!otpResponse.success) {
        toast.error(otpResponse.error);
        return;
      }

      setVerification(true);
      setResendTimer(60);
      toast.success("OTP sent to your email.");
    } catch (err) {
      console.error(err);
      toast.error("Signup Failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { success } = await verifyOtp(code);
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

  async function resendOTP() {
    if (resendTimer > 0) return;
    const otpResponse = await sendOTP(emailAddress);

    if (!otpResponse.success) {
      toast.error(otpResponse.error);
      return;
    }

    toast.success("OTP sent to your email.");
    setResendTimer(60);
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
            <CardTitle className="text-center text-xl">Sign Up</CardTitle>
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

                <Button
                  type="submit"
                  className="text-md w-full"
                  disabled={loading}
                >
                  Sign Up {loading && <Spinner />}
                </Button>
              </form>
            ) : (
              <>
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
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    className="cursor-pointer text-sm underline disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={resendOTP}
                    disabled={resendTimer > 0}
                  >
                    Resend OTP
                  </button>

                  {resendTimer > 0 && (
                    <span className="text-sm text-muted-foreground">
                      ({resendTimer}s)
                    </span>
                  )}
                </div>
              </>
            )}

            {!verification && (
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
                Sign Up with Google
              </Button>
            )}
            <p className="text-center text-sm">
              Already have an account?
              <Link
                href="/sign-in"
                className="ml-1 font-medium text-blue-600 underline"
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
