package com.devopsproject.leave_management.service;

import com.devopsproject.leave_management.dto.LeaveBalanceDto;
import com.devopsproject.leave_management.entity.LeaveRequest;
import com.devopsproject.leave_management.exception.InsufficientLeaveBalanceException;
import com.devopsproject.leave_management.repository.LeaveRequestRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LeaveBalanceServiceTest {

    @Mock
    private LeaveRequestRepository leaveRequestRepository;

    @InjectMocks
    private LeaveBalanceService leaveBalanceService;

    private LeaveRequest approvedAnnualLeave;
    private LeaveRequest pendingAnnualLeave;

    @BeforeEach
    void setUp() {
        approvedAnnualLeave = new LeaveRequest();
        approvedAnnualLeave.setId(1L);
        approvedAnnualLeave.setEmployeeId("EMP001");
        approvedAnnualLeave.setLeaveType("Annual Leave");
        approvedAnnualLeave.setStartDate(LocalDate.of(2026, 3, 1));
        approvedAnnualLeave.setEndDate(LocalDate.of(2026, 3, 5)); // 5 days
        approvedAnnualLeave.setStatus("APPROVED");

        pendingAnnualLeave = new LeaveRequest();
        pendingAnnualLeave.setId(2L);
        pendingAnnualLeave.setEmployeeId("EMP001");
        pendingAnnualLeave.setLeaveType("Annual Leave");
        pendingAnnualLeave.setStartDate(LocalDate.of(2026, 6, 1));
        pendingAnnualLeave.setEndDate(LocalDate.of(2026, 6, 2)); // 2 days
        pendingAnnualLeave.setStatus("PENDING");
    }

    @Test
    void calculateDays_ValidDates_ReturnsInclusiveDays() {
        int days = leaveBalanceService.calculateDays(
                LocalDate.of(2026, 5, 1),
                LocalDate.of(2026, 5, 5)
        );
        assertEquals(5, days);

        int singleDay = leaveBalanceService.calculateDays(
                LocalDate.of(2026, 5, 1),
                LocalDate.of(2026, 5, 1)
        );
        assertEquals(1, singleDay);
    }

    @Test
    void calculateDays_InvalidDates_ReturnsZero() {
        assertEquals(0, leaveBalanceService.calculateDays(null, LocalDate.now()));
        assertEquals(0, leaveBalanceService.calculateDays(LocalDate.of(2026, 5, 5), LocalDate.of(2026, 5, 1)));
    }

    @Test
    void getBalancesForEmployee_ReturnsAccurateMetrics() {
        when(leaveRequestRepository.findByEmployeeId("EMP001"))
                .thenReturn(List.of(approvedAnnualLeave, pendingAnnualLeave));

        Map<String, LeaveBalanceDto> balances =
                leaveBalanceService.getBalancesForEmployee("EMP001", 2026);

        assertNotNull(balances);
        assertTrue(balances.containsKey("Annual Leave"));
        assertTrue(balances.containsKey("Casual Leave"));
        assertTrue(balances.containsKey("Sick Leave"));
        assertTrue(balances.containsKey("Unpaid Leave"));

        LeaveBalanceDto annual = balances.get("Annual Leave");
        assertEquals(14, annual.getQuota());
        assertEquals(5, annual.getApprovedDays());
        assertEquals(2, annual.getPendingDays());
        assertEquals(9, annual.getRemainingDays()); // 14 - 5
        assertEquals(36, annual.getPercentUsed()); // 5 / 14 ~ 36%

        LeaveBalanceDto unpaid = balances.get("Unpaid Leave");
        assertNull(unpaid.getQuota());
        assertNull(unpaid.getRemainingDays());
    }

    @Test
    void validateLeaveQuota_WithinBalance_Succeeds() {
        when(leaveRequestRepository.findByEmployeeId("EMP001"))
                .thenReturn(List.of(approvedAnnualLeave)); // 5 days approved out of 14

        // Requesting 9 days should succeed (5 + 9 = 14)
        assertDoesNotThrow(() ->
                leaveBalanceService.validateLeaveQuota(
                        "EMP001",
                        "Annual Leave",
                        LocalDate.of(2026, 10, 1),
                        LocalDate.of(2026, 10, 9)
                )
        );
    }

    @Test
    void validateLeaveQuota_ExceedsBalance_ThrowsInsufficientLeaveBalanceException() {
        when(leaveRequestRepository.findByEmployeeId("EMP001"))
                .thenReturn(List.of(approvedAnnualLeave)); // 5 days approved out of 14, 9 remaining

        // Requesting 10 days should fail because only 9 are remaining
        InsufficientLeaveBalanceException ex = assertThrows(
                InsufficientLeaveBalanceException.class,
                () -> leaveBalanceService.validateLeaveQuota(
                        "EMP001",
                        "Annual Leave",
                        LocalDate.of(2026, 10, 1),
                        LocalDate.of(2026, 10, 10)
                )
        );

        assertTrue(ex.getMessage().contains("Insufficient Annual Leave balance"));
    }

    @Test
    void validateLeaveQuota_UnpaidLeave_AllowsAnyDuration() {
        // Requesting 100 days of unpaid leave should not throw exception
        assertDoesNotThrow(() ->
                leaveBalanceService.validateLeaveQuota(
                        "EMP001",
                        "Unpaid Leave",
                        LocalDate.of(2026, 1, 1),
                        LocalDate.of(2026, 4, 10)
                )
        );
    }

    @Test
    void validateApprovalQuota_ExceedsQuota_ThrowsException() {
        LeaveRequest newRequest = new LeaveRequest();
        newRequest.setId(3L);
        newRequest.setEmployeeId("EMP001");
        newRequest.setLeaveType("Annual Leave");
        newRequest.setStartDate(LocalDate.of(2026, 11, 1));
        newRequest.setEndDate(LocalDate.of(2026, 11, 10)); // 10 days
        newRequest.setStatus("PENDING");

        when(leaveRequestRepository.findByEmployeeId("EMP001"))
                .thenReturn(List.of(approvedAnnualLeave, newRequest)); // 5 already approved, 10 requested -> 15 > 14

        assertThrows(
                InsufficientLeaveBalanceException.class,
                () -> leaveBalanceService.validateApprovalQuota(newRequest)
        );
    }
}
