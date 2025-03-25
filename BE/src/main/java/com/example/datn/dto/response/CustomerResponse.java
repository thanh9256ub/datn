package com.example.datn.dto.response;

import com.example.datn.entity.Address;
import com.example.datn.entity.Customer;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomerResponse {

    Integer id;

    String customerCode;

    String fullName;

    String birthDate;

    Integer gender;

    String phone;

    String email;

    String password;

    String createdAt;

    String updatedAt;

    Integer roleId;

    String address;

    List<AddressResponse> addressList;

    public CustomerResponse(Customer customer) {
        this.id = customer.getId();
        this.customerCode = customer.getCustomerCode();
        this.fullName = customer.getFullName();
        this.birthDate = customer.getBirthDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.gender = customer.getGender();
        this.phone = customer.getPhone();
        this.email = customer.getEmail();
        this.password = customer.getPassword();
        this.createdAt = customer.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.updatedAt = Objects.isNull(customer.getUpdatedAt())
                ? customer.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                : customer.getUpdatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        this.roleId = Objects.isNull(customer.getRole()) ? 0 : customer.getRole().getId();
        this.addressList = new ArrayList<>();
        if (customer.getAddressList() != null)
            for (Address addressDetail : customer.getAddressList()) {
                this.addressList.add(new AddressResponse(addressDetail));
                if (addressDetail.getStatus() == 1)
                    this.address = addressDetail.getCity();
            }
    }
}
