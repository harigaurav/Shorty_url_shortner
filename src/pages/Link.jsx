import { urlState } from "@/context";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { get_URL } from "@/db/ApiUrl";
import { getClicksForUrl } from "@/db/ApiClicks";
import { deleteUrl } from "@/db/ApiUrl";
import { BarLoader, HashLoader } from "react-spinners";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Trash } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import LocationStats from "@/components/ui/LocationStats";
import DeviceStats from "@/components/ui/DeviceStats";

const Link = () => {
  const { user } = urlState();
  const { id } = useParams();
  const navigate = useNavigate();

  const downloadHandler = () => {
    const element = document.createElement("a");
    const file = new Blob([data?.qr], { type: "image/png" });
    element.href = URL.createObjectURL(file);
    element.download = `qr-${data?.title}.png`;
    document.body.appendChild(element);
    element.click();
  };

  const {
    loading,
    error,
    data,
    fn: fnGetURL,
  } = useFetch(get_URL, { id, user_id: user?.id });
  const {
    loading: loadingstats,
    error: errorstats,
    data: stats,
    fn: fnstats,
  } = useFetch(getClicksForUrl, id);

  const {
    loading: loadingdel,
    error: errordelete,
    fn: fnDelete,
  } = useFetch(deleteUrl, id);

  useEffect(() => {
    fnGetURL();
  }, []);
  useEffect(() => {
    if (!error && loading === false) fnstats();
  }, [loading, error]);

  if (error) {
    navigate("/dashboard");
  }
  let link = "http://localhost:5173/";
  if (data) {
    link = data?.custom_url ? link + data?.custom_url : link + data?.short_url;
  }

  return (
    <>
      {(loading || loadingstats) && (
        <BarLoader color="white" width={"100%"} />
      )}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 p-3 lg:p-6 justify-between min-h-screen">
        <div className="flex flex-col gap-3 lg:gap-5 p-3 rounded-lg w-full lg:w-auto">
          <span className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white break-words">
            {data?.title}
          </span>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Link2 className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white mt-1 sm:mt-2 flex-shrink-0" />
            <span className="text-sm sm:text-lg lg:text-2xl font-bold text-white">
              Original Link:
            </span>
            <a
              className="text-sm sm:text-lg lg:text-2xl font-bold text-blue-500 hover:underline hover:cursor-pointer break-all"
              href={data?.original_url}
            >
              {data?.original_url}
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Link2 className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white mt-1 sm:mt-2 flex-shrink-0" />
            <span className="text-sm sm:text-lg lg:text-2xl font-bold text-white">
              Short Link:
            </span>
            <a
              className="text-sm sm:text-lg lg:text-2xl font-bold text-blue-500 hover:underline hover:cursor-pointer break-all"
              href={`http://localhost:5173/${data?.custom_url ? data?.custom_url : data?.short_url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link}
            </a>
          </div>

          <span className="text-xs sm:text-sm text-gray-300">
            Created at: {new Date(data?.created_at).toLocaleString()}
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => {
                const textToCopy = `http://localhost:5173/${data?.custom_url ? data?.custom_url : data?.short_url}`;
                navigator.clipboard.writeText(textToCopy);
              }}
            >
              <Copy className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Copy</span>
            </Button>

            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs sm:text-sm"
              onClick={downloadHandler}
            >
              <Download className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Download</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => fnDelete().then(() => navigate("/dashboard"))}
            >
              {loadingdel ? (
                <BeatLoader size={8} color="white" />
              ) : (
                <>
                  <Trash className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">Delete</span>
                </>
              )}
            </Button>
          </div>
          <div className="flex justify-center lg:justify-start mt-4">
            <img
              src={data?.qr}
              className="border-2 border-blue-500 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64"
              alt="Qrcode"
            />
          </div>
        </div>
        <Card className="bg-transparent flex-1 h-full w-full lg:w-auto">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Stats
            </CardTitle>
          </CardHeader>
          {stats && stats?.length ? (
            <CardContent className="flex flex-col gap-3 lg:gap-5">
              <Card className="bg-transparent text-white border-2 border-white rounded-xl p-3 lg:p-5">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl">Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{stats?.length}</p>
                </CardContent>
              </Card>
              <div className="flex flex-col gap-3 lg:gap-5">
                <div className="border-2 border-white rounded-xl p-3 lg:p-5">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 lg:mb-4">
                    Location
                  </CardTitle>
                  <div className="overflow-x-auto">
                    <LocationStats stats={stats} />
                  </div>
                </div>
                <div className="border-2 border-white rounded-xl p-3 lg:p-5">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 lg:mb-4">
                    Device info
                  </CardTitle>
                  <div className="overflow-x-auto">
                    <DeviceStats stats={stats} />
                  </div>
                </div>
              </div>
            </CardContent>
          ) : (
            <CardHeader>
              <p className="text-sm sm:text-base text-red-500 ">No stats yet</p>
            </CardHeader>
          )}
        </Card>
      </div>
    </>
  );
};

export default Link;
