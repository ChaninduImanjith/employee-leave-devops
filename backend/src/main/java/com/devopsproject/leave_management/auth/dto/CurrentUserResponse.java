package com.devopsproject.leave_management.auth.dto;

import com.devopsproject.leave_management.user.Role;

public class CurrentUserResponse {

    private final Long id;
    private final String fullName;
    private final String email;
    private final String employeeId;
    private final String department;
    private final Role role;

    public CurrentUserResponse(
            Long id,
            String fullName,
            String email,
            String employeeId,
            String department,
            Role role) {

        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.employeeId = employeeId;
        this.department = department;
        this.role = role;
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
}
