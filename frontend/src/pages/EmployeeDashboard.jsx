import { useCallback, useEffect, useState } from "react";
import LeaveForm from "../components/LeaveForm";
import EmployeeLeaveTable from "../components/EmployeeLeaveTable";
import {
  createLeaveRequest,
  getEmployeeLeaveRequests,
} from "../services/leaveService";

const employee = {
  employeeName: "John Silva",
  employeeId: "EMP001",
  department: "IT",
};

function EmployeeDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);

      const data =
        await getEmployeeLeaveRequests(
          employee.employeeId
        );

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

  const handleCreate = async (formData) => {
    try {
      setSubmitting(true);

      const created =
        await createLeaveRequest(formData);

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
        <p className="eyebrow">Employee Portal</p>
        <h2>Welcome, {employee.employeeName}</h2>
        <p>
          Apply for leave and track the status of your
          requests.
        </p>
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
