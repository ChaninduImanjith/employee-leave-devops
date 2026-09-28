function AdminLeaveTable({
  requests,
  loading,
  actionId,
  onStatusChange,
  onDelete,
}) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">HR Management</p>
          <h2>All leave requests</h2>
        </div>

        <span className="request-count">
          {requests.length}{" "}
          {requests.length === 1 ? "request" : "requests"}
        </span>
      </div>

      {loading ? (
        <div className="empty-state">
          <h3>Loading leave requests...</h3>
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <h3>No leave requests</h3>
          <p>Employee requests will appear here.</p>
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
                        <strong>
                          {request.employeeName}
                        </strong>
                        <span>{request.employeeId}</span>
                      </div>
                    </td>

                    <td>{request.department}</td>

                    <td>
                      <div className="leave-cell">
                        <strong>
                          {request.leaveType}
                        </strong>
                        <span>
                          {request.reason ||
                            "No reason provided"}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="date-cell">
                        <span>{request.startDate}</span>
                        <span>
                          to {request.endDate}
                        </span>
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
                            type="button"
                            className="action-button approve"
                            disabled={busy}
                            onClick={() =>
                              onStatusChange(
                                request.id,
                                "APPROVED"
                              )
                            }
                          >
                            Approve
                          </button>
                        )}

                        {request.status !== "REJECTED" && (
                          <button
                            type="button"
                            className="action-button reject"
                            disabled={busy}
                            onClick={() =>
                              onStatusChange(
                                request.id,
                                "REJECTED"
                              )
                            }
                          >
                            Reject
                          </button>
                        )}

                        <button
                          type="button"
                          className="action-button delete"
                          disabled={busy}
                          onClick={() =>
                            onDelete(request.id)
                          }
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

export default AdminLeaveTable;
