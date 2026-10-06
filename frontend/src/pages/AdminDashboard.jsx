import {
  useEffect,
  useState,
} from "react";

import AdminLeaveTable from "../components/AdminLeaveTable";
import EmployeeManagement from "../components/EmployeeManagement";
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

  const [activeSection, setActiveSection] =
    useState("leaves");

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
      showMessage(
        "error",
        error.message
      );
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
          (request) =>
            request.id !== id
        )
      );

      showMessage(
        "success",
        "Leave request deleted successfully."
      );
    } catch (error) {
      showMessage(
        "error",
        error.message
      );
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
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">
            LF
          </div>

          <div>
            <h1>LeaveFlow</h1>
            <p>HR Management</p>
          </div>
        </div>

        <nav className="admin-navigation">
          <p className="admin-nav-label">
            Workspace
          </p>

          <button
            type="button"
            className={
              activeSection === "leaves"
                ? "admin-nav-item active"
                : "admin-nav-item"
            }
            onClick={() =>
              setActiveSection("leaves")
            }
          >
            <span className="admin-nav-icon">
              ◫
            </span>

            <span>Leave Requests</span>

            {pending > 0 && (
              <span className="admin-nav-count">
                {pending}
              </span>
            )}
          </button>

          <button
            type="button"
            className={
              activeSection === "employees"
                ? "admin-nav-item active"
                : "admin-nav-item"
            }
            onClick={() =>
              setActiveSection("employees")
            }
          >
            <span className="admin-nav-icon">
              ♙
            </span>

            <span>Employees</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-card">
            <div className="admin-user-avatar">
              {user?.fullName
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div className="admin-user-info">
              <strong>
                {user?.fullName}
              </strong>

              <span>
                Administrator
              </span>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">
              HR Administration
            </p>

            <h2>
              {activeSection === "leaves"
                ? "Leave Requests"
                : "Employee Management"}
            </h2>
          </div>

          <div className="admin-topbar-user">
            <span>
              Signed in as
            </span>

            <strong>
              {user?.fullName}
            </strong>
          </div>
        </header>

        <div className="admin-content">
          {activeSection === "leaves" && (
            <>
              <section className="admin-welcome">
                <div>
                  <h3>
                    Leave Management Overview
                  </h3>

                  <p>
                    Review employee leave
                    requests and manage approval
                    decisions from one place.
                  </p>
                </div>

                <div className="admin-status-pill">
                  <span />
                  System Online
                </div>
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
                  <span>
                    Total Requests
                  </span>

                  <strong>
                    {requests.length}
                  </strong>
                </article>

                <article className="stat-card">
                  <span>
                    Pending
                  </span>

                  <strong>
                    {pending}
                  </strong>
                </article>

                <article className="stat-card">
                  <span>
                    Approved
                  </span>

                  <strong>
                    {approved}
                  </strong>
                </article>

                <article className="stat-card">
                  <span>
                    Rejected
                  </span>

                  <strong>
                    {rejected}
                  </strong>
                </article>
              </section>

              <AdminLeaveTable
                requests={requests}
                loading={loading}
                actionId={actionId}
                onStatusChange={
                  handleStatusChange
                }
                onDelete={handleDelete}
              />
            </>
          )}

          {activeSection === "employees" && (
            <EmployeeManagement />
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
