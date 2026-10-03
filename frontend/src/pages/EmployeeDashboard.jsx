import {
  useEffect,
  useState,
} from "react";

import LeaveForm from "../components/LeaveForm";
import EmployeeLeaveTable from "../components/EmployeeLeaveTable";
import { useAuth } from "../hooks/useAuth";

import {
  createLeaveRequest,
  getMyLeaveRequests,
} from "../services/leaveService";

function EmployeeDashboard() {
  const {
    user,
    accessToken,
    logout,
  } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const employee = {
    employeeName: user?.fullName || "",
    employeeId: user?.employeeId || "",
    department: user?.department || "",
  };

  useEffect(() => {
    if (!accessToken) {
      return undefined;
    }

    let cancelled = false;

    getMyLeaveRequests(accessToken)
      .then((data) => {
        if (!cancelled) {
          setRequests(data);
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

  const showMessage = (type, text) => {
    setMessage({ type, text });

    window.setTimeout(() => {
      setMessage(null);
    }, 4000);
  };

  const handleCreate = async (formData) => {
    try {
      setSubmitting(true);

      const secureRequest = {
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      };

      const created =
        await createLeaveRequest(
          secureRequest,
          accessToken
        );

      setRequests((previous) => [
        created,
        ...previous,
      ]);

      showMessage(
        "success",
        "Leave request submitted successfully."
      );

      return true;
    } catch (error) {
      showMessage("error", error.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const pending = requests.filter(
    (request) =>
      request.status === "PENDING"
  ).length;

  const approved = requests.filter(
    (request) =>
      request.status === "APPROVED"
  ).length;

  return (
    <main className="main-content">
      <section className="page-intro">
        <p className="eyebrow">
          Employee Portal
        </p>

        <h2>
          Welcome, {user?.fullName}
        </h2>

        <p>
          Apply for leave and track the status of your
          requests.
        </p>

        <button
          type="button"
          onClick={logout}
        >
          Logout
        </button>
      </section>

      {message && (
        <div
          className={`alert alert-${message.type}`}
        >
          {message.text}
        </div>
      )}

      <section className="stats-grid employee-stats">
        <article className="stat-card">
          <span>My requests</span>
          <strong>{requests.length}</strong>
        </article>

        <article className="stat-card">
          <span>Pending</span>
          <strong>{pending}</strong>
        </article>

        <article className="stat-card">
          <span>Approved</span>
          <strong>{approved}</strong>
        </article>
      </section>

      <LeaveForm
        employee={employee}
        onSubmit={handleCreate}
        submitting={submitting}
      />

      <EmployeeLeaveTable
        requests={requests}
        loading={loading}
      />
    </main>
  );
}

export default EmployeeDashboard;
