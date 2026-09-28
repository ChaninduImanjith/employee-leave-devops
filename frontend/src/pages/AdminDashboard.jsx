import { useCallback, useEffect, useState } from "react";
import AdminLeaveTable from "../components/AdminLeaveTable";
import {
  deleteLeaveRequest,
  getAllLeaveRequests,
  updateLeaveStatus,
} from "../services/leaveService";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [message, setMessage] = useState(null);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAllLeaveRequests();

      setRequests(data);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

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
        await updateLeaveStatus(id, status);

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

      await deleteLeaveRequest(id);

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
        <p className="eyebrow">HR Administration</p>
        <h2>Leave Management Dashboard</h2>
        <p>
          Review and manage employee leave requests.
        </p>
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
