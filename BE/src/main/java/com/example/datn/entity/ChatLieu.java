package com.example.datn.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chat_lieu")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class ChatLieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String ma_chat_lieu;

    String ten_chat_lieu;

    String mo_ta;
}
