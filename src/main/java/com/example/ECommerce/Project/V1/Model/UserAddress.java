package com.example.ECommerce.Project.V1.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "useraddress")
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class UserAddress extends BaseEntity{

    @EmbeddedId
    private UserAddressKey id;

    @ManyToOne(optional = false)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @MapsId("addressId")
    @JoinColumn(name = "address_id")
    private Address address;
}
