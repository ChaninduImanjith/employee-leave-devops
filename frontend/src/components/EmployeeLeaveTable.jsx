function EmployeeLeaveTable({ requests, loading }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">My Requests</p>
          <h2>Leave history</h2>
        </div>

        <span className="request-count">
          {requests.length}{" "}
          {requests.length === 1 ? "request" : "requests"}
        </span>
      </div>

      {loading ? (
        <div className="empty-state">
          <h3>Loading requests...</h3>
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <h3>No leave requests yet</h3>
          <p>Your submitted leave requests will appear here.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Period</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <strong>{request.leaveType}</strong>
                  </td>

                  <td>
                    <div className="date-cell">
                      <span>{request.startDate}</span>
                      <span>to {request.endDate}</span>
                    </div>
                  </td>

                  <td>
                    {request.reason || "No reason provided"}
                  </td>

                  <td>
                    <span
                      className={`status-badge status-${request.status.toLowerCase()}`}
                    >
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default EmployeeLeaveTable;
