package com.devopsproject.leave_management.dto;

public class LeaveBalanceDto {

    private String leaveType;
    private Integer quota;
    private int approvedDays;
    private int pendingDays;
    private Integer remainingDays;
    private int percentUsed;

    public LeaveBalanceDto() {
    }

    public LeaveBalanceDto(
            String leaveType,
            Integer quota,
            int approvedDays,
            int pendingDays,
            Integer remainingDays,
            int percentUsed) {

        this.leaveType = leaveType;
        this.quota = quota;
        this.approvedDays = approvedDays;
        this.pendingDays = pendingDays;
        this.remainingDays = remainingDays;
        this.percentUsed = percentUsed;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    public Integer getQuota() {
        return quota;
    }

    public void setQuota(Integer quota) {
        this.quota = quota;
    }

    public int getApprovedDays() {
        return approvedDays;
    }

    public void setApprovedDays(int approvedDays) {
        this.approvedDays = approvedDays;
    }

    public int getPendingDays() {
        return pendingDays;
    }

    public void setPendingDays(int pendingDays) {
        this.pendingDays = pendingDays;
    }

    public Integer getRemainingDays() {
        return remainingDays;
    }

    public void setRemainingDays(Integer remainingDays) {
        this.remainingDays = remainingDays;
    }

    public int getPercentUsed() {
        return percentUsed;
    }

    public void setPercentUsed(int percentUsed) {
        this.percentUsed = percentUsed;
    }
}
