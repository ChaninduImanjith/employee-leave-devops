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

export async function getAllLeaveRequests() {
  const response = await fetch(API_URL);
  return handleResponse(response);
}

export async function getEmployeeLeaveRequests(employeeId) {
  const response = await fetch(
    `${API_URL}/employee/${encodeURIComponent(employeeId)}`
  );

  return handleResponse(response);
}

export async function createLeaveRequest(leaveRequest) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(leaveRequest),
  });

  return handleResponse(response);
}

export async function updateLeaveStatus(id, status) {
  const response = await fetch(
    `${API_URL}/${id}/status?status=${encodeURIComponent(status)}`,
    {
      method: "PATCH",
    }
  );

  return handleResponse(response);
}

export async function deleteLeaveRequest(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}
