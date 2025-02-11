package com.example.datn.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "dia_chi")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class DiaChi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    String tinh_thanh_pho;

    String quan_huyen;

    String phuong_xa;

    String dia_chi_chi_tiet;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    Customer customer;

    Integer trang_thai;

    LocalDateTime ngay_tao;

    LocalDateTime ngay_cap_nhat;

}

