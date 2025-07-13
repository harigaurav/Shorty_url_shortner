import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/use-fetch";
import { register } from "@/db/ApiAuth";
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

const Signup = () => {
  const [errors, setErrors] = useState([]);
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    picture: "",
    password: "",
  });

  const handleInputchange = (e) => {
    const { name, value, files } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const { data, loading, error, fn: fnSignup } = useFetch(register, formdata);
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string()
          .required("Name is required")
          .min(3, "Name must be at least 3 characters"),
        email: Yup.string()
          .email("Invalid email")
          .required("Email is required"),
        picture: Yup.mixed().required("Profile picture is required"),
        password: Yup.string()
          .required("Password is required")
          .min(6, "Password must be at least 6 characters"),
      });
      await schema.validate(formdata, { abortEarly: false });
      await fnSignup();
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };
  return (
    <Card className="w-full border-5 border-[#CBACAC]">
      <CardHeader>
        <CardTitle className="text-center">Create a new account</CardTitle>
        {/* <CardDescription className="text-center">
          Enter your details to create a new account
        </CardDescription> */}
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                className="border-2 border-[#CBACAC]"
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                onChange={handleInputchange}
              />
              {errors.name && <Error message={errors.name} />}
            </div>

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
              <Label htmlFor="picture">Profile Picture</Label>
              <Input
                className="border-2 border-[#CBACAC]"
                id="picture"
                name="picture"
                type="file"
                accept="image/*"
                required
                onChange={handleInputchange}
              />
              {errors.picture && <Error message={errors.picture} />}
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
          onClick={handleSignup}
          variant="outline"
          className=" bg-[#CBACAC] w-full hover:bg-[#E6D6D6] border-[#CBACAC]"
        >
          {loading ? <BeatLoader size={10} color="black" /> : "Signup"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
