package com.devopsproject.leave_management.config;

import com.devopsproject.leave_management.user.Role;
import com.devopsproject.leave_management.user.UserAccount;
import com.devopsproject.leave_management.user.UserAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserDataInitializer implements CommandLineRunner {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${APP_ADMIN_PASSWORD:}")
    private String adminPassword;

    @Value("${APP_EMPLOYEE_PASSWORD:}")
    private String employeePassword;

    public UserDataInitializer(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder) {

        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        createAdminIfConfigured();
        createEmployeeIfConfigured();
    }

    private void createAdminIfConfigured() {

        if (adminPassword.isBlank()) {
            return;
        }

        if (userAccountRepository
                .findByEmail("admin@leaveflow.com")
                .isPresent()) {
            return;
        }

        UserAccount admin = new UserAccount();

        admin.setFullName("HR Administrator");
        admin.setEmail("admin@leaveflow.com");
        admin.setUsername("admin");
        admin.setPassword(
                passwordEncoder.encode(adminPassword)
        );
        admin.setRole(Role.ADMIN);
        admin.setEnabled(true);

        userAccountRepository.save(admin);
    }

    private void createEmployeeIfConfigured() {

        if (employeePassword.isBlank()) {
            return;
        }

        if (userAccountRepository
                .findByEmail("employee@leaveflow.com")
                .isPresent()) {
            return;
        }

        UserAccount employee = new UserAccount();

        employee.setFullName("John Silva");
        employee.setEmail("employee@leaveflow.com");
        employee.setUsername("john.silva");
        employee.setPassword(
                passwordEncoder.encode(employeePassword)
        );
        employee.setEmployeeId("EMP001");
        employee.setDepartment("IT");
        employee.setRole(Role.EMPLOYEE);
        employee.setEnabled(true);

        userAccountRepository.save(employee);
    }
}
