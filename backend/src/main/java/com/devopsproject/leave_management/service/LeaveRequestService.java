package com.devopsproject.leave_management.service;

import com.devopsproject.leave_management.dto.CreateLeaveRequestRequest;
import com.devopsproject.leave_management.dto.LeaveBalanceDto;
import com.devopsproject.leave_management.entity.LeaveRequest;
import com.devopsproject.leave_management.exception.ResourceNotFoundException;
import com.devopsproject.leave_management.repository.LeaveRequestRepository;
import com.devopsproject.leave_management.user.UserAccount;
import com.devopsproject.leave_management.user.UserAccountRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserAccountRepository userAccountRepository;
    private final LeaveBalanceService leaveBalanceService;

    public LeaveRequestService(
            LeaveRequestRepository leaveRequestRepository,
            UserAccountRepository userAccountRepository,
            LeaveBalanceService leaveBalanceService) {

        this.leaveRequestRepository = leaveRequestRepository;
        this.userAccountRepository = userAccountRepository;
        this.leaveBalanceService = leaveBalanceService;
    }

    public LeaveRequest createLeaveRequest(
            CreateLeaveRequestRequest request,
            String email) {

        UserAccount user = getAuthenticatedEmployee(email);

        LeaveRequest leaveRequest = new LeaveRequest();

        leaveRequest.setEmployeeName(user.getFullName());
        leaveRequest.setEmployeeId(user.getEmployeeId());
        leaveRequest.setDepartment(user.getDepartment());
        leaveRequest.setLeaveType(request.getLeaveType());
        leaveRequest.setStartDate(request.getStartDate());
        leaveRequest.setEndDate(request.getEndDate());
        leaveRequest.setReason(request.getReason());
        leaveRequest.setStatus("PENDING");

        validateDateRange(leaveRequest);
        leaveBalanceService.validateLeaveQuota(
                user.getEmployeeId(),
                request.getLeaveType(),
                request.getStartDate(),
                request.getEndDate()
        );

        return leaveRequestRepository.save(leaveRequest);
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    public List<LeaveRequest> getLeaveRequestsByEmployeeId(
            String employeeId) {

        return leaveRequestRepository.findByEmployeeId(employeeId);
    }

    public List<LeaveRequest> getMyLeaveRequests(
            String email) {

        UserAccount user = getAuthenticatedEmployee(email);

        return leaveRequestRepository.findByEmployeeId(
                user.getEmployeeId()
        );
    }

    public Optional<LeaveRequest> getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id);
    }

    public LeaveRequest updateLeaveRequest(
            Long id,
            LeaveRequest updatedRequest) {

        validateDateRange(updatedRequest);

        LeaveRequest existingRequest =
                leaveRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Leave request not found with id: "
                                                + id
                                )
                        );

        existingRequest.setEmployeeName(
                updatedRequest.getEmployeeName()
        );

        existingRequest.setEmployeeId(
                updatedRequest.getEmployeeId()
        );

        existingRequest.setDepartment(
                updatedRequest.getDepartment()
        );

        existingRequest.setLeaveType(
                updatedRequest.getLeaveType()
        );

        existingRequest.setStartDate(
                updatedRequest.getStartDate()
        );

        existingRequest.setEndDate(
                updatedRequest.getEndDate()
        );

        existingRequest.setReason(
                updatedRequest.getReason()
        );

        return leaveRequestRepository.save(existingRequest);
    }

    public LeaveRequest updateStatus(
            Long id,
            String status) {

        LeaveRequest leaveRequest =
                leaveRequestRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Leave request not found with id: "
                                                + id
                                )
                        );

        String normalizedStatus = status.toUpperCase();

        if (!normalizedStatus.equals("PENDING")
                && !normalizedStatus.equals("APPROVED")
                && !normalizedStatus.equals("REJECTED")) {

            throw new IllegalArgumentException(
                    "Status must be PENDING, APPROVED or REJECTED"
            );
        }

        if ("APPROVED".equals(normalizedStatus)) {
            leaveBalanceService.validateApprovalQuota(leaveRequest);
        }

        leaveRequest.setStatus(normalizedStatus);

        return leaveRequestRepository.save(leaveRequest);
    }

    public Map<String, LeaveBalanceDto> getMyLeaveBalances(String email) {
        UserAccount user = getAuthenticatedEmployee(email);
        int currentYear = LocalDate.now().getYear();
        return leaveBalanceService.getBalancesForEmployee(user.getEmployeeId(), currentYear);
    }

    public Map<String, LeaveBalanceDto> getEmployeeLeaveBalances(String employeeId) {
        if (employeeId == null || employeeId.isBlank()) {
            throw new IllegalArgumentException("Employee ID cannot be empty");
        }
        int currentYear = LocalDate.now().getYear();
        return leaveBalanceService.getBalancesForEmployee(employeeId, currentYear);
    }

    public void deleteLeaveRequest(Long id) {

        if (!leaveRequestRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Leave request not found with id: " + id
            );
        }

        leaveRequestRepository.deleteById(id);
    }

    private UserAccount getAuthenticatedEmployee(
            String email) {

        UserAccount user =
                userAccountRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Authenticated user account not found"
                                )
                        );

        if (user.getEmployeeId() == null
                || user.getEmployeeId().isBlank()) {

            throw new IllegalArgumentException(
                    "Employee account does not have an employee ID"
            );
        }

        return user;
    }

    private void validateDateRange(
            LeaveRequest leaveRequest) {

        if (leaveRequest.getStartDate() != null
                && leaveRequest.getEndDate() != null
                && leaveRequest.getEndDate()
                .isBefore(leaveRequest.getStartDate())) {

            throw new IllegalArgumentException(
                    "End date cannot be before start date"
            );
        }
    }
}
