package com.example.restea.share.repository;

import com.example.restea.share.entity.ShareBoard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ShareBoardRepository extends JpaRepository<ShareBoard, Integer> {

  Long countByActivated(boolean b);

  @Query("SELECT s FROM ShareBoard s WHERE s.activated = true AND s.endDate > CURRENT_DATE")
  Page<ShareBoard> findAllActivatedEndFuture(Pageable pageable);

}