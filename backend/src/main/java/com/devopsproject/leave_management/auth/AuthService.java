package com.devopsproject.leave_management.auth;

import com.devopsproject.leave_management.auth.dto.CurrentUserResponse;
import com.devopsproject.leave_management.auth.dto.LoginRequest;
import com.devopsproject.leave_management.auth.dto.LoginResponse;
import com.devopsproject.leave_management.exception.ResourceNotFoundException;
import com.devopsproject.leave_management.security.JwtService;
import com.devopsproject.leave_management.user.UserAccount;
import com.devopsproject.leave_management.user.UserAccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        UserAccount user = userAccountRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        )
                );

        if (!user.isEnabled()) {
            throw new IllegalArgumentException(
                    "User account is disabled"
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        String accessToken =
                jwtService.generateToken(user);

        return new LoginResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getEmployeeId(),
                user.getDepartment(),
                user.getRole(),
                accessToken
        );
    }

    public CurrentUserResponse getCurrentUser(
            String email) {

        UserAccount user = userAccountRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Authenticated user account not found"
                        )
                );

        return new CurrentUserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getEmployeeId(),
                user.getDepartment(),
                user.getRole()
        );
    }
}
