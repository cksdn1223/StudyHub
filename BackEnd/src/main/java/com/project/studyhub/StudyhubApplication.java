package com.project.studyhub;

import com.project.studyhub.entity.User;
import com.project.studyhub.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableAsync
public class StudyhubApplication {

  public static void main(String[] args) {
		SpringApplication.run(StudyhubApplication.class, args);
	}

}
