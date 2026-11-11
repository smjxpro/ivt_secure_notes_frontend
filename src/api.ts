const BASE_URL = "/api";

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

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.message || `Request failed with HTTP status ${response.status}`);
    }

    return payload as T;
}