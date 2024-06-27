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

  const bearerToken = token || localStorage.getItem("access_token");

  const api: typeof useFetch = (url) => {
    return useFetch(url, {
      params: query,
      baseURL: config.public.apiUrl + "/api",
      key: url.toString(),
      method: method,
      headers: token ? [["Authorization", "Bearer " + token]] : [["Authorization", "Bearer " + bearerToken]],
      body: formData,
    });
  };

  return { api };
};

export const isAuthorized = async (accessToken: string) => {
  const { api } = useApi(undefined, "GET", accessToken, undefined);
  const { error, data } = await api<ResponseResultType>(`/auth/is_authorized`);

  if (error.value) {
    return false;
  }
  return data.value;
}

export const getProfile = async (accessToken: string) => {
  const { api } = useApi(undefined, "GET", accessToken, undefined);
  const { error, data } = await api<ResponseResultType>(`/user`);

  if (error.value) {
    return null;
  }
  
  return data.value?.data;
}
