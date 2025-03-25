package com.example.datn.service;

import com.example.datn.dto.request.AuthenticationRequest;
import com.example.datn.dto.request.IntrospectRequest;
import com.example.datn.dto.response.AuthenticationResponse;
import com.example.datn.dto.response.IntrospectResponse;
import com.example.datn.repository.EmployeeRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.sasl.AuthenticationException;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {

    @Autowired
    EmployeeRepository employeeRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    public AuthenticationResponse authentication(AuthenticationRequest authenticationRequest)
            throws AuthenticationException {

        var employee = employeeRepository.findByUsername(authenticationRequest.getUsername()).orElseThrow(
                () -> new AuthenticationException("Employee not existed."));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        boolean authentiated = passwordEncoder.matches(authenticationRequest.getPassword(),
                employee.getPassword());
        // "$2a$10$m3Dp6sBrBrUr2ZfOcCFxBefZL0QA2C2h7Zm95DsnH3wkz81CulfjC");

        if (!authentiated) {
            throw new AuthenticationException("Unauthenticated");
        }

        String token = generateToken(authenticationRequest.getUsername(), employee.getRole().getRoleName());

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .fullName(employee.getFullName())
                .role(employee.getRole().getRoleName())
                .build();
    }

    private String generateToken(String username, String roleName) {

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(username)
                .issuer("hien.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(9, ChronoUnit.HOURS).toEpochMilli()))
                .claim("roles", List.of(roleName))
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token", e);
            throw new RuntimeException(e);
        }
    }

    public IntrospectResponse introspect(IntrospectRequest introspectRequest) throws JOSEException, ParseException {

        var token = introspectRequest.getToken();

        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expityTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        Integer roleId = signedJWT.getJWTClaimsSet().getIntegerClaim("role");

        var verified = signedJWT.verify(verifier);

        return IntrospectResponse.builder()
                .valid(verified && expityTime.after(new Date()))
                .build();
    }
}