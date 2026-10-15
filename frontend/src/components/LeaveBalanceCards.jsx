function LeaveBalanceCards({ balances }) {
  if (!balances) {
    return null;
  }

  const balanceList = Object.values(balances);

  return (
    <section className="panel leave-balance-section">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Entitlements</p>
          <h2>Leave Balances</h2>
        </div>
        <span className="balance-info-badge">
          Annual Allocation Period: {new Date().getFullYear()}
        </span>
      </div>

      <div className="balance-grid">
        {balanceList.map((item) => {
          const isUnlimited = item.quota === null;

          return (
            <article
              key={item.leaveType}
              className="balance-card"
              style={{
                "--card-accent": item.color,
                "--card-bg": item.bgColor,
                "--card-border": item.borderColor,
              }}
            >
              <div className="balance-card-header">
                <span className="balance-badge">{item.leaveType}</span>
                <span className="balance-quota-tag">
                  {isUnlimited ? "Flexible" : `${item.quota} Days Total`}
                </span>
              </div>

              <div className="balance-numbers">
                <div className="balance-main-stat">
                  <strong>
                    {isUnlimited ? item.approvedDays : item.remainingDays}
                  </strong>
                  <span>{isUnlimited ? "Days Taken" : "Days Available"}</span>
                </div>
              </div>

              {!isUnlimited && (
                <div className="balance-progress-wrapper">
                  <div
                    className="balance-progress-bar"
                    role="progressbar"
                    aria-valuenow={item.percentUsed}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    <div
                      className="balance-progress-fill"
                      style={{
                        width: `${item.percentUsed}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                  <div className="balance-progress-label">
                    <span>{item.percentUsed}% consumed</span>
                    <span>{item.remainingDays} remaining</span>
                  </div>
                </div>
              )}

              <div className="balance-breakdown">
                <div className="breakdown-item">
                  <span className="breakdown-dot approved-dot" />
                  <span>Approved:</span>
                  <strong>{item.approvedDays}d</strong>
                </div>

                <div className="breakdown-item">
                  <span className="breakdown-dot pending-dot" />
                  <span>Pending:</span>
                  <strong>{item.pendingDays}d</strong>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default LeaveBalanceCards;
