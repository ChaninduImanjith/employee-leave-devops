import { useState } from "react";

const initialForm = {
  leaveType: "",
  startDate: "",
  endDate: "",
  reason: "",
};

function LeaveForm({ employee, onSubmit, submitting }) {
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const success = await onSubmit({
      ...employee,
      ...formData,
    });

    if (success) {
      setFormData(initialForm);
    }
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">New Request</p>
          <h2>Apply for leave</h2>
        </div>
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
          </label>

          <div></div>

          <label>
            Start date
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
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
              min={formData.startDate}
              required
            />
          </label>
        </div>

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
          disabled={submitting}
        >
          {submitting
            ? "Submitting..."
            : "Submit leave request"}
        </button>
      </form>
    </section>
  );
}

export default LeaveForm;
