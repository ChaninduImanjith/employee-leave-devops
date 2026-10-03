package com.devopsproject.leave_management.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetEmployeePasswordRequest {

    @NotBlank(message = "Temporary password is required")
    @Size(
            min = 8,
            message = "Temporary password must contain at least 8 characters"
    )
    private String temporaryPassword;

    public ResetEmployeePasswordRequest() {
    }

    public String getTemporaryPassword() {
        return temporaryPassword;
    }

    public void setTemporaryPassword(String temporaryPassword) {
        this.temporaryPassword = temporaryPassword;
    }
}
