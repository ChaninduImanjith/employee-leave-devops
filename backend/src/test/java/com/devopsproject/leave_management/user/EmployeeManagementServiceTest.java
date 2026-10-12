package com.devopsproject.leave_management.user;

import com.devopsproject.leave_management.exception.ResourceNotFoundException;
import com.devopsproject.leave_management.user.dto.CreateEmployeeRequest;
import com.devopsproject.leave_management.user.dto.EmployeeResponse;
import com.devopsproject.leave_management.user.dto.ResetEmployeePasswordRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeManagementServiceTest {

    @Mock
    private UserAccountRepository userAccountRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private EmployeeManagementService employeeManagementService;

    private UserAccount testEmployee;

    @BeforeEach
    void setUp() {
        testEmployee = new UserAccount();
        testEmployee.setId(1L);
        testEmployee.setFullName("Kamal Perera");
        testEmployee.setUsername("kamal.p");
        testEmployee.setEmail("kamal@leaveflow.com");
        testEmployee.setEmployeeId("EMP100");
        testEmployee.setDepartment("Finance");
        testEmployee.setRole(Role.EMPLOYEE);
        testEmployee.setEnabled(true);
        testEmployee.setMustChangePassword(true);
    }

    @Test
    void createEmployee_Success() {
        CreateEmployeeRequest request = new CreateEmployeeRequest();
        request.setFullName("Kamal Perera");
        request.setUsername("kamal.p");
        request.setEmail("kamal@leaveflow.com");
        request.setEmployeeId("EMP100");
        request.setDepartment("Finance");
        request.setTemporaryPassword("TempPass123");

        when(userAccountRepository.existsByEmail("kamal@leaveflow.com")).thenReturn(false);
        when(userAccountRepository.existsByUsername("kamal.p")).thenReturn(false);
        when(userAccountRepository.existsByEmployeeId("EMP100")).thenReturn(false);
        when(passwordEncoder.encode("TempPass123")).thenReturn("encodedPassword");
        when(userAccountRepository.save(any(UserAccount.class))).thenReturn(testEmployee);

        EmployeeResponse response = employeeManagementService.createEmployee(request);

        assertNotNull(response);
        assertEquals("Kamal Perera", response.getFullName());
        assertEquals("kamal.p", response.getUsername());
        assertEquals("kamal@leaveflow.com", response.getEmail());
        assertEquals("EMP100", response.getEmployeeId());
        verify(userAccountRepository).save(any(UserAccount.class));
    }

    @Test
    void createEmployee_EmailAlreadyExists_ThrowsException() {
        CreateEmployeeRequest request = new CreateEmployeeRequest();
        request.setFullName("Kamal Perera");
        request.setUsername("kamal.p");
        request.setEmail("kamal@leaveflow.com");
        request.setEmployeeId("EMP100");
        request.setDepartment("Finance");
        request.setTemporaryPassword("TempPass123");

        when(userAccountRepository.existsByEmail("kamal@leaveflow.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () ->
                employeeManagementService.createEmployee(request)
        );
        verify(userAccountRepository, never()).save(any(UserAccount.class));
    }

    @Test
    void getAllEmployees_Success() {
        when(userAccountRepository.findAllByRoleOrderByFullNameAsc(Role.EMPLOYEE))
                .thenReturn(List.of(testEmployee));

        List<EmployeeResponse> employees = employeeManagementService.getAllEmployees();

        assertEquals(1, employees.size());
        assertEquals("Kamal Perera", employees.get(0).getFullName());
    }

    @Test
    void getEmployeeById_NotFound_ThrowsException() {
        when(userAccountRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                employeeManagementService.getEmployeeById(99L)
        );
    }

    @Test
    void setEmployeeEnabled_Success() {
        when(userAccountRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        when(userAccountRepository.save(any(UserAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmployeeResponse response = employeeManagementService.setEmployeeEnabled(1L, false);

        assertFalse(response.isEnabled());
        verify(userAccountRepository).save(testEmployee);
    }

    @Test
    void resetEmployeePassword_Success() {
        ResetEmployeePasswordRequest request = new ResetEmployeePasswordRequest();
        request.setTemporaryPassword("NewTempPass123");

        when(userAccountRepository.findById(1L)).thenReturn(Optional.of(testEmployee));
        when(passwordEncoder.encode("NewTempPass123")).thenReturn("newHashedPassword");
        when(userAccountRepository.save(any(UserAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));

        EmployeeResponse response = employeeManagementService.resetEmployeePassword(1L, request);

        assertNotNull(response);
        assertTrue(testEmployee.isMustChangePassword());
        assertEquals("newHashedPassword", testEmployee.getPassword());
        verify(userAccountRepository).save(testEmployee);
    }
}
