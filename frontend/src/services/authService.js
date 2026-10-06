const AUTH_API_URL =
  import.meta.env.VITE_AUTH_API_URL ||
  "http://localhost:8082/api/auth";

async function handleResponse(response) {
  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const data = await response.json();

      if (data.message) {
        message = data.message;
      } else if (data.errors) {
        message = Object.values(data.errors).join(", ");
      }
    } catch {
      // Keep default message
    }

    throw new Error(message);
  }

  return response.json();
}

export async function login(identifier, password) {
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier,
      password,
    }),
  });

  return handleResponse(response);
}

export async function getCurrentUser(accessToken) {
  const response = await fetch(`${AUTH_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}

export async function changePassword(
  accessToken,
  currentPassword,
  newPassword
) {
  const response = await fetch(
    `${AUTH_API_URL}/change-password`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    }
  );

  return handleResponse(response);
}
