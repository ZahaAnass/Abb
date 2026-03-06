package com.abb.Abb.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String rib;
    private BigDecimal solde;
}