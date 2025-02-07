package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "hinh_anh")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HinhAnh {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "id_sp_ms")
    SanPhamMauSac sanPhamMauSac;

    @Column(name = "hinh_anh")
    String hinhAnh;

}
