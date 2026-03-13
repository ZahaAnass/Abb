package com.abb.Abb.controller;

import com.abb.Abb.controller.api.ClientApiDocs;
import com.abb.Abb.dto.ClientDashboardDTO;
import com.abb.Abb.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/client")
public class ClientController implements ClientApiDocs {

    @Autowired
    private ClientService clientService;

    @Override
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData(Authentication authentication) {
        try {
            String email = authentication.getName();
            ClientDashboardDTO data = clientService.getDashboardData(email);
            return ResponseEntity.ok(data);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}