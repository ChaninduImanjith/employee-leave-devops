package com.devopsproject.leave_management.service;

import com.devopsproject.leave_management.entity.LeaveRequest;
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
        leaveRequest.setStatus("PENDING");
        return leaveRequestRepository.save(leaveRequest);
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    public Optional<LeaveRequest> getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id);
    }

    public LeaveRequest updateLeaveRequest(Long id, LeaveRequest updatedRequest) {

        LeaveRequest existingRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Leave request not found with id: " + id));

        existingRequest.setEmployeeName(updatedRequest.getEmployeeName());
        existingRequest.setEmployeeId(updatedRequest.getEmployeeId());
        existingRequest.setDepartment(updatedRequest.getDepartment());
        existingRequest.setLeaveType(updatedRequest.getLeaveType());
        existingRequest.setStartDate(updatedRequest.getStartDate());
        existingRequest.setEndDate(updatedRequest.getEndDate());
        existingRequest.setReason(updatedRequest.getReason());

        return leaveRequestRepository.save(existingRequest);
    }

    public LeaveRequest updateStatus(Long id, String status) {

        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Leave request not found with id: " + id));

        leaveRequest.setStatus(status);

        return leaveRequestRepository.save(leaveRequest);
    }

    public void deleteLeaveRequest(Long id) {

        if (!leaveRequestRepository.existsById(id)) {
            throw new RuntimeException(
                    "Leave request not found with id: " + id);
        }

        leaveRequestRepository.deleteById(id);
    }
}
