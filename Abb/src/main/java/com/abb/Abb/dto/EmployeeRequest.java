package com.abb.Abb.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeRequest {
    private String name;
    private String email;
    private String role;
    private String division;
    private String agence;
}