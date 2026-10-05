package com.devopsproject.leave_management.auth.dto;

import com.devopsproject.leave_management.user.Role;

public class CurrentUserResponse {

    private final Long id;
    private final String fullName;
    private final String email;
    private final String employeeId;
    private final String department;
    private final Role role;
    private final boolean mustChangePassword;

    public CurrentUserResponse(
            Long id,
            String fullName,
            String email,
            String employeeId,
            String department,
            Role role) {

        this(
                id,
                fullName,
                email,
                employeeId,
                department,
                role,
                false
        );
    }

    public CurrentUserResponse(
            Long id,
            String fullName,
            String email,
            String employeeId,
            String department,
            Role role,
            boolean mustChangePassword) {

        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.employeeId = employeeId;
        this.department = department;
        this.role = role;
        this.mustChangePassword =
                mustChangePassword;
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
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

    public boolean isMustChangePassword() {
        return mustChangePassword;
    }
}
