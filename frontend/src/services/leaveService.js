const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8082/api/leaves";

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

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function getAuthHeaders(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function getAllLeaveRequests(
  accessToken
) {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(accessToken),
  });

  return handleResponse(response);
}

export async function getMyLeaveRequests(
  accessToken
) {
  const response = await fetch(
    `${API_URL}/my`,
    {
      headers: getAuthHeaders(accessToken),
    }
  );

  return handleResponse(response);
}

export async function createLeaveRequest(
  leaveRequest,
  accessToken
) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      ...getAuthHeaders(accessToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leaveRequest),
  });

  return handleResponse(response);
}

export async function updateLeaveStatus(
  id,
  status,
  accessToken
) {
  const response = await fetch(
    `${API_URL}/${id}/status?status=${encodeURIComponent(
      status
    )}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(accessToken),
    }
  );

  return handleResponse(response);
}

export async function deleteLeaveRequest(
  id,
  accessToken
) {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(accessToken),
    }
  );

  return handleResponse(response);
}
