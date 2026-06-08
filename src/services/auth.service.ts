import { supabase } from "./supabase";
import { createServiceError } from "@/types";

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin },
  });
  if (error) throw createServiceError(error.message, String(error.status));
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw createServiceError(error.message, String(error.status));
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw createServiceError(error.message, String(error.status));
}

export function getSession() {
  return supabase.auth.getSession();
}

export function onAuthStateChange(
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0],
) {
  return supabase.auth.onAuthStateChange(callback);
}
