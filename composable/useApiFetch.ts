export type ResponseResultType = {
  version: string;
  data: { [key: string]: any };
  result: boolean;
};

export const useApi = (
  query: Object | undefined = undefined,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  token: string | null = null,
  formData: FormData | Object | undefined = undefined
) => {
  const config = useRuntimeConfig();

  const api: typeof useFetch = (url) => {
    return useFetch(url, {
      params: query,
      baseURL: config.public.apiUrl + "/api",
      key: url.toString(),
      method: method,
      headers: token ? [["Authorization", "Bearer " + token]] : [],
      body: formData,
    });
  };

  return { api };
};
