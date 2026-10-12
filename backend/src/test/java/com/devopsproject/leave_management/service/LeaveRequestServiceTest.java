package com.devopsproject.leave_management.service;

import com.devopsproject.leave_management.dto.CreateLeaveRequestRequest;
import com.devopsproject.leave_management.entity.LeaveRequest;
import com.devopsproject.leave_management.exception.ResourceNotFoundException;
import com.devopsproject.leave_management.repository.LeaveRequestRepository;
import com.devopsproject.leave_management.user.Role;
import com.devopsproject.leave_management.user.UserAccount;
import com.devopsproject.leave_management.user.UserAccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeaveRequestServiceTest {

    @Mock
    private LeaveRequestRepository leaveRequestRepository;

    @Mock
    private UserAccountRepository userAccountRepository;

    @InjectMocks
    private LeaveRequestService leaveRequestService;

    private UserAccount testUser;
    private LeaveRequest testLeaveRequest;

    @BeforeEach
    void setUp() {
        testUser = new UserAccount();
        testUser.setId(1L);
        testUser.setFullName("John Silva");
        testUser.setEmail("john@leaveflow.com");
        testUser.setEmployeeId("EMP001");
        testUser.setDepartment("Engineering");
        testUser.setRole(Role.EMPLOYEE);

        testLeaveRequest = new LeaveRequest();
        testLeaveRequest.setId(10L);
        testLeaveRequest.setEmployeeName("John Silva");
        testLeaveRequest.setEmployeeId("EMP001");
        testLeaveRequest.setDepartment("Engineering");
        testLeaveRequest.setLeaveType("ANNUAL");
        testLeaveRequest.setStartDate(LocalDate.of(2026, 11, 1));
        testLeaveRequest.setEndDate(LocalDate.of(2026, 11, 5));
        testLeaveRequest.setStatus("PENDING");
    }

    @Test
    void createLeaveRequest_Success() {
        CreateLeaveRequestRequest request = new CreateLeaveRequestRequest();
        request.setLeaveType("ANNUAL");
        request.setStartDate(LocalDate.of(2026, 11, 1));
        request.setEndDate(LocalDate.of(2026, 11, 5));
        request.setReason("Vacation");

        when(userAccountRepository.findByEmail("john@leaveflow.com"))
                .thenReturn(Optional.of(testUser));
        when(leaveRequestRepository.save(any(LeaveRequest.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        LeaveRequest created = leaveRequestService.createLeaveRequest(request, "john@leaveflow.com");

        assertNotNull(created);
        assertEquals("John Silva", created.getEmployeeName());
        assertEquals("EMP001", created.getEmployeeId());
        assertEquals("PENDING", created.getStatus());
        verify(leaveRequestRepository, times(1)).save(any(LeaveRequest.class));
    }

    @Test
    void createLeaveRequest_InvalidDateRange_ThrowsException() {
        CreateLeaveRequestRequest request = new CreateLeaveRequestRequest();
        request.setLeaveType("ANNUAL");
        request.setStartDate(LocalDate.of(2026, 11, 10));
        request.setEndDate(LocalDate.of(2026, 11, 5)); // End date before start date

        when(userAccountRepository.findByEmail("john@leaveflow.com"))
                .thenReturn(Optional.of(testUser));

        assertThrows(IllegalArgumentException.class, () ->
                leaveRequestService.createLeaveRequest(request, "john@leaveflow.com")
        );
        verify(leaveRequestRepository, never()).save(any(LeaveRequest.class));
    }

    @Test
    void updateStatus_Approved_Success() {
        when(leaveRequestRepository.findById(10L))
                .thenReturn(Optional.of(testLeaveRequest));
        when(leaveRequestRepository.save(any(LeaveRequest.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        LeaveRequest updated = leaveRequestService.updateStatus(10L, "APPROVED");

        assertEquals("APPROVED", updated.getStatus());
        verify(leaveRequestRepository).save(testLeaveRequest);
    }

    @Test
    void updateStatus_InvalidStatus_ThrowsException() {
        when(leaveRequestRepository.findById(10L))
                .thenReturn(Optional.of(testLeaveRequest));

        assertThrows(IllegalArgumentException.class, () ->
                leaveRequestService.updateStatus(10L, "UNKNOWN_STATUS")
        );
    }

    @Test
    void updateStatus_NotFound_ThrowsException() {
        when(leaveRequestRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                leaveRequestService.updateStatus(999L, "APPROVED")
        );
    }

    @Test
    void getLeaveRequestsByEmployeeId_Success() {
        when(leaveRequestRepository.findByEmployeeId("EMP001"))
                .thenReturn(List.of(testLeaveRequest));

        List<LeaveRequest> results = leaveRequestService.getLeaveRequestsByEmployeeId("EMP001");

        assertEquals(1, results.size());
        assertEquals("EMP001", results.get(0).getEmployeeId());
    }

    @Test
    void deleteLeaveRequest_Success() {
        when(leaveRequestRepository.existsById(10L)).thenReturn(true);

        leaveRequestService.deleteLeaveRequest(10L);

        verify(leaveRequestRepository, times(1)).deleteById(10L);
    }

    @Test
    void deleteLeaveRequest_NotFound_ThrowsException() {
        when(leaveRequestRepository.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () ->
                leaveRequestService.deleteLeaveRequest(999L)
        );
    }
}
