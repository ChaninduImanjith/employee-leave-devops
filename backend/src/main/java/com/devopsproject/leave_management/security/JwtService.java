package com.devopsproject.leave_management.security;

import com.devopsproject.leave_management.user.UserAccount;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;

    @Value("${JWT_EXPIRATION_HOURS:8}")
    private long expirationHours;

    public JwtService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String generateToken(UserAccount user) {

        Instant now = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("leave-management-api")
                .issuedAt(now)
                .expiresAt(
                        now.plus(
                                Duration.ofHours(expirationHours)
                        )
                )
                .subject(user.getEmail())
                .claim("userId", user.getId())
                .claim("role", user.getRole().name())
                .build();

        JwsHeader header = JwsHeader
                .with(MacAlgorithm.HS256)
                .build();

        return jwtEncoder
                .encode(
                        JwtEncoderParameters.from(
                                header,
                                claims
                        )
                )
                .getTokenValue();
    }
}
