package com.example.restea.teatime.repository;

import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.entity.TeatimeParticipant;
import com.example.restea.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface TeatimeParticipantRepository extends JpaRepository<TeatimeParticipant, Integer> {
    boolean existsByTeatimeBoardAndUser(TeatimeBoard teatimeBoard, User user);

    @Modifying
    @Transactional
    @Query("DELETE FROM TeatimeParticipant tp WHERE tp.user.id = :userId")
    void deleteByUserId(@Param("userId") Integer userId);
}
