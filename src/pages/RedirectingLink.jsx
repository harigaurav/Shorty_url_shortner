import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { getLongURL, storeClicks } from "@/db/ApiUrl";
import { BarLoader } from "react-spinners";

const RedirectingLink = () => {
  const { id } = useParams();
  const { loading, error, data, fn: fnGetLongURL } = useFetch(getLongURL);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (id) {
      console.log("RedirectingLink: Fetching URL for ID:", id);
      fnGetLongURL(id);
    }
  }, [id]);

  useEffect(() => {
    if (data && !loading && !redirecting) {
      console.log("RedirectingLink: Data loaded, redirecting to:", data.original_url);
      setRedirecting(true);
      storeClicks({ id: data.id, original_url: data.original_url });
    }
  }, [data, loading, redirecting]);

  if (!id) {
    return <div>Error: Missing short URL ID</div>;
  }

  if (loading || redirecting) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <BarLoader width={"100%"} color="white" />
        <p>Redirecting, please wait...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: Link not found or invalid</div>;
  }

  return null;
};

export default RedirectingLink;
