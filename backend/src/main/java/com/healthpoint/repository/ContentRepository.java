package com.healthpoint.repository;

import com.healthpoint.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long> {
    List<Content> findByIsPremium(boolean isPremium);

    @Query("SELECT c FROM Content c WHERE c.type = :type AND (c.isPremium = false OR c.requiredAddon IN :addonTypes)")
    List<Content> findAccessibleContent(@Param("type") String type, @Param("addonTypes") List<String> addonTypes);
}