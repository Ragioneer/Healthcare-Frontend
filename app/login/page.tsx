"use client";

import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { ArrowRight, Eye, EyeClosed, Mail } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useClient } from "../../context/ClientContext";
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import Loader from "@/components/ui/Loader";
import { DecodedToken } from "@/lib/auth";
import { toast } from "react-toastify";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const client = useClient();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setIsLoading(true);
      const response = await axios.post(`${baseURL}/auth/login`, {
        email,
        password,
      });

      const { access_token } = response.data;
      Cookies.set("token", access_token, { expires: 1 });

      const decoded = jwtDecode<DecodedToken>(access_token);

      if (decoded.role === "admin") {
        router.push("/admin/upload-medical-files");
      } else {
        router.push("/ask-me-anything");
      }
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401) {
        setErrors({ password: "Invalid email or password." });
      } else {
        setErrors({
          password: "Something went wrong. Please try again later.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      setGoogleLoginLoading(true);
      const response = await axios.get(`${baseURL}/login/google`);
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setGoogleLoginLoading(true);
    }
  };

  return (
    <div className="h-full flex justify-center items-center px-4">
      <Card
        className={`w-full max-w-[496px]  ${
          client === "nudii"
            ? "bg-primary text-white"
            : "bg-[#F5F7F9] text-card-foreground"
        } flex flex-col gap-y-[32px] items-center md:rounded-2xl border py-8 md:shadow-[0_4px_20px_rgba(36,36,36,0.15)]`}
      >
        <Image
          src={"/images/mefIA/mefIAWhiteLogo.png"}
          width={232}
          height={95}
          alt="logo"
          priority
        />
        <CardContent className=" w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-5 w-full"
          >
            <div className="w-full">
              <Label>Email</Label>
              <div className="w-full relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="absolute right-2 cursor-pointer text-[#767676] top-4">
                  <Mail />
                </span>
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label>Password</Label>
              <div className="w-full relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 cursor-pointer text-[#767676] top-4"
                >
                  {showPassword ? <EyeClosed /> : <Eye />}
                </span>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              variant={"default"}
              type="submit"
              className="w-full h-[44px] px-4 py-2 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  Login <ArrowRight />
                </>
              )}
            </Button>
          </form>

          <div
            className={`w-full relative border ${
              client === "nudii" ? "border-white" : "border-[#767676]"
            }`}
            style={{ marginTop: "36px", marginBottom: "36px" }}
          >
            <p
              className={`absolute left-[46%] z-99  ${
                client === "nudii" ? "bg-primary text-white" : "bg-[#F5F7F9]"
              }  top-[-20px] p-2 rounded-full`}
            >
              Or
            </p>
          </div>

          <Button
            variant={"default"}
            className="w-full h-[44px] flex items-center gap-2 px-4 py-2 font-semibold"
            onClick={handleLoginWithGoogle}
            disabled={googleLoginLoading}
          >
            {googleLoginLoading ? (
              <Loader />
            ) : (
              <div className="flex items-center gap-2">
                Continue with Google
                <FcGoogle size={24} />
              </div>
            )}
          </Button>

          {/* <Button
            variant={"default"}
            className="w-full h-[44px] flex items-center gap-2 px-4 py-2 font-semibold"
          >
            Continue with Apple <BsApple size={24} color="#000" />
          </Button> */}

          <div className="w-full flex items-center justify-center mt-4 gap-[2px]">
            <h2
              className={`${
                client === "nudii" ? "text-white" : "text-[#242424]"
              } text-[14px]`}
            >
              Don't have an account?
            </h2>
            <Link
              className={`${
                client === "nudii" ? "text-white" : "text-primary"
              } font-bold underline hover:opacity-90`}
              href="/signup"
            >
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
