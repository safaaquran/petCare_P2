const API_BASE_URL = "http://localhost:5031/api";

function getToken() {
  const storedUser = localStorage.getItem("petcareCurrentUser");
  if (!storedUser) {
    return "";
  }

  try {
    const user = JSON.parse(storedUser);
    return user?.token ?? "";
  } catch {
    return "";
  }
}

function toErrorMessage(payload, fallback) {
  if (!payload) {
    return fallback;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (payload.title && payload.errors) {
    const details = Object.values(payload.errors).flat().join(" ");
    return details ? `${payload.title} ${details}` : payload.title;
  }

  if (payload.message) {
    return payload.message;
  }

  if (payload.title) {
    return payload.title;
  }

  return fallback;
}

async function request(path, options = {}) {
  const { requiresAuth = false, ...rest } = options;
  const headers = {
    "Content-Type": "application/json",
    ...(rest.headers ?? {})
  };

  if (requiresAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers
  });

  if (!response.ok) {
    let payload;
    try {
      payload = await response.json();
    } catch {
      payload = await response.text();
    }

    throw new Error(toErrorMessage(payload, `Request failed for ${path}`));
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  getDashboard: () => request("/dashboard/summary"),
  getPets: () => request("/pets"),
  getAdoptions: () => request("/adoptions"),
  getLostPets: () => request("/community/lost"),
  getFoundPets: () => request("/community/found"),
  getUpcomingVaccines: () => request("/medical/upcoming-vaccines"),
  getNotifications: (userId) => request(`/community/notifications/${userId}`, { requiresAuth: true }),

  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  createPet: (payload) =>
    request("/pets", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify(payload)
    }),
  createLostPetReport: (payload) =>
    request("/community/lost", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify(payload)
    }),
  createFoundPetReport: (payload) =>
    request("/community/found", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify(payload)
    }),

  createMedicalRecord: (payload) =>
    request("/medical/records", {
      method: "POST",
      requiresAuth: true,
      body: JSON.stringify(payload)
    }),
  updateMedicalRecord: (recordId, payload) =>
    request(`/medical/records/${recordId}`, {
      method: "PUT",
      requiresAuth: true,
      body: JSON.stringify(payload)
    }),

  getPendingModeration: () => request("/admin/moderation/pending", { requiresAuth: true }),
  approveModerationItem: (kind, id) =>
    request(`/admin/moderation/${kind}/${id}/approve`, {
      method: "PUT",
      requiresAuth: true
    }),
  rejectModerationItem: (kind, id) =>
    request(`/admin/moderation/${kind}/${id}/reject`, {
      method: "PUT",
      requiresAuth: true
    }),
  deleteModerationItem: (kind, id) =>
    request(`/admin/moderation/${kind}/${id}`, {
      method: "DELETE",
      requiresAuth: true
    })
};
