package com.example.restea.teatime.repository;

import com.example.restea.live.entity.Live;
import com.example.restea.teatime.entity.TeatimeBoard;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeatimeBoardRepository extends JpaRepository<TeatimeBoard, Integer> {
  Optional<TeatimeBoard> findByLive(Live live);
}