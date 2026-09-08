package com.healthpoint.repository;

import com.healthpoint.entity.WearableConnection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface WearableConnectionRepository extends JpaRepository<WearableConnection, Long> {

    List<WearableConnection> findByUserId(Long userId);

    Optional<WearableConnection> findByUserIdAndProvider(Long userId, String provider);

    @Transactional
    @Modifying
    @Query("DELETE FROM WearableConnection w WHERE w.userId = :userId")
    void deleteAllByUserId(@Param("userId") Long userId);
}
