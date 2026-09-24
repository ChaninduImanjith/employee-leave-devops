package com.devopsproject.leave_management.service;

import com.devopsproject.leave_management.entity.LeaveRequest;
import com.devopsproject.leave_management.exception.ResourceNotFoundException;
import com.devopsproject.leave_management.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;

    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
    }

    public LeaveRequest createLeaveRequest(LeaveRequest leaveRequest) {

        validateDateRange(leaveRequest);

        leaveRequest.setStatus("PENDING");

        return leaveRequestRepository.save(leaveRequest);
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    public Optional<LeaveRequest> getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id);
    }

    public LeaveRequest updateLeaveRequest(
            Long id,
            LeaveRequest updatedRequest) {

        validateDateRange(updatedRequest);

        LeaveRequest existingRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Leave request not found with id: " + id
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

        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Leave request not found with id: " + id
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

        leaveRequest.setStatus(normalizedStatus);

        return leaveRequestRepository.save(leaveRequest);
    }

    public void deleteLeaveRequest(Long id) {

        if (!leaveRequestRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Leave request not found with id: " + id
            );
        }

        leaveRequestRepository.deleteById(id);
    }

    private void validateDateRange(LeaveRequest leaveRequest) {

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
