package com.example.datn.service;

import com.example.datn.dto.request.AuthenticationRequest;
import com.example.datn.dto.request.IntrospectRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.AuthenticationResponse;
import com.example.datn.dto.response.IntrospectResponse;
import com.example.datn.entity.Employee;


import com.example.datn.exception.ResourceNotFoundException;

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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.sasl.AuthenticationException;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    EmailService emailService;

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
                .idEmployee(employee.getId())
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

    public ResponseEntity<ApiResponse<?>> changePassword(String token, String oldPassword, String newPassword) throws JOSEException, ParseException, AuthenticationException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        boolean verified = signedJWT.verify(verifier);
        if (expiryTime.before(new Date()) || !verified)
            throw new AuthenticationException("Authentication failed");
        String userName = signedJWT.getJWTClaimsSet().getSubject();
        Optional<Employee> employeeOptional = employeeRepository.findByUsername(userName);
        if (employeeOptional.isEmpty())
            throw new ResourceNotFoundException("User is not exist!");

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        Employee employee = employeeOptional.get();
        if (passwordEncoder.matches(oldPassword, employee.getPassword())) {
            employee.setPassword(passwordEncoder.encode(newPassword));
            employeeRepository.save(employee);
            ApiResponse<?> apiResponse = new ApiResponse<>(
                    HttpStatus.OK.value(),
                    "Employee change password successfully"
            );

            return ResponseEntity.ok(apiResponse);
        }
        ApiResponse<?> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "OldPassword is invalid"
        );
        return ResponseEntity.ok(apiResponse);
    }

    private String generatePassword() {
        return String.format("%06d", new Random().nextInt(1000000));
    }

    public ResponseEntity<ApiResponse<?>> forgotPassword(String email) {
        Optional<Employee> employeeOptional = employeeRepository.findByEmail(email);
        if (employeeOptional.isEmpty())
            throw new ResourceNotFoundException("User is not exist!");
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        Employee employee = employeeOptional.get();
        String password = generatePassword();
        employee.setPassword(passwordEncoder.encode(password));
        emailService.sendSimpleMessage(employee.getEmail(), "Chào mừng bạn đến với H2TL - Thông tin đăng nhập của bạn", "Chào, " + employee.getFullName() + "\n" +
                "Chúc mừng bạn đã gia nhập đội ngũ tại H2TL! Chúng tôi rất vui khi bạn trở thành một phần của gia đình chúng tôi và hy vọng bạn sẽ có một hành trình làm việc đầy thú vị và thành công tại đây.\n" +
                "\n" +
                "Để bạn có thể bắt đầu công việc, dưới đây là thông tin tài khoản đăng nhập hệ thống của bạn:\n" +
                "Tên đăng nhập: " + employee.getUsername() + "\n" +
                "Mật khẩu: " + password + "\n" +
                "\n" +
                "Hãy sử dụng thông tin này để đăng nhập vào hệ thống. Nếu có bất kỳ vấn đề nào trong quá trình đăng nhập hoặc bạn cần sự trợ giúp, đừng ngần ngại liên hệ với bộ phận quản lý của cửa hàng.\n" +
                "\n" +
                "Chúc bạn một ngày làm việc hiệu quả và hy vọng bạn sẽ nhanh chóng làm quen với công việc!");
        employeeRepository.save(employee);
        ApiResponse<?> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Vui lòng kiểm tra email, password đã được gửi!"
        );

        return ResponseEntity.ok(apiResponse);
    }
}