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
@Table(name = "doi_hang")
@FieldDefaults(level = AccessLevel.PRIVATE)

public class DoiHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    Customer customer;

    @ManyToOne
    @JoinColumn(name = "id_don_hang")
    Order order;

    String ly_do_doi_chung;

    Integer trang_thai;

    LocalDateTime ngay_tao;

    LocalDateTime ngay_cap_nhat;

}
