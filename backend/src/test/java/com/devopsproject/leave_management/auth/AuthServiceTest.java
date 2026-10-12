package com.devopsproject.leave_management.auth;

import com.devopsproject.leave_management.auth.dto.ChangePasswordRequest;
import com.devopsproject.leave_management.auth.dto.CurrentUserResponse;
import com.devopsproject.leave_management.auth.dto.LoginRequest;
import com.devopsproject.leave_management.auth.dto.LoginResponse;
import com.devopsproject.leave_management.security.JwtService;
import com.devopsproject.leave_management.user.Role;
import com.devopsproject.leave_management.user.UserAccount;
import com.devopsproject.leave_management.user.UserAccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserAccountRepository userAccountRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private UserAccount testUser;

    @BeforeEach
    void setUp() {
        testUser = new UserAccount();
        testUser.setId(1L);
        testUser.setFullName("Admin User");
        testUser.setUsername("admin");
        testUser.setEmail("admin@leaveflow.com");
        testUser.setPassword("encodedPassword");
        testUser.setRole(Role.ADMIN);
        testUser.setEnabled(true);
        testUser.setMustChangePassword(false);
    }

    @Test
    void login_Success_WithEmail() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("admin@leaveflow.com");
        request.setPassword("plainPassword");

        when(userAccountRepository.findByEmail("admin@leaveflow.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("plainPassword", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken(testUser)).thenReturn("mock.jwt.token");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("Admin User", response.getFullName());
        assertEquals("mock.jwt.token", response.getAccessToken());
        assertEquals("Bearer", response.getTokenType());
    }

    @Test
    void login_Success_WithUsername() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("admin");
        request.setPassword("plainPassword");

        when(userAccountRepository.findByEmail("admin")).thenReturn(Optional.empty());
        when(userAccountRepository.findByUsername("admin")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("plainPassword", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken(testUser)).thenReturn("mock.jwt.token");

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("Admin User", response.getFullName());
        assertEquals("mock.jwt.token", response.getAccessToken());
    }

    @Test
    void login_InvalidPassword_ThrowsException() {
        LoginRequest request = new LoginRequest();
        request.setIdentifier("admin@leaveflow.com");
        request.setPassword("wrongPassword");

        when(userAccountRepository.findByEmail("admin@leaveflow.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authService.login(request));
    }

    @Test
    void login_DisabledAccount_ThrowsException() {
        testUser.setEnabled(false);

        LoginRequest request = new LoginRequest();
        request.setIdentifier("admin@leaveflow.com");
        request.setPassword("plainPassword");

        when(userAccountRepository.findByEmail("admin@leaveflow.com")).thenReturn(Optional.of(testUser));

        assertThrows(IllegalArgumentException.class, () -> authService.login(request));
    }

    @Test
    void changePassword_Success() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("oldPassword");
        request.setNewPassword("newPassword");

        when(userAccountRepository.findByEmail("admin@leaveflow.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPassword", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.matches("newPassword", "encodedPassword")).thenReturn(false);
        when(passwordEncoder.encode("newPassword")).thenReturn("newEncodedPassword");
        when(userAccountRepository.save(any(UserAccount.class))).thenAnswer(invocation -> invocation.getArgument(0));

        CurrentUserResponse response = authService.changePassword("admin@leaveflow.com", request);

        assertNotNull(response);
        assertEquals("newEncodedPassword", testUser.getPassword());
        assertFalse(testUser.isMustChangePassword());
    }
}
