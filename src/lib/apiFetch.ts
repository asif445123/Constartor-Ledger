// Wraps fetch() to automatically send the user's selected language
// as an "X-Locale" header, so API routes can respond in the right language.
export function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const locale = typeof window !== "undefined" ? localStorage.getItem("locale") || "ur" : "ur";
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "X-Locale": locale,
    },
  });
}
