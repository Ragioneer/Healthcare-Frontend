"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "axios";
import Image from "next/image";
import { Eye, EyeClosed, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import { useClient } from "@/context/ClientContext";
import Loader from "@/components/ui/Loader";
import { toast } from "react-toastify";
import PhoneInput from "@/components/ui/PhoneInput";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function SignupPage() {
  const router = useRouter();
  const client = useClient();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNo, setPhoneNo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [diagnosis, setDiagnosis] = useState<string>("undiagnosed");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<{
    name: string;
    email: string;
    phoneNo: string;
    password: string;
  }>({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
  });

  const validateName = (value: string) => value.trim() !== "";
  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validatePassword = (value: string) => value.length >= 6;

  const handleSignup = async () => {
    const newErrors = {
      name: validateName(name) ? "" : "Name is required",
      email: validateEmail(email) ? "" : "Invalid email address",
      phoneNo: phoneNo.length === 0 ? "Phone number is required" : "",
      password: validatePassword(password)
        ? ""
        : "Password must be at least 6 characters",
    };

    setError(newErrors);

    const hasError = Object.values(newErrors).some((msg) => msg !== "");
    if (hasError) return;

    setIsLoading(true);
    try {
      await axios.post(`${baseURL}/auth/signup`, {
        full_name: name,
        email,
        phone_number: phoneNo,
        password,
        diagnosis,
      });

      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error(
        `${err.response?.data?.detail || "Signup failed. Please try again."}`
      );
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
        className={`w-full max-w-[496px] ${
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
        />
        <CardContent className="space-y-5 w-full">
          <div className="w-full">
            <Label>Full Name</Label>
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={error.name ? "border-red-500" : ""}
            />
            {error.name && (
              <p className="text-red-500 text-sm mt-1">{error.name}</p>
            )}
          </div>

          <div className="w-full">
            <Label>Email</Label>
            <div className="w-full relative">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error.email ? "border-red-500" : ""}
              />
              <span className="absolute right-2 cursor-pointer text-[#767676] top-4">
                <Mail />
              </span>
            </div>
            {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
          </div>

          <div className="w-full">
            <Label>Phone Number</Label>
            <div className="w-full relative">
              {/* <Input
                type="tel"
                placeholder="000-0000000"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className={error.phoneNo ? "border-red-500" : ""}
              /> */}
              <PhoneInput
                phoneNo={phoneNo}
                setPhoneNo={setPhoneNo}
                error={error.phoneNo}
              />
              <span className="absolute right-2 cursor-pointer text-[#767676] top-4">
                <Phone />
              </span>
            </div>
            {error.phoneNo && (
              <p className="text-red-500 text-sm mt-1">{error.phoneNo}</p>
            )}
          </div>

          <div className="w-full">
            <Label>Password</Label>
            <div className="w-full relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error.password ? "border-red-500" : ""}
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 cursor-pointer text-[#767676] top-4"
              >
                {showPassword ? <EyeClosed /> : <Eye />}
              </span>
            </div>
            {error.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
          </div>

          <div>
            <Label
              className={client === "nudii" ? "text-white" : "text-[#242424]"}
            >
              Diagnosis?
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {[
                {
                  label: "Crohn's Disease",
                  value: "crohn",
                  id: "crohn-disease",
                },
                {
                  label: "Ulcerative Colitis",
                  value: "ulcerative",
                  id: "ulcerative-colitis",
                },
                {
                  label: "Not diagnosed yet",
                  value: "undiagnosed",
                  id: "not-diagnosed-yet",
                },
              ].map(({ label, value, id }) => (
                <div className="flex items-center gap-2" key={id}>
                  <input
                    id={id}
                    type="radio"
                    value={value}
                    name="diagnosis"
                    className="w-4 h-4 accent-primary cursor-pointer"
                    checked={diagnosis === value}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                  <label
                    htmlFor={id}
                    className={`text-[10px] cursor-pointer ${
                      client === "nudii" ? "text-white" : "text-[#242424]"
                    } md:text-[14px]`}
                  >
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSignup}
            variant={"default"}
            className="w-full h-[44px] px-4 py-2 font-semibold"
            disabled={isLoading}
          >
            {isLoading ? <Loader /> : "Signup"}
          </Button>

          <div
            className={`w-full relative border ${
              client === "nudii" ? "border-white" : "border-[#767676]"
            }`}
            style={{ marginTop: "36px", marginBottom: "36px" }}
          >
            <p
              className={`absolute left-[46%] z-99 ${
                client === "nudii" ? "bg-primary text-white" : "bg-[#F5F7F9]"
              } top-[-20px] p-2 rounded-full`}
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

          <div className="w-full flex items-center justify-center mt-8 gap-[2px]">
            <h2
              className={`${
                client === "nudii" ? "text-white" : "text-[#242424]"
              } text-[14px]`}
            >
              Already have an account?
            </h2>
            <Link
              className={`${
                client === "nudii" ? "text-white" : "text-primary"
              } font-bold underline hover:opacity-90`}
              href="/login"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
