package com.project.studyhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class StudyhubApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudyhubApplication.class, args);
    }
}
