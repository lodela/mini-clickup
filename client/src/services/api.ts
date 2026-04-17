const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode?: number;
}

/** Error thrown when the server responds with a non-2xx status. */
export class ApiRequestError extends Error {
  status: number;
  data: ApiError;
  constructor(status: number, data: ApiError) {
    super(data?.message || `Request failed with status ${status}`);
    this.name = "ApiRequestError";
    this.status = status;
    this.data = data;
  }
}

const GUEST_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

function handleErrorStatus(status: number, data: ApiError) {
  switch (status) {
    case 401: {
      const isGuestPath = GUEST_PATHS.some((p) =>
        window.location.pathname.startsWith(p),
      );
      if (!isGuestPath) {
        window.location.href = "/login";
      }
      break;
    }
    case 403:
      console.error("Forbidden access:", data?.message);
      break;
    case 404:
      console.error("Resource not found:", data?.message);
      break;
    case 429:
      console.error("Too many requests - please try again later");
      break;
    case 500:
      console.error("Server error:", data?.message);
      break;
    default:
      console.error("API error:", data?.message);
  }
}

async function request<T>(
  method: string,
  url: string,
  body?: unknown,
): Promise<{ data: T }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      signal: controller.signal,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    const json = (await res.json()) as T;

    if (!res.ok) {
      const errData = json as unknown as ApiError;
      handleErrorStatus(res.status, errData);
      throw new ApiRequestError(res.status, errData);
    }

    return { data: json };
  } catch (err) {
    if (err instanceof ApiRequestError) throw err;
    console.error("No response from server - please check your connection");
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export const api = {
  get: <T>(url: string) => request<T>("GET", url),
  post: <T>(url: string, data?: unknown) => request<T>("POST", url, data),
  put: <T>(url: string, data?: unknown) => request<T>("PUT", url, data),
  patch: <T>(url: string, data?: unknown) => request<T>("PATCH", url, data),
  delete: <T>(url: string) => request<T>("DELETE", url),
};
