const rawBaseUrl = import.meta.env.VITE_API_URL;
if (!rawBaseUrl) {
    throw new Error("VITE_API_URL environment variable is required");
}
const BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

export const getAuthToken = (): string | null => localStorage.getItem("token");

export const setAuthToken = (token: string): void => localStorage.setItem("token", token);

export const removeAuthToken = (): void => localStorage.removeItem("token");

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const response = await fetch(`${BASE_URL}${normalizedEndpoint}`, {
        ...options,
        headers,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.message || `Request failed with HTTP status ${response.status}`);
    }

    return payload as T;
}