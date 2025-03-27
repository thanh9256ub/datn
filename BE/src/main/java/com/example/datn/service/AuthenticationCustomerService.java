package com.example.datn.service;

import com.example.datn.dto.request.AuthencaticationCustomerRequest;
import com.example.datn.dto.request.RegisterCustomerRequest;
import com.example.datn.dto.response.ApiResponse;
import com.example.datn.dto.response.AuthenticationCustomerResponse;
import com.example.datn.entity.Customer;
import com.example.datn.entity.Role;
import com.example.datn.repository.CustomerRepository;
import com.example.datn.repository.RoleRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.security.sasl.AuthenticationException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationCustomerService {

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    EmailService emailService;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    public AuthenticationCustomerResponse authenticationResponse(AuthencaticationCustomerRequest authencaticationCustomerRequest) throws AuthenticationException {
        var customer = customerRepository.findByEmail(authencaticationCustomerRequest.getEmail()).orElseThrow(
                () -> new AuthenticationException("Customer not existed.")
        );

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        boolean authentiated = passwordEncoder.matches(authencaticationCustomerRequest.getPassword(),
                customer.getPassword());
//                "$2a$10$m3Dp6sBrBrUr2ZfOcCFxBefZL0QA2C2h7Zm95DsnH3wkz81CulfjC");

        if (!authentiated) {
            throw new AuthenticationException("Unauthenticated");
        }

        String token = generateToken(authencaticationCustomerRequest.getEmail(), customer.getRole().getRoleName());

        return AuthenticationCustomerResponse.builder()
                .token(token)
                .authenticated(true)
                .email(customer.getEmail())
                .role(customer.getRole().getRoleName())
                .build();
    }

    private String generateToken(String email, String roleName) {

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(email)
                .issuer("hien.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(9, ChronoUnit.HOURS).toEpochMilli()
                ))
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

    public ApiResponse<Object> register(RegisterCustomerRequest registerCustomerRequest) {
        if (StringUtils.isBlank(registerCustomerRequest.getEmail()))
            return ApiResponse.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("Email không được để trống!")
                    .build();
        if (StringUtils.isBlank(registerCustomerRequest.getPhone()))
            return ApiResponse.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("Phone không được để trống!")
                    .build();
        if (StringUtils.isBlank(registerCustomerRequest.getFullName()))
            return ApiResponse.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("FullName không được để trống!")
                    .build();
        if (customerRepository.existsAllByEmailOrPhone(registerCustomerRequest.getEmail(), registerCustomerRequest.getPhone())) {
            return ApiResponse.builder()
                    .status(HttpStatus.BAD_REQUEST.value())
                    .message("Customer is existed!")
                    .build();
        }

        Role role = roleRepository.findById(1).get();
        String password = generatePassword();
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        Customer customer = Customer.builder()
                .customerCode("KH.....")
                .fullName(registerCustomerRequest.getFullName())
                .birthDate(registerCustomerRequest.getBirthDate())
                .email(registerCustomerRequest.getEmail())
                .phone(registerCustomerRequest.getPhone())
                .gender(registerCustomerRequest.getGender())
                .password(passwordEncoder.encode(password))
                .status(1)
                .role(role)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Customer created = customerRepository.save(customer);
        created.setCustomerCode(generateCustomerCode(created.getId()));
        customerRepository.save(created);
        emailService.sendSimpleMessage(customer.getEmail(), "Password login", "Chào, " + customer.getFullName() +
                "\n" +
                "Cảm ơn quý khách đã tin tưởng và lựa chọn sản phẩm của chúng tôi. Chúng tôi rất vui mừng khi biết rằng quý khách đã có trải nghiệm mua sắm tuyệt vời tại H2TL. Chúng tôi cam kết sẽ luôn cung cấp những sản phẩm chất lượng và dịch vụ tốt nhất đến quý khách.\n" +
                "\n" +
                "Để hoàn tất việc truy cập vào tài khoản của mình, xin vui lòng sử dụng mật khẩu sau để đăng nhập:\n" +
                "Mật khẩu: " + password + "\n" +
                "\n" +
                "Nếu có bất kỳ câu hỏi nào hoặc cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng tôi. Chúng tôi luôn sẵn sàng hỗ trợ quý khách.\n" +
                "\n" +
                "Chúc quý khách một ngày tuyệt vời và hy vọng được phục vụ quý khách trong tương lai!");

        return ApiResponse.builder()
                .status(HttpStatus.CREATED.value())
                .message("Đăng ký thành công!")
                .build();
    }

    private String generateCustomerCode(Integer id) {
        return String.format("KH%05d", id);
    }

    private String generatePassword() {
        return String.format("%06d", new Random().nextInt(1000000));
    }
}
