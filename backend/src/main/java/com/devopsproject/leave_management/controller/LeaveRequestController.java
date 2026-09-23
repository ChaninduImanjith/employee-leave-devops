package com.devopsproject.leave_management.controller;

import com.devopsproject.leave_management.entity.LeaveRequest;
import com.devopsproject.leave_management.service.LeaveRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }

    @PostMapping
    public ResponseEntity<LeaveRequest> createLeaveRequest(
            @Valid @RequestBody LeaveRequest leaveRequest) {

        LeaveRequest createdRequest =
                leaveRequestService.createLeaveRequest(leaveRequest);

        return ResponseEntity.ok(createdRequest);
    }

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        return ResponseEntity.ok(
                leaveRequestService.getAllLeaveRequests()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequest> getLeaveRequestById(
            @PathVariable Long id) {

        return leaveRequestService.getLeaveRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaveRequest> updateLeaveRequest(
            @PathVariable Long id,
            @Valid @RequestBody LeaveRequest leaveRequest) {

        return ResponseEntity.ok(
                leaveRequestService.updateLeaveRequest(id, leaveRequest)
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<LeaveRequest> updateLeaveStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                leaveRequestService.updateStatus(id, status)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaveRequest(
            @PathVariable Long id) {

        leaveRequestService.deleteLeaveRequest(id);

        return ResponseEntity.noContent().build();
    }
}
