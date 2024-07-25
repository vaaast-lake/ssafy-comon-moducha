package com.example.restea.live.entity;

import com.example.restea.common.entity.BaseTimeEntity;
import com.example.restea.teatime.entity.TeatimeBoard;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicInsert
public class Live extends BaseTimeEntity {
  @Id
  @Column(name = "live_id")
  private String id = UUID.randomUUID().toString();

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "teatime_board_id")
  private TeatimeBoard teatimeBoard;
}
