export function describeSupabaseError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (/failed to fetch|fetch failed|networkerror/i.test(message)) {
    return "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL, the anon key, and your network connection.";
  }
  if (/relation .* does not exist|column .* does not exist|schema cache/i.test(message)) {
    return `${message} Push the latest database migrations with npx supabase db push.`;
  }
  if (/row-level security|permission denied|jwt|not authenticated/i.test(message)) {
    return `${message} Sign in with an authorized account.`;
  }
  return message;
}
