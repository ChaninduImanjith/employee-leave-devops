package com.devopsproject.leave_management.auth.dto;

import com.devopsproject.leave_management.user.Role;

public class LoginResponse {

    private Long id;
    private String fullName;
    private String email;
    private String employeeId;
    private String department;
    private Role role;
    private String accessToken;
    private String tokenType;

    public LoginResponse(
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
                null
        );
    }

    public LoginResponse(
            Long id,
            String fullName,
            String email,
            String employeeId,
            String department,
            Role role,
            String accessToken) {

        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.employeeId = employeeId;
        this.department = department;
        this.role = role;
        this.accessToken = accessToken;
        this.tokenType =
                accessToken == null ? null : "Bearer";
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

    public String getAccessToken() {
        return accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }
}
