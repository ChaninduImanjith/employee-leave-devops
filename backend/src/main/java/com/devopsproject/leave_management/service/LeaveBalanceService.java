package com.devopsproject.leave_management.service;

import com.devopsproject.leave_management.dto.LeaveBalanceDto;
import com.devopsproject.leave_management.entity.LeaveRequest;
import com.devopsproject.leave_management.entity.LeaveType;
import com.devopsproject.leave_management.exception.InsufficientLeaveBalanceException;
import com.devopsproject.leave_management.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class LeaveBalanceService {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveBalanceService(LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }

    public int calculateDays(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null || endDate.isBefore(startDate)) {
            return 0;
        }

        return (int) ChronoUnit.DAYS.between(startDate, endDate) + 1;
    }

    public Map<String, LeaveBalanceDto> getBalancesForEmployee(String employeeId, int year) {
        List<LeaveRequest> requests = leaveRequestRepository.findByEmployeeId(employeeId);

        Map<String, LeaveBalanceDto> balances = new LinkedHashMap<>();

        for (LeaveType type : LeaveType.values()) {
            int approvedDays = 0;
            int pendingDays = 0;

            for (LeaveRequest req : requests) {
                if (!isRequestInYear(req, year)) {
                    continue;
                }

                LeaveType reqType = LeaveType.fromString(req.getLeaveType()).orElse(null);
                if (reqType != type) {
                    continue;
                }

                int days = calculateDays(req.getStartDate(), req.getEndDate());

                if ("APPROVED".equalsIgnoreCase(req.getStatus())) {
                    approvedDays += days;
                } else if ("PENDING".equalsIgnoreCase(req.getStatus())) {
                    pendingDays += days;
                }
            }

            Integer quota = type.getDefaultQuota();
            Integer remainingDays = null;
            int percentUsed = 0;

            if (quota != null) {
                remainingDays = Math.max(0, quota - approvedDays);
                percentUsed = Math.min(100, (int) Math.round(((double) approvedDays / quota) * 100));
            }

            balances.put(
                    type.getDisplayName(),
                    new LeaveBalanceDto(
                            type.getDisplayName(),
                            quota,
                            approvedDays,
                            pendingDays,
                            remainingDays,
                            percentUsed
                    )
            );
        }

        return balances;
    }

    public void validateLeaveQuota(
            String employeeId,
            String leaveTypeStr,
            LocalDate startDate,
            LocalDate endDate) {

        LeaveType type = LeaveType.fromString(leaveTypeStr)
                .orElseThrow(() -> new IllegalArgumentException("Invalid leave type: " + leaveTypeStr));

        int requestedDays = calculateDays(startDate, endDate);
        if (requestedDays <= 0) {
            throw new IllegalArgumentException("Leave duration must be at least 1 day");
        }

        if (type.isUnlimited()) {
            return;
        }

        int year = startDate.getYear();
        List<LeaveRequest> requests = leaveRequestRepository.findByEmployeeId(employeeId);

        int approvedDays = 0;
        for (LeaveRequest req : requests) {
            if (!isRequestInYear(req, year)) {
                continue;
            }

            LeaveType reqType = LeaveType.fromString(req.getLeaveType()).orElse(null);
            if (reqType == type && "APPROVED".equalsIgnoreCase(req.getStatus())) {
                approvedDays += calculateDays(req.getStartDate(), req.getEndDate());
            }
        }

        int quota = type.getDefaultQuota();
        int remaining = quota - approvedDays;

        if (requestedDays > remaining) {
            throw new InsufficientLeaveBalanceException(String.format(
                    "Insufficient %s balance. Requested: %d day(s), Available: %d day(s) out of %d annual quota.",
                    type.getDisplayName(),
                    requestedDays,
                    Math.max(0, remaining),
                    quota
            ));
        }
    }

    public void validateApprovalQuota(LeaveRequest requestToApprove) {
        if ("APPROVED".equalsIgnoreCase(requestToApprove.getStatus())) {
            return;
        }

        LeaveType type = LeaveType.fromString(requestToApprove.getLeaveType()).orElse(null);
        if (type == null || type.isUnlimited()) {
            return;
        }

        int requestedDays = calculateDays(requestToApprove.getStartDate(), requestToApprove.getEndDate());
        int year = requestToApprove.getStartDate().getYear();

        List<LeaveRequest> requests = leaveRequestRepository.findByEmployeeId(requestToApprove.getEmployeeId());

        int approvedDays = 0;
        for (LeaveRequest req : requests) {
            if (req.getId() != null && req.getId().equals(requestToApprove.getId())) {
                continue;
            }

            if (!isRequestInYear(req, year)) {
                continue;
            }

            LeaveType reqType = LeaveType.fromString(req.getLeaveType()).orElse(null);
            if (reqType == type && "APPROVED".equalsIgnoreCase(req.getStatus())) {
                approvedDays += calculateDays(req.getStartDate(), req.getEndDate());
            }
        }

        int quota = type.getDefaultQuota();
        int remaining = quota - approvedDays;

        if (requestedDays > remaining) {
            throw new InsufficientLeaveBalanceException(String.format(
                    "Cannot approve leave request. Exceeds available %s balance. Required: %d day(s), Available: %d day(s) out of %d annual quota.",
                    type.getDisplayName(),
                    requestedDays,
                    Math.max(0, remaining),
                    quota
            ));
        }
    }

    private boolean isRequestInYear(LeaveRequest req, int year) {
        if (req.getStartDate() == null && req.getEndDate() == null) {
            return false;
        }

        if (req.getStartDate() != null && req.getStartDate().getYear() == year) {
            return true;
        }

        return req.getEndDate() != null && req.getEndDate().getYear() == year;
    }
}
