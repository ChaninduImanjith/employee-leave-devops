package com.devopsproject.leave_management.exception;

public class InsufficientLeaveBalanceException extends IllegalArgumentException {

    public InsufficientLeaveBalanceException(String message) {
        super(message);
    }
}
