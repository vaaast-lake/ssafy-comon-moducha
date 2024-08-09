package com.example.restea.teatime.repository;

import com.example.restea.teatime.entity.TeatimeBoard;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeatimeBoardRepository extends JpaRepository<TeatimeBoard, Integer> {

    // sort = latest
    Long countByActivated(boolean b);

    Page<TeatimeBoard> findAllByActivated(boolean b, Pageable pageable);

    // sort = urgent
    Long countByActivatedAndEndDateAfter(boolean b, Object o);

    Page<TeatimeBoard> findAllByActivatedAndEndDateAfter(boolean b, LocalDateTime now, PageRequest endDate);

    Page<TeatimeBoard> findAllByActivatedAndUserId(boolean b, Integer userId, Pageable pageable);

    Optional<TeatimeBoard> findByIdAndActivated(Integer id, boolean b);
}