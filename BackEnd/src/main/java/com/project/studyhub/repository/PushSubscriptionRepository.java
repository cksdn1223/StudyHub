package com.project.studyhub.repository;

import com.project.studyhub.entity.PushSubscription;
import com.project.studyhub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PushSubscriptionRepository extends JpaRepository<PushSubscription, Long> {
    Optional<PushSubscription> findByUserAndEndpoint(User user, String endpoint);
    List<PushSubscription> findAllByUser(User user);
}