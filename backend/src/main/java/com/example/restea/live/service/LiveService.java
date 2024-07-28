package com.example.restea.live.service;

import com.example.restea.live.entity.Live;
import com.example.restea.live.repository.LiveRepository;
import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.repository.TeatimeBoardRepository;
import com.example.restea.teatime.repository.TeatimeParticipantRepository;
import com.example.restea.user.entity.User;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class LiveService{

  private final LiveRepository liveRepository;
  private final TeatimeBoardRepository teatimeBoardRepository;
  private final TeatimeParticipantRepository teatimeParticipantRepository;

  @Value("${livekit.api.key}")
  private String LIVEKIT_API_KEY;

  @Value("${livekit.api.secret}")
  private String LIVEKIT_API_SECRET;


  public boolean isLiveOpen(int teatimeBoardId, User user){

    // 티타임 게시글 존재 여부 확인
    TeatimeBoard teatimeBoard = checkTeatimeBoard(teatimeBoardId);


    // 티타임 방송 참가자 여부 확인
    boolean isTeatimeParticipant = teatimeParticipantRepository.existsByTeatimeBoardAndUser(teatimeBoard, user);
    if(teatimeBoard.getUser() != user && !isTeatimeParticipant){
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not a participant");
    }


    // 티타임 방송 개설 여부 확인
    return liveRepository.existsByTeatimeBoard(teatimeBoard);
  }



  @Transactional
  public AccessToken createLive(int teatimeBoardId, User user) {

    // 티타임 게시글 존재 여부 확인
    TeatimeBoard teatimeBoard = checkTeatimeBoard(teatimeBoardId);


    // 티타임 게시글 작성자인지 확인
    if(!Objects.equals(teatimeBoard.getUser().getId(), user.getId())){
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not a writer");
    }


    // 방송 예정일인지 확인
    LocalDateTime broadcastDate = teatimeBoard.getBroadcastDate();
    LocalDateTime now = LocalDateTime.now();
    if(broadcastDate.toLocalDate().isEqual(now.toLocalDate())){
      // 방송 예정일보다 현재 시간이 전인 경우
      if(!broadcastDate.isBefore(now)){
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Before the broadcast date");
      }
    }else{
      // 방송 예정일이랑 다른 날인 경우
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Different from the broadcast date");
    }


    // 방송 생성
    Live live = Live.builder()
        .teatimeBoard(teatimeBoard)
        .build();

    liveRepository.save(live);


    // AccessToken 발급 및 호스트 토큰 반환
    return createToken(live.getId(), user);
  }



  // 티타임 게시글 존재하는지 확인하는 메소드
  private TeatimeBoard checkTeatimeBoard(int teatimeBoardId) {
    Optional<TeatimeBoard> teatimeBoardOptional = teatimeBoardRepository.findById(teatimeBoardId);
    TeatimeBoard teatimeBoard;
    if(teatimeBoardOptional.isPresent()){
      teatimeBoard = teatimeBoardOptional.get();
    }else{
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "TeatimeBoard not found");
    }

    // 티타임 게시글 삭제 여부 확인
    if(!teatimeBoard.getActivated()){
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "TeatimeBoard not activated");
    }

    return teatimeBoard;
  }



  // AccessToken 발급하는 메소드
  private AccessToken createToken(String liveId, User user){
    AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
    token.setName(user.getId().toString());
    token.setIdentity(user.getNickname()); // 남한테 보이는 이름
    token.addGrants(new RoomJoin(true), new RoomName(liveId));

    return token;
  }



}
