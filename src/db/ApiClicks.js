import supabase from "./supabase";

export async function getClicksForUrls(urlIds) {
  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);
  if (error) throw new Error(error.message);
  return data;
}


export async function getClicksForUrl(url_id) {
  if (!url_id) throw new Error("URL ID is required");

  console.log("Fetching clicks for URL ID:", url_id);

  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error(error.message);
  }
  
  console.log("Clicks data:", data);
  return data || [];
}

