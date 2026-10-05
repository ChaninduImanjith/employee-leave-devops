package com.devopsproject.leave_management.auth;

import com.devopsproject.leave_management.auth.dto.ChangePasswordRequest;
import com.devopsproject.leave_management.auth.dto.CurrentUserResponse;
import com.devopsproject.leave_management.auth.dto.LoginRequest;
import com.devopsproject.leave_management.auth.dto.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    @PatchMapping("/change-password")
    public ResponseEntity<CurrentUserResponse> changePassword(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ChangePasswordRequest request) {

        return ResponseEntity.ok(
                authService.changePassword(
                        jwt.getSubject(),
                        request
                )
        );
    }


    @GetMapping("/me")
    public ResponseEntity<CurrentUserResponse> getCurrentUser(
            @AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok(
                authService.getCurrentUser(
                        jwt.getSubject()
                )
        );
    }
}
