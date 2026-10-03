import {
  useEffect,
  useState,
} from "react";

import AdminLeaveTable from "../components/AdminLeaveTable";
import { useAuth } from "../hooks/useAuth";

import {
  deleteLeaveRequest,
  getAllLeaveRequests,
  updateLeaveStatus,
} from "../services/leaveService";

function AdminDashboard() {
  const {
    user,
    accessToken,
    logout,
  } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      return undefined;
    }

    let cancelled = false;

    getAllLeaveRequests(accessToken)
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

  const handleStatusChange = async (
    id,
    status
  ) => {
    try {
      setActionId(id);

      const updated =
        await updateLeaveStatus(
          id,
          status,
          accessToken
        );

      setRequests((previous) =>
        previous.map((request) =>
          request.id === id
            ? updated
            : request
        )
      );

      showMessage(
        "success",
        `Leave request ${status.toLowerCase()} successfully.`
      );
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this leave request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(id);

      await deleteLeaveRequest(
        id,
        accessToken
      );

      setRequests((previous) =>
        previous.filter(
          (request) => request.id !== id
        )
      );

      showMessage(
        "success",
        "Leave request deleted successfully."
      );
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setActionId(null);
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

  const rejected = requests.filter(
    (request) =>
      request.status === "REJECTED"
  ).length;

  return (
    <main className="main-content">
      <section className="page-intro">
        <p className="eyebrow">
          HR Administration
        </p>

        <h2>
          Leave Management Dashboard
        </h2>

        <p>
          Welcome, {user?.fullName}. Review and manage
          employee leave requests.
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

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total requests</span>
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

        <article className="stat-card">
          <span>Rejected</span>
          <strong>{rejected}</strong>
        </article>
      </section>

      <AdminLeaveTable
        requests={requests}
        loading={loading}
        actionId={actionId}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    </main>
  );
}

export default AdminDashboard;
