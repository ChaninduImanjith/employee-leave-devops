import { useMemo, useState } from "react";
import { calculateDays } from "../utils/leaveUtils";

const initialForm = {
  leaveType: "",
  startDate: "",
  endDate: "",
  reason: "",
};

function LeaveForm({ employee, onSubmit, submitting, balances }) {
  const [formData, setFormData] = useState(initialForm);
  const [dateError, setDateError] = useState("");

  const todayStr = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  const requestedDays = useMemo(() => {
    return calculateDays(formData.startDate, formData.endDate);
  }, [formData.startDate, formData.endDate]);

  const selectedBalance = useMemo(() => {
    if (!balances || !formData.leaveType) return null;
    return balances[formData.leaveType] || null;
  }, [balances, formData.leaveType]);

  const isExceedingBalance = useMemo(() => {
    if (!selectedBalance || selectedBalance.remainingDays === null) return false;
    return requestedDays > selectedBalance.remainingDays;
  }, [selectedBalance, requestedDays]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      if (updated.startDate && updated.endDate) {
        if (new Date(updated.endDate) < new Date(updated.startDate)) {
          setDateError("End date cannot be earlier than start date.");
        } else {
          setDateError("");
        }
      } else {
        setDateError("");
      }

      return updated;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setDateError("End date cannot be earlier than start date.");
      return;
    }

    if (isExceedingBalance) {
      return;
    }

    const success = await onSubmit({
      ...employee,
      ...formData,
    });

    if (success) {
      setFormData(initialForm);
      setDateError("");
    }
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">New Request</p>
          <h2>Apply for leave</h2>
        </div>
        {requestedDays > 0 && !dateError && (
          <div className="duration-pill">
            <span className="duration-pill-dot" />
            <span>
              Duration: <strong>{requestedDays} {requestedDays === 1 ? "Day" : "Days"}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="employee-profile">
        <div>
          <span>Employee</span>
          <strong>{employee.employeeName}</strong>
        </div>

        <div>
          <span>Employee ID</span>
          <strong>{employee.employeeId}</strong>
        </div>

        <div>
          <span>Department</span>
          <strong>{employee.department}</strong>
        </div>
      </div>

      <form className="leave-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Leave type
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              required
            >
              <option value="">Select leave type</option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
            {selectedBalance && (
              <span className="balance-hint">
                {selectedBalance.remainingDays !== null ? (
                  <>
                    Available: <strong>{selectedBalance.remainingDays}</strong> / {selectedBalance.quota} days
                  </>
                ) : (
                  <>Uncapped allowance</>
                )}
              </span>
            )}
          </label>

          <div />

          <label>
            Start date
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={todayStr}
              required
            />
          </label>

          <label>
            End date
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || todayStr}
              required
            />
          </label>
        </div>

        {dateError && (
          <div className="form-warning-banner" role="alert">
            <span>⚠️</span>
            <span>{dateError}</span>
          </div>
        )}

        {isExceedingBalance && !dateError && (
          <div className="form-warning-banner exceed-warning" role="alert">
            <span>⚠️</span>
            <span>
              <strong>Balance Notice:</strong> You are requesting <strong>{requestedDays} days</strong>, but only have <strong>{selectedBalance.remainingDays} days</strong> remaining for {formData.leaveType}.
            </span>
          </div>
        )}

        <label>
          Reason
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="4"
            maxLength="500"
            placeholder="Enter a short reason for the leave request"
          />
        </label>

        <button
          className="primary-button"
          type="submit"
          disabled={submitting || Boolean(dateError) || isExceedingBalance}
        >
          {submitting
            ? "Submitting..."
            : isExceedingBalance
              ? "Exceeds Available Quota"
              : requestedDays > 0
                ? `Submit leave request (${requestedDays} ${requestedDays === 1 ? "day" : "days"})`
                : "Submit leave request"}
        </button>
      </form>
    </section>
  );
}

export default LeaveForm;
