import React, { createContext, useContext, useEffect, useState } from "react";
import useFetch from "./hooks/use-fetch";
import { getCurrentUser } from "./db/ApiAuth";

const UrlContext = createContext();

const Urlprovider = ({ children }) => {
  const {
    data: user,
    loading,
    error,
    fn: fnGetUser,
  } = useFetch(getCurrentUser);

  // Supabase user is authenticated only if we have a valid user object with an id
  // (some hooks or APIs may return an empty object which would be truthy)
  const isAuthenticated = Boolean(user && user.id);

  useEffect(() => {
    fnGetUser();
  }, []);

  return (
    <UrlContext.Provider value={{ user, loading, fnGetUser, isAuthenticated }}>
      {children}
    </UrlContext.Provider>
  );
};

export const urlState = () => {
  return useContext(UrlContext);
};

export default Urlprovider;
