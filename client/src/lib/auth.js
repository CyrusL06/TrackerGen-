// Backend API base URL, usually the deployed server or local Express server.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function goToLogin(returnTo = "/dashboard") {
  window.location.assign(
    `${API_BASE_URL}/auth/login?returnTo=${encodeURIComponent(returnTo)}`,
  );
}

export function goToSignup() {
  window.location.assign(`${API_BASE_URL}/auth/signup`);
}

export async function fetchTransactions() {
  const res = await fetch(`${API_BASE_URL}/api/transactions`, {
    credentials: "include",
  });

  const data = await res.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.transactions)) {
    return data.transactions;
  }

  return [];
}

export async function createTransaction(loadNew) {
  const res = await fetch(`${API_BASE_URL}/api/transactions`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loadNew),
  });

  const data = await res.json();
  return data.transaction;
}

export async function updateTransactionById(id, payload) {
  const res = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update transaction");
  }

  return data.transaction;
}

export async function deleteTransactionById(id) {
  const res = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();
  return data;
}

export function goToSocialLogin(provider, returnTo = "/dashboard") {
  window.location.assign(
    `${API_BASE_URL}/auth/login/${provider}?returnTo=${encodeURIComponent(returnTo)}`,
  );
}

export async function completeOnboarding(payload) {
  const res = await fetch(`${API_BASE_URL}/api/profile/onboarding-complete`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to complete onboarding");
  }

  return data;
}

export async function fetchCurrentUser() {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: "include",
  });

  return res.json();
}


export async function logout() {
  const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (data.logoutUrl) {
    window.location.assign(data.logoutUrl);
  }

  return data;
}
