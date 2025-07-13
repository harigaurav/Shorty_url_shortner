import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/use-fetch";
import { login } from "@/db/ApiAuth";
import { useSearchParams } from "react-router-dom";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BeatLoader } from "react-spinners";
import Error from "./Error";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { urlState } from "@/context";

const Login = () => {
  const [errors, setErrors] = useState([]);
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const handleInputchange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { data, loading, error, fn: fnLogin } = useFetch(login, formdata);
  const { fnGetUser: fetchUser } = urlState();
  const Navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const LongLink = searchParams.get("createNew");

  useEffect(() => {
    if (data && error === null) {
      Navigate(`/dashboard?${LongLink ? `createNew=${LongLink}` : ""}`);
      fetchUser();
    }
  }, [data, error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        password: Yup.string()
          .required("Password is required")
          .min(6, "Password must be at least 6 characters"),
      });
      await schema.validate(formdata, { abortEarly: false });
      await fnLogin();
      console.log("Form is valid, proceeding with login");
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };
  return (
    <Card className="w-full border-5 border-[#CBACAC] ">
      <CardHeader>
        <CardTitle className="text-center">Login to your account</CardTitle>
        {/* <CardDescription className="text-center">
          Enter your email below to login to your account
        </CardDescription> */}
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                className="border-2 border-[#CBACAC]"
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                onChange={handleInputchange}
              />
              {errors.email && <Error message={errors.email} />}
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                className="border-2 border-[#CBACAC]"
                id="password"
                name="password"
                type="password"
                placeholder="*******"
                required
                onChange={handleInputchange}
              />
              {errors.password && <Error message={errors.password} />}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          type="submit"
          onClick={handleLogin}
          variant="outline"
          className=" bg-[#CBACAC] w-full hover:bg-[#E6D6D6] border-[#CBACAC]"
        >
          {loading ? <BeatLoader size={10} color="black" /> : "Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
