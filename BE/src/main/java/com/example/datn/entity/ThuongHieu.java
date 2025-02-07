package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "thuong_hieu")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ThuongHieu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "ma_thuong_hieu")
    String maThuongHieu;

    @Column(name = "ten_thuong_hieu")
    String tenThuongHieu;

    @Column(name = "mo_ta")
    String moTa;
}
