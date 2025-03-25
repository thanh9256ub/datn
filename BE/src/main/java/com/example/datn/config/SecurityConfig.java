package com.example.datn.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;
import java.util.Collection;
import java.util.List;

@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {

    @Value("${jwt.signerKey}")
    private String signerKey;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        try {
            httpSecurity
                    .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(request -> request
                            .requestMatchers("/auth/token",
                                    "auth/introspect")
                            .permitAll()
                            .requestMatchers("/address/**", "/role/**")
                            .hasAnyRole("CUSTOMER", "EMPLOYEE", "ADMIN")
                            .requestMatchers(
                                    "/customer/**")
                            .hasAnyRole("EMPLOYEE", "ADMIN")
                            .anyRequest().hasRole("ADMIN")
                    ).addFilterBefore(new RequestLoggingFilter(), UsernamePasswordAuthenticationFilter.class);

            httpSecurity.oauth2ResourceServer(oauth2 ->
                    oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder())
                            .jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );
            httpSecurity.cors(corsConfig -> corsConfig.configurationSource(corsConfigurationSource()));
            httpSecurity.csrf(AbstractHttpConfigurer::disable);
            log.info("Config success");
            return httpSecurity.build();
        } catch (Exception e) {
            log.error("Exception: ", e);
            return httpSecurity.build();
        }
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

        // Tạo JwtGrantedAuthoritiesConverter để lấy quyền từ claim "roles"
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthoritiesClaimName("roles");
        authoritiesConverter.setAuthorityPrefix("ROLE_");

        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);

        // Log các quyền sau khi ánh xạ
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<GrantedAuthority> authorities = authoritiesConverter.convert(jwt);
            log.info("Granted Authority: {}", authorities);
            return authorities;
        });

        return converter;
    }

    @Bean
    JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");
        return NimbusJwtDecoder
                .withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    @Bean
    UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://127.0.0.1:3000", "http://localhost:3000"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
