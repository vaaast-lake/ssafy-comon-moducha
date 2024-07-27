package com.example.restea.live.service;

import com.example.restea.live.repository.LiveRepository;
import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.repository.TeatimeBoardRepository;
import com.example.restea.teatime.repository.TeatimeParticipantRepository;
import com.example.restea.user.entity.User;
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


    // 티타임 방송 참가자 여부 확인
    boolean isTeatimeParticipant = teatimeParticipantRepository.existsByTeatimeBoardAndUser(teatimeBoard, user);
    if(teatimeBoard.getUser() != user && !isTeatimeParticipant){
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not a participant");
    }


    // 티타임 방송 개설 여부 확인
    return liveRepository.existsByTeatimeBoard(teatimeBoard);
  }



}
