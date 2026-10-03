package com.devopsproject.leave_management.user;

import com.devopsproject.leave_management.user.dto.CreateEmployeeRequest;
import com.devopsproject.leave_management.user.dto.EmployeeResponse;
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
