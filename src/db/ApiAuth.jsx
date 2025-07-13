import supabase from "./supabase";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentUser() {
  const { data: session, error } = await supabase.auth.getSession();

  if (!session.session) return null;

  if (error) throw new Error(error.message);
  return session.session?.user;
}

export async function register({ name, email, password, picture }) {
  const fileName = `dp-${name.split(" ").join("-")}-${Math.random()}`;
  const { error: storageError } = await supabase.storage
    .from("picture")
    .upload(fileName, picture);
  if (storageError) throw new Error(storageError.message);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        picture: `${supabaseUrl}/storage/v1/object/public/picture/${fileName}`,
      },
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
