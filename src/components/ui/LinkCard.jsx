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

  const {
    loading: loadingDelete,
    error: errorDelete,
    fn: fnDelete,
  } = useFetch(deleteUrl, url?.id);
  const downloadHandler = async () => {
    try {
      const qrUrl = url?.qr;
      if (!qrUrl) return;

      const resp = await fetch(qrUrl, { mode: "cors" });
      const blob = await resp.blob();
      const filename = `qr-${url?.title || "code"}.png`;

      // Prefer Web Share API with Files on supported mobile browsers
      if (
        navigator.canShare &&
        navigator.canShare({
          files: [new File([blob], filename, { type: blob.type })],
        })
      ) {
        const file = new File([blob], filename, { type: blob.type });
        await navigator.share({ files: [file], title: filename });
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const element = document.createElement("a");
      element.href = objectUrl;
      element.download = filename;
      document.body.appendChild(element);
      try {
        element.click();
      } catch (e) {
        window.open(objectUrl, "_blank");
      }
      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        element.remove();
      }, 1000);
    } catch (err) {
      console.error("QR download failed", err);
      if (url?.qr) window.open(url.qr, "_blank");
    }
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
        <span
          className="flex items-center gap-2 hover:underline hover:cursor-pointer text-gray-300 truncate max-w-[120px] sm:max-w-[180px]"
          title={url.original_url}
        >
          {url.original_url}
        </span>
        <span className="text-sm font-extralight flex items-end flex-1 gap-2">
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>

      <div>
        <Button
          variant="ghost"
          onClick={() => {
            navigator.clipboard.writeText(
              `${appUrl}/${url?.custom_url ? url?.custom_url : url?.short_url}`
            );
          }}
        >
          <Copy />
        </Button>

        <Button variant="ghost" onClick={downloadHandler}>
          <Download />
        </Button>
        <Button
          variant="ghost"
          onClick={() => fnDelete().then(() => fetchUrls())}
        >
          {loadingDelete ? <BeatLoader size={10} color="white" /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;
