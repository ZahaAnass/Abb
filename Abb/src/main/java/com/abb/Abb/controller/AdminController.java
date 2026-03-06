package com.abb.Abb.controller;

import com.abb.Abb.dto.AdminDashboardDTO;
import com.abb.Abb.dto.EmployeeRequest;
import com.abb.Abb.entity.Client;
import com.abb.Abb.entity.Employee;
import com.abb.Abb.entity.Transaction;
import com.abb.Abb.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(adminService.getAllEmployees());
    }

    @PostMapping("/employees")
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeRequest request) {
        // Keep simple null checks here as they are part of the Request validation
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email requis"));
        }

        try {
            return ResponseEntity.ok(adminService.createEmployee(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/clients")
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(adminService.getAllClients());
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(adminService.getAllTransactions());
    }
}