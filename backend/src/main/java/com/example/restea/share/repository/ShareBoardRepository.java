package com.example.restea.share.repository;

import com.example.restea.share.entity.ShareBoard;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShareBoardRepository extends JpaRepository<ShareBoard, Integer> {

    // sort = latest
    Long countByActivated(boolean b);

    Page<ShareBoard> findAllByActivated(boolean b, Pageable pageable);

    // sort = urgent
    Long countByActivatedAndEndDateAfter(boolean b, Object o);

    Page<ShareBoard> findAllByActivatedAndEndDateAfter(boolean b, LocalDateTime now, PageRequest endDate);

    Page<ShareBoard> findAllByActivatedAndUserId(boolean b, Integer userId, Pageable pageable);
}