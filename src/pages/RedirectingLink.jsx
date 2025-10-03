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
    // Fetch the long URL when component mounts
    console.log("RedirectingLink: Fetching URL for ID:", id);
    fnGetLongURL(id);
  }, []);

  useEffect(() => {
    // When data is loaded, store click and redirect
    if (data && !loading && !redirecting) {
      console.log("RedirectingLink: Data loaded, redirecting to:", data.original_url);
      setRedirecting(true);
      // Call storeClicks which will handle the redirection
      storeClicks({ id: data.id, original_url: data.original_url });
    }
  }, [data, loading, redirecting]);

  if (loading || redirecting) {
    return (
      <>
        <BarLoader width={"100%"} color="white" />
        <br />
        Redirecting...........
      </>
    );
  }

  if (error) {
    return <div>Error: Link not found or invalid</div>;
  }

  return null;
};

export default RedirectingLink;
