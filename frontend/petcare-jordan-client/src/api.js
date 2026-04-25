const API_BASE_URL = "http://localhost:5031/api";

function buildHeaders(headers = {}, token) {
  const merged = { ...headers };
  if (token) {
    merged.Authorization = `Bearer ${token}`;
  }
  return merged;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed for ${path}`);
  }

  return response.json();
}

export const api = {
  getDashboard: () => request("/dashboard/summary"),
  getPets: () => request("/pets"),
  getAdoptions: () => request("/adoptions"),
  getLostPets: () => request("/community/lost"),
  getFoundPets: () => request("/community/found"),
  createLostPetReport: (payload, token) =>
    request("/community/lost", {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }, token),
      body: JSON.stringify(payload)
    }),
  createFoundPetReport: (payload, token) =>
    request("/community/found", {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }, token),
      body: JSON.stringify(payload)
    }),
  uploadCommunityImage: (file, token) => {
    const formData = new FormData();
    formData.append("file", file);

    return request("/community/upload-image", {
      method: "POST",
      headers: buildHeaders({}, token),
      body: formData
    });
  },
  getChatVets: (token) =>
    request("/chat/vets", {
      headers: buildHeaders({}, token)
    }),
  getMyChatConversations: (token) =>
    request("/chat/conversations", {
      headers: buildHeaders({}, token)
    }),
  createChatConversation: (vetId, token) =>
    request("/chat/conversations", {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }, token),
      body: JSON.stringify({ vetId })
    }),
  getChatMessages: (conversationId, token) =>
    request(`/chat/conversations/${conversationId}/messages`, {
      headers: buildHeaders({}, token)
    }),
  sendChatMessage: (conversationId, message, token) =>
    request(`/chat/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }, token),
      body: JSON.stringify({ message })
    }),
  getUpcomingVaccines: (token) =>
    request("/medical/upcoming-vaccines", {
      headers: buildHeaders({}, token)
    }),
  getMyMedicalPets: (token) =>
    request("/medical/my-pets", {
      headers: buildHeaders({}, token)
    }),
  getNotifications: (userId) => request(`/community/notifications/${userId}`),
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }),
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
};
