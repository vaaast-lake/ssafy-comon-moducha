package com.example.restea.share.repository;

import com.example.restea.share.entity.ShareComment;
import com.example.restea.share.entity.ShareReply;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShareReplyRepository extends JpaRepository<ShareReply, Integer> {

    Long countByShareComment(ShareComment shareComment);

}
