import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { getLongURL, storeClicks } from "@/db/ApiUrl";
import { BarLoader } from "react-spinners";

const RedirectingLink = () => {
  const { id } = useParams();
  const { loading, error, data, fn: fnGetLongURL } = useFetch(getLongURL, id);

  useEffect(() => {
    // Fetch the long URL when component mounts
    fnGetLongURL();
  }, []);

  useEffect(() => {
    // When data is loaded, store click and redirect
    if (data && !loading) {
      storeClicks({ id: data.id, original_url: data.original_url });
    }
  }, [data]);

  if (loading) {
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
