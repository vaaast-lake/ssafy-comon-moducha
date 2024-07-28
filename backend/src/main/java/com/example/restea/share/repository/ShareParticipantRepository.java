package com.example.restea.share.repository;

import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.entity.ShareParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShareParticipantRepository extends JpaRepository<ShareParticipant, Integer> {

  Long countByShareBoard(ShareBoard shareBoard);

}
