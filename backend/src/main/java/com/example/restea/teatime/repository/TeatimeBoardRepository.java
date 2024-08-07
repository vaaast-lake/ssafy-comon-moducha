package com.example.restea.teatime.repository;

import com.example.restea.teatime.entity.TeatimeBoard;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeatimeBoardRepository extends JpaRepository<TeatimeBoard, Integer> {

    Long countByActivated(boolean b);

    Page<TeatimeBoard> findAllByActivatedAndUserId(boolean b, Integer userId, Pageable pageable);

    Long countByActivatedAndEndDateAfter(boolean b, Object o);

    Page<TeatimeBoard> findAllByActivatedAndEndDateAfter(boolean b, LocalDateTime now, PageRequest date);
}