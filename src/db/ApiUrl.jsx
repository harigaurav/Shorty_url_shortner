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

export async function createUrl({ title, long_url, custom_link, user_id }, qrcode) {
  const generatedShortUrl = Math.random().toString(36).substring(2,6);
  const fileName = `qr-${generatedShortUrl}`;
  
  const { error: storageError } = await supabase.storage
    .from("qr")
    .upload(fileName, qrcode);
  if (storageError) throw new Error(storageError.message);
  
  const qr = `${supabaseUrl}/storage/v1/object/public/qr/${fileName}`;
  
  const { data, error } = await supabase
    .from("urls")
    .insert([{
      original_url: long_url,
      short_url: generatedShortUrl,
      title,
      user_id,
      custom_url: custom_link || generatedShortUrl,
      qr,
    }])
    .select();
  if (error) throw new Error(error.message);
  return data;
}
