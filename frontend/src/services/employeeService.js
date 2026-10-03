const EMPLOYEE_API_URL =
  import.meta.env.VITE_EMPLOYEE_API_URL ||
  "http://localhost:8082/api/users/employees";

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

export async function getEmployees(accessToken) {
  const response = await fetch(
    EMPLOYEE_API_URL,
    {
      headers: getAuthHeaders(accessToken),
    }
  );

  return handleResponse(response);
}

export async function getEmployeeById(
  id,
  accessToken
) {
  const response = await fetch(
    `${EMPLOYEE_API_URL}/${id}`,
    {
      headers: getAuthHeaders(accessToken),
    }
  );

  return handleResponse(response);
}

export async function createEmployee(
  employee,
  accessToken
) {
  const response = await fetch(
    EMPLOYEE_API_URL,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(accessToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    }
  );

  return handleResponse(response);
}

export async function updateEmployee(
  id,
  employee,
  accessToken
) {
  const response = await fetch(
    `${EMPLOYEE_API_URL}/${id}`,
    {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(accessToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    }
  );

  return handleResponse(response);
}

export async function setEmployeeEnabled(
  id,
  enabled,
  accessToken
) {
  const response = await fetch(
    `${EMPLOYEE_API_URL}/${id}/enabled?enabled=${enabled}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(accessToken),
    }
  );

  return handleResponse(response);
}

export async function resetEmployeePassword(
  id,
  temporaryPassword,
  accessToken
) {
  const response = await fetch(
    `${EMPLOYEE_API_URL}/${id}/password`,
    {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(accessToken),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        temporaryPassword,
      }),
    }
  );

  return handleResponse(response);
}
