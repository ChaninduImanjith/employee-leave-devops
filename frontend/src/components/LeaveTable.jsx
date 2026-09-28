function LeaveTable({
  requests,
  loading,
  onStatusChange,
  onDelete,
  actionId,
}) {
  if (loading) {
    return (
      <section className="panel">
        <div className="empty-state">
          <h3>Loading leave requests...</h3>
        </div>
      </section>
    );
  }

  return (
    <section className="panel requests-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Management</p>
          <h2>Leave requests</h2>
        </div>

        <span className="request-count">
          {requests.length} {requests.length === 1 ? "request" : "requests"}
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <h3>No leave requests yet</h3>
          <p>New requests will appear here after they are submitted.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Leave</th>
                <th>Period</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => {
                const busy = actionId === request.id;

                return (
                  <tr key={request.id}>
                    <td>
                      <div className="employee-cell">
                        <strong>{request.employeeName}</strong>
                        <span>{request.employeeId}</span>
                      </div>
                    </td>

                    <td>{request.department}</td>

                    <td>
                      <div className="leave-cell">
                        <strong>{request.leaveType}</strong>
                        <span>{request.reason || "No reason provided"}</span>
                      </div>
                    </td>

                    <td>
                      <div className="date-cell">
                        <span>{request.startDate}</span>
                        <span>to {request.endDate}</span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`status-badge status-${request.status.toLowerCase()}`}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        {request.status !== "APPROVED" && (
                          <button
                            className="action-button approve"
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              onStatusChange(request.id, "APPROVED")
                            }
                          >
                            Approve
                          </button>
                        )}

                        {request.status !== "REJECTED" && (
                          <button
                            className="action-button reject"
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              onStatusChange(request.id, "REJECTED")
                            }
                          >
                            Reject
                          </button>
                        )}

                        <button
                          className="action-button delete"
                          type="button"
                          disabled={busy}
                          onClick={() => onDelete(request.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default LeaveTable;
