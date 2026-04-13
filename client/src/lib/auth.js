
// Base URL for my cloudflaere
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


//LoGIN Page
export function goToLogin(returnTo = "/dashboard") {
  window.location.assign(
    `${API_BASE_URL}/auth/login?returnTo=${encodeURIComponent(returnTo)}`,
  );
}

//Go To Signing Up 
export function goToSignup() {
  window.location.assign(`${API_BASE_URL}/auth/signup`);
}



export function goToSocialLogin(provider, returnTo = "/dashboard") {
  window.location.assign(
    `${API_BASE_URL}/auth/login/${provider}?returnTo=${encodeURIComponent(returnTo)}`,
  );
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
