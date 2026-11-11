const BASE_URL = "/api";

export const getAuthToken =(): string | null => localStorage.getItem("token");

export const setAuthToken = (token: string): void => localStorage.setItem("token", token);

export const removeAuthToken = (): void => localStorage.removeItem("token");

export const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<unknown> => {
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

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json().catch(() => ({}));
};