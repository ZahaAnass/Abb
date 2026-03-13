package com.abb.Abb.config;

import com.abb.Abb.entity.Admin;
import com.abb.Abb.entity.Client;
import com.abb.Abb.entity.Transaction;
import com.abb.Abb.entity.Employee;
import com.abb.Abb.repository.AdminRepository;
import com.abb.Abb.repository.ClientRepository;
import com.abb.Abb.repository.TransactionRepository;
import com.abb.Abb.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public void run(String... args) throws Exception {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        Random random = new Random();

        if (adminRepository.count() == 0) {
            Admin defaultAdmin = new Admin();
            defaultAdmin.setName("System Admin");
            defaultAdmin.setEmail("admin@bank.com");
            defaultAdmin.setPassword(encoder.encode("admin123"));
            defaultAdmin.setRole("ADMIN");
            defaultAdmin.setCreationDate(LocalDateTime.now());

            adminRepository.save(defaultAdmin);
            System.out.println("✅ Default Admin account created: admin@bank.com / admin123");
        }

        if (employeeRepository.count() == 0) {
            String[] firstNames = {"Amine", "Nadia", "Khalid", "Salma", "Rachid", "Meryem", "Hassan", "Khadija", "Youssef", "Sanaa"};
            String[] lastNames = {"El Fassi", "Bennani", "Tazi", "Alaoui", "Idrissi", "Benali", "Chraibi", "Lahlou"};
            String[] roles = {"ADMIN", "MANAGER", "GUICHETIER", "DA"};
            String[] divisions = {"IT", "Ressources Humaines", "Finance", "Service Client", "Transformation digital"};
            String[] agences = {"Casablanca", "Marrakech", "Rabat", "Fès", "Tanger", "N/A"};

            for (int i = 0; i < 15; i++) {
                Employee emp = new Employee();
                String fullName = firstNames[random.nextInt(firstNames.length)] + " " + lastNames[random.nextInt(lastNames.length)];

                emp.setName(fullName);
                emp.setEmail("emp" + (i + 1) + "@bank.com");
                emp.setRole(roles[random.nextInt(roles.length)]);
                emp.setDivision(divisions[random.nextInt(divisions.length)]);
                emp.setAgence(agences[random.nextInt(agences.length)]);
                emp.setCreationDate(LocalDateTime.now().minusDays(random.nextInt(100)).minusHours(random.nextInt(24)));

                employeeRepository.save(emp);
            }
            System.out.println("✅ 15 Employees created. (Logins: emp1@bank.com to emp15@bank.com)");
        }

        if (clientRepository.count() == 0) {
            List<Client> seededClients = new ArrayList<>();
            String[] names = {"Karim Tazi", "Fatima Zahra", "Youssef Alaoui", "Amina Benali", "Omar Idrissi"};

            for (int i = 0; i < 60; i++) {
                Client client = new Client();
                client.setName(names[i % 5] + " " + i);
                client.setEmail("client" + (i + 1) + "@bank.com");
                client.setPassword(encoder.encode("password123"));
                client.setRole("CLIENT");
                client.setCreationDate(LocalDateTime.now().minusDays(random.nextInt(365)));

                client.setRib("35081000000000000000000" + (i < 10 ? "0" + i : i));

                client.setSolde(new BigDecimal(10000 + random.nextInt(40000)));

                seededClients.add(clientRepository.save(client));
            }
            System.out.println("✅ 60 Clients created. (Logins: client1@bank.com to client60@bank.com | Pass: password123)");

            String[] descriptions = {"Virement Loyer", "Paiement Facture", "Remboursement", "Achat en ligne", "Virement Salaire", "Cadeau d'anniversaire"};

            for (int i = 0; i < 25; i++) {
                Client sender = seededClients.get(random.nextInt(seededClients.size()));
                Client receiver;

                do {
                    receiver = seededClients.get(random.nextInt(seededClients.size()));
                } while (sender.getId().equals(receiver.getId()));

                Transaction transaction = new Transaction();
                transaction.setSenderRib(sender.getRib());
                transaction.setReceiverRib(receiver.getRib());

                transaction.setAmount(new BigDecimal(100 + random.nextInt(4900)));
                transaction.setDescription(descriptions[random.nextInt(descriptions.length)]);

                transaction.setTransactionDate(LocalDateTime.now().minusDays(random.nextInt(30)).minusHours(random.nextInt(24)));

                transactionRepository.save(transaction);
            }
            System.out.println("✅ 25 Random Transactions created.");
        }
    }
}