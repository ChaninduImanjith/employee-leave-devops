package com.devopsproject.leave_management.user;

import com.devopsproject.leave_management.user.dto.CreateEmployeeRequest;
import com.devopsproject.leave_management.user.dto.EmployeeResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeManagementController {

    private final EmployeeManagementService employeeManagementService;

    public EmployeeManagementController(
            EmployeeManagementService employeeManagementService) {

        this.employeeManagementService =
                employeeManagementService;
    }

    @PostMapping
    public ResponseEntity<EmployeeResponse> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        employeeManagementService
                                .createEmployee(request)
                );
    }

    @GetMapping
    public ResponseEntity<List<EmployeeResponse>>
    getAllEmployees() {

        return ResponseEntity.ok(
                employeeManagementService
                        .getAllEmployees()
        );
    }
}
