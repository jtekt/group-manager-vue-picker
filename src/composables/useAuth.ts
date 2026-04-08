import axios from "axios";

export function useFetch(
  url: string,
  params: Record<string, unknown> = {},
  token: string | null = null,
) {
  return axios.get(url, {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
