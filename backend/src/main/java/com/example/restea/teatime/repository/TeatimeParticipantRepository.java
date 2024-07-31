package com.example.restea.teatime.repository;

import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.entity.TeatimeParticipant;
import com.example.restea.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeatimeParticipantRepository extends JpaRepository<TeatimeParticipant, Integer> {
    boolean existsByTeatimeBoardAndUser(TeatimeBoard teatimeBoard, User user);

}
