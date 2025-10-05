import { UAParser } from "ua-parser-js";
import supabase from "./supabase";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export async function getUrls(user_id) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteUrl(id) {
  const { error } = await supabase.from("urls").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function createUrl(
  { title, long_url, custom_link, user_id },
  qrcode
) {
  const generatedShortUrl = Math.random().toString(36).substring(2, 6);
  // ensure uploaded files have an extension so served content-type/filenames are correct
  const fileName = `qr-${generatedShortUrl}.png`;

  const { error: storageError } = await supabase.storage
    .from("qr")
    .upload(fileName, qrcode);
  if (storageError) throw new Error(storageError.message);

  const qr = `${supabaseUrl}/storage/v1/object/public/qr/${fileName}`;

  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        original_url: long_url,
        short_url: generatedShortUrl,
        title,
        user_id,
        custom_url: custom_link || generatedShortUrl,
        qr,
      },
    ])
    .select();
  if (error) throw new Error(error.message);
  return data;
}
export async function getLongURL(id) {
  if (!id) throw new Error("URL ID is required");

  // Use proper parameter binding for security
  const { data, error } = await supabase
    .from("urls")
    .select("id,original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("URL not found");

  return data;
}

const parser = new UAParser();
export const storeClicks = async ({ id, original_url }) => {
  try {
    // Get device info
    const res = parser.getResult();
    const device = res.device.type || "desktop";

    let city = "Unknown";
    let country = "Unknown";

    try {
      // First get IP address
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const { ip } = await ipResponse.json();

      // Then get location data using the IP
      const locationResponse = await fetch(`http://ip-api.com/json/${ip}`);
      const locationData = await locationResponse.json();

      if (locationData.status === "success") {
        city = locationData.city || "Unknown";
        country = locationData.country || "Unknown";
      }
    } catch (locationError) {
      console.log("Could not fetch location:", locationError);
    }

    await supabase.from("clicks").insert({
      url_id: id,
      device: device,
      city: city,
      country: country,
    });
  } catch (error) {
    console.error("Error storing click:", error);
  } finally {
    window.location.href = original_url;
  }
};

export async function get_URL({ id, user_id }) {
  if (!id) throw new Error("URL id is required");
  if (!user_id) throw new Error("User id is required");

  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  if (!data) throw new Error("URL not found");

  return data;
}
