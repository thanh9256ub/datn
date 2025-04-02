package com.example.datn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableScheduling
public class DatnBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(DatnBackendApplication.class, args);
//        System.out.println(getPassword("123456"));
    }

    public static String getPassword(String password){
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        String pass = passwordEncoder.encode(password);

        return pass;
    }
}
