package com.devopsproject.leave_management.user.dto;

import com.devopsproject.leave_management.user.Role;

public class EmployeeResponse {

    private final Long id;
    private final String fullName;
    private final String username;
    private final String email;
    private final String employeeId;
    private final String department;
    private final Role role;
    private final boolean enabled;

    public EmployeeResponse(
            Long id,
            String fullName,
            String username,
            String email,
            String employeeId,
            String department,
            Role role,
            boolean enabled) {

        this.id = id;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.employeeId = employeeId;
        this.department = department;
        this.role = role;
        this.enabled = enabled;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getEmployeeId() {
        return employeeId;
    }

    public String getDepartment() {
        return department;
    }

    public Role getRole() {
        return role;
    }

    public boolean isEnabled() {
        return enabled;
    }
}
