package com.abb.Abb.service;

import com.abb.Abb.entity.User;
import com.abb.Abb.entity.UserPrincipal;
import com.abb.Abb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()
                        -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email : " + email)
                );
        return new UserPrincipal(user);
    }
}