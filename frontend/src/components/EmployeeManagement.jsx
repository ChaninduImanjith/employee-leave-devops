import {
  useEffect,
  useState,
} from "react";

import { useAuth } from "../hooks/useAuth";

import {
  createEmployee,
  getEmployees,
  resetEmployeePassword,
  setEmployeeEnabled,
  updateEmployee,
} from "../services/employeeService";

const emptyForm = {
  fullName: "",
  email: "",
  employeeId: "",
  department: "",
  temporaryPassword: "",
};

export default function EmployeeManagement() {
  const { accessToken } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      return undefined;
    }

    let cancelled = false;

    getEmployees(accessToken)
      .then((data) => {
        if (!cancelled) {
          setEmployees(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setMessage({
            type: "error",
            text: error.message,
          });
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setMessage(null);

      if (editingId) {
        const updated =
          await updateEmployee(
            editingId,
            {
              fullName: form.fullName,
              email: form.email,
              employeeId: form.employeeId,
              department: form.department,
            },
            accessToken
          );

        setEmployees((previous) =>
          previous.map((employee) =>
            employee.id === editingId
              ? updated
              : employee
          )
        );

        setMessage({
          type: "success",
          text: "Employee updated successfully.",
        });
      } else {
        const created =
          await createEmployee(
            {
              fullName: form.fullName,
              email: form.email,
              employeeId: form.employeeId,
              department: form.department,
              temporaryPassword:
                form.temporaryPassword,
            },
            accessToken
          );

        setEmployees((previous) =>
          [...previous, created].sort((a, b) =>
            a.fullName.localeCompare(b.fullName)
          )
        );

        setMessage({
          type: "success",
          text: "Employee created successfully.",
        });
      }

      resetForm();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(employee) {
    setEditingId(employee.id);

    setForm({
      fullName: employee.fullName,
      email: employee.email,
      employeeId: employee.employeeId,
      department: employee.department,
      temporaryPassword: "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleEnabledChange(employee) {
    try {
      setActionId(employee.id);
      setMessage(null);

      const updated =
        await setEmployeeEnabled(
          employee.id,
          !employee.enabled,
          accessToken
        );

      setEmployees((previous) =>
        previous.map((item) =>
          item.id === employee.id
            ? updated
            : item
        )
      );

      setMessage({
        type: "success",
        text: updated.enabled
          ? "Employee account enabled successfully."
          : "Employee account disabled successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setActionId(null);
    }
  }

  async function handlePasswordReset(employee) {
    const temporaryPassword =
      window.prompt(
        `Enter a new temporary password for ${employee.fullName}:`
      );

    if (!temporaryPassword) {
      return;
    }

    if (temporaryPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Temporary password must contain at least 8 characters.",
      });

      return;
    }

    try {
      setActionId(employee.id);
      setMessage(null);

      await resetEmployeePassword(
        employee.id,
        temporaryPassword,
        accessToken
      );

      setMessage({
        type: "success",
        text: "Employee password reset successfully.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setActionId(null);
    }
  }

  return (
    <section className="employee-management">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            Employee Management
          </p>

          <h2>
            {editingId
              ? "Edit Employee"
              : "Add Employee"}
          </h2>
        </div>
      </div>

      {message && (
        <div
          className={`alert alert-${message.type}`}
        >
          {message.text}
        </div>
      )}

      <form
        className="employee-form"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="employee-full-name">
            Full Name
          </label>

          <input
            id="employee-full-name"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="employee-email">
            Email
          </label>

          <input
            id="employee-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="employee-id">
            Employee ID
          </label>

          <input
            id="employee-id"
            name="employeeId"
            type="text"
            value={form.employeeId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="employee-department">
            Department
          </label>

          <input
            id="employee-department"
            name="department"
            type="text"
            value={form.department}
            onChange={handleChange}
            required
          />
        </div>

        {!editingId && (
          <div>
            <label htmlFor="employee-password">
              Temporary Password
            </label>

            <input
              id="employee-password"
              name="temporaryPassword"
              type="password"
              value={form.temporaryPassword}
              onChange={handleChange}
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>
        )}

        <div className="employee-form-actions">
          <button
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : editingId
                ? "Update Employee"
                : "Add Employee"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="employee-list-section">
        <h2>Employees</h2>

        {loading ? (
          <p>Loading employees...</p>
        ) : employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      {employee.employeeId}
                    </td>

                    <td>
                      {employee.fullName}
                    </td>

                    <td>
                      {employee.email}
                    </td>

                    <td>
                      {employee.department}
                    </td>

                    <td>
                      {employee.enabled
                        ? "Active"
                        : "Disabled"}
                    </td>

                    <td>
                      <div className="employee-actions">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(employee)
                          }
                          disabled={
                            actionId === employee.id
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEnabledChange(
                              employee
                            )
                          }
                          disabled={
                            actionId === employee.id
                          }
                        >
                          {employee.enabled
                            ? "Disable"
                            : "Enable"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handlePasswordReset(
                              employee
                            )
                          }
                          disabled={
                            actionId === employee.id
                          }
                        >
                          Reset Password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
