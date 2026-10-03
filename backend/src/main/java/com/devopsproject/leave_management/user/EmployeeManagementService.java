package com.devopsproject.leave_management.user;

import com.devopsproject.leave_management.exception.ResourceNotFoundException;
import com.devopsproject.leave_management.user.dto.CreateEmployeeRequest;
import com.devopsproject.leave_management.user.dto.EmployeeResponse;
import com.devopsproject.leave_management.user.dto.ResetEmployeePasswordRequest;
import com.devopsproject.leave_management.user.dto.UpdateEmployeeRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeManagementService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeManagementService(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder) {

        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public EmployeeResponse createEmployee(
            CreateEmployeeRequest request) {

        String email =
                request.getEmail().trim().toLowerCase();

        String employeeId =
                request.getEmployeeId().trim();

        if (userAccountRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists"
            );
        }

        if (userAccountRepository.existsByEmployeeId(
                employeeId)) {

            throw new IllegalArgumentException(
                    "An employee with this employee ID already exists"
            );
        }

        UserAccount employee = new UserAccount();

        employee.setFullName(
                request.getFullName().trim()
        );

        employee.setEmail(email);
        employee.setEmployeeId(employeeId);

        employee.setDepartment(
                request.getDepartment().trim()
        );

        employee.setPassword(
                passwordEncoder.encode(
                        request.getTemporaryPassword()
                )
        );

        employee.setRole(Role.EMPLOYEE);
        employee.setEnabled(true);

        UserAccount savedEmployee =
                userAccountRepository.save(employee);

        return toEmployeeResponse(savedEmployee);
    }

    public List<EmployeeResponse> getAllEmployees() {

        return userAccountRepository
                .findAllByRoleOrderByFullNameAsc(
                        Role.EMPLOYEE
                )
                .stream()
                .map(this::toEmployeeResponse)
                .toList();
    }

    public EmployeeResponse getEmployeeById(Long id) {

        return toEmployeeResponse(
                getEmployeeEntityById(id)
        );
    }

    public EmployeeResponse updateEmployee(
            Long id,
            UpdateEmployeeRequest request) {

        UserAccount employee =
                getEmployeeEntityById(id);

        String email =
                request.getEmail().trim().toLowerCase();

        String employeeId =
                request.getEmployeeId().trim();

        userAccountRepository
                .findByEmail(email)
                .filter(existing ->
                        !existing.getId().equals(id)
                )
                .ifPresent(existing -> {
                    throw new IllegalArgumentException(
                            "An account with this email already exists"
                    );
                });

        userAccountRepository
                .findByEmployeeId(employeeId)
                .filter(existing ->
                        !existing.getId().equals(id)
                )
                .ifPresent(existing -> {
                    throw new IllegalArgumentException(
                            "An employee with this employee ID already exists"
                    );
                });

        employee.setFullName(
                request.getFullName().trim()
        );

        employee.setEmail(email);
        employee.setEmployeeId(employeeId);

        employee.setDepartment(
                request.getDepartment().trim()
        );

        UserAccount updatedEmployee =
                userAccountRepository.save(employee);

        return toEmployeeResponse(updatedEmployee);
    }

    public EmployeeResponse setEmployeeEnabled(
            Long id,
            boolean enabled) {

        UserAccount employee =
                getEmployeeEntityById(id);

        employee.setEnabled(enabled);

        UserAccount updatedEmployee =
                userAccountRepository.save(employee);

        return toEmployeeResponse(updatedEmployee);
    }

    public EmployeeResponse resetEmployeePassword(
            Long id,
            ResetEmployeePasswordRequest request) {

        UserAccount employee =
                getEmployeeEntityById(id);

        employee.setPassword(
                passwordEncoder.encode(
                        request.getTemporaryPassword()
                )
        );

        UserAccount updatedEmployee =
                userAccountRepository.save(employee);

        return toEmployeeResponse(updatedEmployee);
    }

    private UserAccount getEmployeeEntityById(Long id) {

        UserAccount employee =
                userAccountRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Employee not found"
                                )
                        );

        if (employee.getRole() != Role.EMPLOYEE) {
            throw new ResourceNotFoundException(
                    "Employee not found"
            );
        }

        return employee;
    }

    private EmployeeResponse toEmployeeResponse(
            UserAccount employee) {

        return new EmployeeResponse(
                employee.getId(),
                employee.getFullName(),
                employee.getEmail(),
                employee.getEmployeeId(),
                employee.getDepartment(),
                employee.getRole(),
                employee.isEnabled()
        );
    }
}
