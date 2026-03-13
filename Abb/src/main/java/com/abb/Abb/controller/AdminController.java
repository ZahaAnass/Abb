package com.abb.Abb.controller;

import com.abb.Abb.controller.api.AdminApiDocs; // 🚀 IMPORT THE INTERFACE
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
public class AdminController implements AdminApiDocs { // 🚀 IMPLEMENT THE INTERFACE

    @Autowired
    private AdminService adminService;

    @Override
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @Override
    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(adminService.getAllEmployees());
    }

    @Override
    @PostMapping("/employees")
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeRequest request) {
        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email requis"));
        }

        try {
            return ResponseEntity.ok(adminService.createEmployee(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Override
    @GetMapping("/clients")
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(adminService.getAllClients());
    }

    @Override
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(adminService.getAllTransactions());
    }
}