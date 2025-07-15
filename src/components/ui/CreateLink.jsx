import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { urlState } from "@/context";
import useFetch from "@/hooks/use-fetch";
import { createUrl } from "@/db/ApiUrl";
import { Input } from "./input";
import * as Yup from "yup";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./button";
import { Label } from "./label";
import { Card } from "./card";
import Error from "../Error";
import { QRCode } from "react-qrcode-logo";
import { BeatLoader } from "react-spinners";

const CreateLink = () => {
  const ref = useRef(); // Create a ref to store the QRCode component instance
  const navigate = useNavigate();
  const { user } = urlState();
  let [searchParams, setSearchParams] = useSearchParams();
  const long_link = searchParams.get("createNew");

  const [errors, setErrors] = useState({}); // Initialize as empty object instead of undefined
  const [formValues, setFormValues] = useState({
    title: "",
    long_url: long_link ? long_link : "",
    custom_link: "",
  });

  const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    long_url: Yup.string().required("Long url is required").url("Invalid url"),
    custom_link: Yup.string(),
  });

  const handlechange = (e) => {
    setFormValues({ ...formValues, [e.target.id]: e.target.value });
  };

  const {
    data,
    loading,
    error,
    fn: fnCreateURL,
  } = useFetch(createUrl, { ...formValues, user_id: user?.id });

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const createURL = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });
      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));
      console.log("Creating URL with:", { ...formValues, user_id: user?.id });
      await fnCreateURL(blob);
      setSearchParams({});
    } catch (e) {
      console.error("Error creating URL:", e);
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <Dialog
        defaultOpen={long_link}
        onOpenChange={(open) => {
          if (!open) {
            setSearchParams({});
          }
        }}
      >
        <form onSubmit={(e) => { e.preventDefault(); createURL(); }}>
          <DialogTrigger asChild>
            <Button variant="default">Create Link</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-black">
            <DialogHeader>
              <DialogTitle className="text-white">Create Link</DialogTitle>
            </DialogHeader>
            {formValues?.long_url && (
              <QRCode value={formValues.long_url} size={200} ref={ref} />
            )}
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Input
                  className="text-white"
                  id="title"
                  placeholder="Short Link's Title"
                  value={formValues.title}
                  onChange={handlechange}
                />
                {errors.title && <Error message={errors.title} />}
              </div>
              <div className="grid gap-3">
                <Input
                  className="text-white"
                  id="long_url"
                  placeholder="Enter long url"
                  value={formValues.long_url}
                  onChange={handlechange}
                />
                {errors.long_url && <Error message={errors.long_url} />}
              </div>
              <div className="flex items-center gap-2">
                <Card className="p-2  bg-transparent text-white">
                  shorty.in
                </Card>
                <h1 className="text-white text-2xl">/</h1>
                <Input
                  className="text-white"
                  id="custom_link"
                  placeholder=" Custom Link(optional)"
                  value={formValues.custom_link}
                  onChange={handlechange}
                />
                {errors.custom_link && <Error message={errors.custom_link} />}
              </div>
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="button"
                onClick={createURL}
                variant="destructive"
              >
                {loading ? <BeatLoader size={10} color="black" /> : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateLink;
