export const LEAVE_CONFIG = {
  "Annual Leave": {
    quota: 14,
    color: "#059669",
    bgColor: "#ecfdf5",
    borderColor: "#a7f3d0",
    description: "Paid annual vacation days",
  },
  "Casual Leave": {
    quota: 7,
    color: "#2563eb",
    bgColor: "#eff6ff",
    borderColor: "#bfdbfe",
    description: "Personal and urgent matters",
  },
  "Sick Leave": {
    quota: 10,
    color: "#d97706",
    bgColor: "#fffbeb",
    borderColor: "#fde68a",
    description: "Medical and health-related leave",
  },
  "Unpaid Leave": {
    quota: null,
    color: "#7c3aed",
    bgColor: "#f5f3ff",
    borderColor: "#ddd6fe",
    description: "Leave without pay allowance",
  },
};

/**
 * Calculates inclusive calendar days between two ISO date strings (YYYY-MM-DD).
 */
export function calculateDays(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return 0;
  }

  // Calculate difference in whole days
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return diffDays > 0 ? diffDays : 0;
}

/**
 * Calculates leave balance metrics for each leave type from user's request history.
 */
export function calculateBalances(requests = []) {
  const summary = {};

  // Initialize summary with standard configs
  Object.keys(LEAVE_CONFIG).forEach((type) => {
    summary[type] = {
      leaveType: type,
      quota: LEAVE_CONFIG[type].quota,
      color: LEAVE_CONFIG[type].color,
      bgColor: LEAVE_CONFIG[type].bgColor,
      borderColor: LEAVE_CONFIG[type].borderColor,
      description: LEAVE_CONFIG[type].description,
      approvedDays: 0,
      pendingDays: 0,
      remainingDays: LEAVE_CONFIG[type].quota,
      percentUsed: 0,
    };
  });

  // Aggregate days from existing requests
  requests.forEach((req) => {
    const type = req.leaveType;
    if (!summary[type]) {
      return;
    }

    const days = calculateDays(req.startDate, req.endDate);

    if (req.status === "APPROVED") {
      summary[type].approvedDays += days;
    } else if (req.status === "PENDING") {
      summary[type].pendingDays += days;
    }
  });

  // Compute remaining balances & percentages
  Object.keys(summary).forEach((type) => {
    const item = summary[type];
    if (item.quota !== null) {
      item.remainingDays = Math.max(0, item.quota - item.approvedDays);
      item.percentUsed = Math.min(
        100,
        Math.round((item.approvedDays / item.quota) * 100)
      );
    } else {
      item.remainingDays = null;
      item.percentUsed = 0;
    }
  });

  return summary;
}
