const API_URL = "http://localhost:8080/api";

export async function getSaludo() {
    const response = await fetch(`${API_URL}/saludo`);
    return response.text();
}