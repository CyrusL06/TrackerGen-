// Backend API base URL, usually the deployed server or local Express server.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let csrfTokenPromise = null;

function getCsrfToken() {
  if (!csrfTokenPromise) {
    csrfTokenPromise = fetch(`${API_BASE_URL}/api/auth/csrf-token`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => data.csrfToken)
      .catch(() => {
        csrfTokenPromise = null;
        return null;
      });
  }

  return csrfTokenPromise;
}

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
  const csrfToken = await getCsrfToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  const res = await fetch(`${API_BASE_URL}/api/transactions`, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify(loadNew),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create transaction");
  }

  return data.transaction;
}

export async function updateTransactionById(id, payload) {
  const csrfToken = await getCsrfToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  const res = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
    method: "PUT",
    credentials: "include",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update transaction");
  }

  return data.transaction;
}

export async function deleteTransactionById(id) {
  const csrfToken = await getCsrfToken();
  const headers = {};

  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  const res = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete transaction");
  }

  return data;
}

export async function fetchTelegramProfile() {
  const res = await fetch(`${API_BASE_URL}/api/profile/telegram`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to load Telegram setup");
  }

  return data;
}

export async function createTelegramLinkCode() {
  const csrfToken = await getCsrfToken();
  const headers = {};

  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  const res = await fetch(`${API_BASE_URL}/api/profile/telegram-link-code`, {
    method: "POST",
    credentials: "include",
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to create Telegram link code");
  }

  return data;
}

export function goToSocialLogin(provider, returnTo = "/dashboard") {
  window.location.assign(
    `${API_BASE_URL}/auth/login/${provider}?returnTo=${encodeURIComponent(returnTo)}`,
  );
}

export async function completeOnboarding(payload) {
  const csrfToken = await getCsrfToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  const res = await fetch(`${API_BASE_URL}/api/profile/onboarding-complete`, {
    method: "POST",
    credentials: "include",
    headers,
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
  const csrfToken = await getCsrfToken();
  const headers = {};

  if (csrfToken) {
    headers["x-csrf-token"] = csrfToken;
  }

  const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers,
  });

  const data = await res.json();

  if (data.logoutUrl) {
    window.location.assign(data.logoutUrl);
  }

  return data;
}
