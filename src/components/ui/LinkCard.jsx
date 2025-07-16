import React from "react";
import { Link } from "react-router-dom";
import { date } from "yup";
import { Button } from "./button";
import { Copy, Delete, Download, Trash } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/ApiUrl";
import { BeatLoader } from "react-spinners";

const appUrl = import.meta.env.VITE_APP_URL;

const LinkCard = ({ url, fetchUrls }) => {
  // Add guard clause
  if (!url) {
    return null;
  }

  const{loading:loadingDelete, error: errorDelete, fn: fnDelete} = useFetch(deleteUrl, url?.id);
  const downloadHandler = () => {
    const element = document.createElement("a");
    const file = new Blob([url?.qr], { type: "image/png" });
    element.href = URL.createObjectURL(file);
    element.download = `qr-${url?.title}.png`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className=" flex flex-col md:flex-row gap-5 border-2 border-white p-3 rounded-lg">
      <img
        src={url?.qr}
        className="w-32 h-32 ring ring-white rounded-lg"
        alt="qr code"
      />
      <Link to={`/link/${url?.id}`} className="flex flex-col gap-2 flex-1">
        <span className="text-3xl font-extrabold hover:underline hover:cursor-pointer">
          {url?.title}
        </span>
        <span className="text-2xl text-blue-500 font-bold hover:underline hover:cursor-pointer">
          {appUrl}/{url?.custom_url ? url?.custom_url : url?.short_url}
        </span>
        <span className="flex items-center gap-2 hover:underline hover:cursor-pointer">
          {url.original_url}
        </span>
        <span className="text-sm font-extralight flex items-end flex-1 gap-2">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>

      <div>
        <Button variant="ghost" onClick={() => {
            navigator.clipboard.writeText(
              `${appUrl}/${url?.custom_url ? url?.custom_url : url?.short_url}`
            );
          }}>
          <Copy />
        </Button>
       
        <Button variant="ghost" onClick={downloadHandler}>
          <Download />
        </Button>
         <Button variant="ghost" onClick={()=>fnDelete().then(()=>fetchUrls())}>
           {loadingDelete? <BeatLoader size={10} color="white" /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
