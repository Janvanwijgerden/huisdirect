"use server";

import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";

function getAuthErrorMessage(error: any): string {
  const message = error?.message?.toLowerCase() || "";

  if (message.includes("invalid login credentials")) {
    return "Onjuiste e-mail of wachtwoord.";
  }

  if (message.includes("email not confirmed")) {
    return "Bevestig eerst je e-mailadres voordat je inlogt.";
  }

  if (message.includes("user already registered")) {
    return "Dit e-mailadres is al geregistreerd.";
  }

  if (message.includes("password should be at least")) {
    return "Je wachtwoord moet minimaal 6 tekens bevatten.";
  }

  if (message.includes("unable to validate email address")) {
    return "Ongeldig e-mailadres.";
  }

  if (message.includes("signup is disabled")) {
    return "Registreren is momenteel niet mogelijk.";
  }

  if (message.includes("email rate limit exceeded")) {
    return "Je hebt te vaak een aanvraag gedaan. Probeer het over een paar minuten opnieuw.";
  }

  if (message.includes("same password")) {
    return "Je nieuwe wachtwoord moet anders zijn dan je huidige wachtwoord.";
  }

  if (message.includes("session not found")) {
    return "Je sessie is verlopen. Vraag opnieuw een resetlink aan.";
  }

  return "Er ging iets mis. Probeer het opnieuw.";
}

export async function signIn(prevState: any, formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: getAuthErrorMessage(error),
    };
  }

  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });

  if (error) {
    return {
      error: getAuthErrorMessage(error),
    };
  }

  redirect("/auth/register/success");
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
  });

  if (error) {
    return {
      error: getAuthErrorMessage(error),
    };
  }

  return {
    success: true,
  };
}

export async function updatePassword(formData: FormData) {
  const supabase = createClient();

  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return {
      error: getAuthErrorMessage(error),
    };
  }

  redirect("/auth/login?reset=success");
}

export async function signOut() {
  const supabase = createClient();

  await supabase.auth.signOut();

  redirect("/");
}