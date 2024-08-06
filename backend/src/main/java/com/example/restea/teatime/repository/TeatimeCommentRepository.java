package com.example.restea.teatime.repository;

import com.example.restea.teatime.entity.TeatimeComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeatimeCommentRepository extends JpaRepository<TeatimeComment, Integer> {

}
