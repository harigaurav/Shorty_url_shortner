import React, { useEffect, useState } from "react";
import { BarLoader, HashLoader } from "react-spinners";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { urlState } from "@/context";
import useFetch from "@/hooks/use-fetch";
import { getUrls } from "@/db/ApiUrl";
import { getClicksForUrls } from "@/db/ApiClicks";
import Error from "@/components/Error";
import LinkCard from "@/components/ui/LinkCard";
import CreateLink from "@/components/ui/CreateLink";

const Dashboard = () => {
  const [searchquery, setSearchQuery] = useState("");
  const { user } = urlState();
  const {
    loading,
    error,
    data: urls,
    fn: fnUrls,
  } = useFetch(getUrls, user?.id);
  const {
    loading: loadingClicks,
    error: errorClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url?.id)
  );

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (urls?.length) {
      fnClicks();
    }
  }, [urls?.length]);

  const filteredUrls = urls?.filter((url) => {
    return url?.title?.toLowerCase().includes(searchquery.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-10 p-3">
      {(loading || loadingClicks) && (
        <BarLoader color="white" width={"100%"} />
      )}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-white font-bold text-2xl">Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white font-bold text-2xl">{urls?.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-white font-bold text-2xl">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white font-bold text-2xl">{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between p-3">
        <h1 className="text-4xl font-extrabold">My Links</h1>
       <CreateLink/>
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchquery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
      </div>

      {(error || errorClicks) && <Error message={error?.message} />}
      {(filteredUrls || []).map((url, i) => {
        return <LinkCard key={i} url={url} fetchUrls={fnUrls} />;
      })}
    </div>
  );
};

export default Dashboard;
