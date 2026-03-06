package com.abb.Abb.service;

import com.abb.Abb.dto.AdminDashboardDTO;
import com.abb.Abb.dto.EmployeeRequest;
import com.abb.Abb.entity.Client;
import com.abb.Abb.entity.Employee;
import com.abb.Abb.entity.Transaction;
import com.abb.Abb.repository.ClientRepository;
import com.abb.Abb.repository.EmployeeRepository;
import com.abb.Abb.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private EmployeeRepository employeeRepo;

    @Autowired
    private ClientRepository clientRepo;

    @Autowired
    private TransactionRepository transactionRepo;

    public AdminDashboardDTO getStats() {
        AdminDashboardDTO stats = new AdminDashboardDTO();
        stats.setTotalEmployees(employeeRepo.count());
        stats.setTotalClients(clientRepo.count());
        stats.setTotalTransactions(transactionRepo.count());
        return stats;
    }

    public Employee createEmployee(EmployeeRequest request) {
        if (employeeRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé par un autre employé.");
        }

        Employee newEmployee = new Employee();
        newEmployee.setName(request.getName());
        newEmployee.setEmail(request.getEmail());
        newEmployee.setRole(request.getRole());
        newEmployee.setDivision(request.getDivision());
        newEmployee.setAgence(request.getAgence());
        newEmployee.setCreationDate(LocalDateTime.now());

        return employeeRepo.save(newEmployee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepo.findAll();
    }

    public List<Client> getAllClients() {
        List<Client> clients = clientRepo.findAll();
        clients.forEach(c -> c.setPassword(null));
        return clients;
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepo.findAll(Sort.by(Sort.Direction.DESC, "transactionDate"));
    }
}