package com.healthpoint.repository;

import com.healthpoint.entity.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    
    @Query("SELECT f.friendUserId FROM Friendship f WHERE f.userId = :userId AND f.status = 'ACCEPTED'")
    List<Long> findFriendUserIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT f FROM Friendship f WHERE (f.userId = :userId OR f.friendUserId = :userId) AND f.status = 'ACCEPTED'")
    List<Friendship> findAllAcceptedFriendships(@Param("userId") Long userId);
}
