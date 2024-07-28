package com.example.restea.live.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

import com.example.restea.live.repository.LiveRepository;
import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.entity.TeatimeParticipant;
import com.example.restea.teatime.repository.TeatimeBoardRepository;
import com.example.restea.teatime.repository.TeatimeParticipantRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDateTime;
import java.util.Optional;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@DisplayName("Live Service")
@ExtendWith(MockitoExtension.class)
class LiveServiceTest {

  // 테스트 주체의 외부 의존성들 -> Mock 객체로 생성하기
  @Mock
  private EntityManager entityManager;
  @Mock
  private UserRepository userRepository;
  @Mock
  private TeatimeBoardRepository teatimeBoardRepository;
  @Mock
  private TeatimeParticipantRepository teatimeParticipantRepository;
  @Mock
  private LiveRepository liveRepository;

  // 단위 테스트의 주체 -> @InjectMocks로 가짜 의존성 주입받기
  @InjectMocks
  private LiveService liveService;

  private User testUser;
  private User testUser2;
  private TeatimeBoard testTeatimeBoard;
  private TeatimeBoard testTeatimeBoard2;
  private TeatimeParticipant testTeatimeParticipant;


  @BeforeEach
  void setUp() {
    testUser = User.builder()
        .nickname("testUser")
        .authId("authid")
        .build();

    ReflectionTestUtils.setField(testUser, "id", 1);

    testUser2 = User.builder()
        .nickname("testUser2")
        .authId("authid")
        .build();

    ReflectionTestUtils.setField(testUser2, "id", 2);

    testTeatimeBoard = com.example.restea.teatime.entity.TeatimeBoard.builder()
        .title("testTeatimeBoard")
        .content("내용")
        .broadcastDate(LocalDateTime.now())
        .maxParticipants(5)
        .endDate(LocalDateTime.now())
        .user(testUser) // 여기에 testUser 설정
        .activated(true)
        .build();

    ReflectionTestUtils.setField(testTeatimeBoard, "id", 1);

    testTeatimeBoard2 = com.example.restea.teatime.entity.TeatimeBoard.builder()
        .title("testTeatimeBoard2")
        .content("내용")
        .broadcastDate(LocalDateTime.now())
        .maxParticipants(5)
        .endDate(LocalDateTime.now())
        .user(testUser) // 여기에 testUser 설정
        .activated(false)
        .build();

    ReflectionTestUtils.setField(testTeatimeBoard, "id", 2);


    testTeatimeParticipant = com.example.restea.teatime.entity.TeatimeParticipant.builder()
        .name("test")
        .phone("010xxxxxxxx")
        .address("address")
        .teatimeBoard(testTeatimeBoard)
        .user(testUser2)
        .build();
  }


  @Test
  @DisplayName("방송 생성 여부 조회 테스트 - 성공 : 방 없는 경우")
  void isLiveOpenSuccessFalse() throws Exception {

    // Given
    Mockito.when(teatimeBoardRepository.findById(1)).thenReturn(Optional.of(testTeatimeBoard));

    // When
    boolean isOpen = liveService.isLiveOpen(1, testUser);

    // Then
    Assertions.assertThat(isOpen).isFalse();
  }

  @Test
  @DisplayName("방송 생성 여부 조회 테스트 - 성공 : 방 있는 경우")
  void isLiveOpenSuccessTrue() {

    // Given
    Mockito.when(teatimeBoardRepository.findById(1)).thenReturn(Optional.of(testTeatimeBoard));
    Mockito.when(liveRepository.existsByTeatimeBoard(testTeatimeBoard)).thenReturn(true);

    // When
    boolean isOpen = liveService.isLiveOpen(1, testUser);

    // Then
    Assertions.assertThat(isOpen).isTrue();
  }

  @Test
  @DisplayName("방송 생성 여부 조회 테스트 - 실패 : 티타임 게시글이 없는 경우")
  void isLiveOpenFailTeatimeBoardNotFound() {

    // Given
    when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.empty());

    // When & Then
    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
        liveService.isLiveOpen(10, testUser));

    assertEquals("404 NOT_FOUND \"TeatimeBoard not found\"", exception.getMessage());
  }

  @Test
  @DisplayName("방송 생성 여부 조회 테스트 - 실패 : 티타임 게시글이 삭제된 경우")
  void isLiveOpenFailTeatimeBoardNotActivated() {

    // Given
    Mockito.when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.of(testTeatimeBoard2));

    // When & Then
    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
        liveService.isLiveOpen(10, testUser));

    assertEquals("404 NOT_FOUND \"TeatimeBoard not activated\"", exception.getMessage());
  }

  @Test
  @DisplayName("방송 생성 여부 조회 테스트 - 실패 : 티타임 게시글이 참가자가 아닌 경우")
  void isLiveOpenFailNotTeatimeBoardParticipant() {

    // Given
    Mockito.when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.of(testTeatimeBoard));
    Mockito.when(teatimeParticipantRepository.existsByTeatimeBoardAndUser(testTeatimeBoard, testUser2)).thenReturn(false);

    // When & Then
    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
        liveService.isLiveOpen(10, testUser2));

    assertEquals("403 FORBIDDEN \"Not a participant\"", exception.getMessage());
  }

  @Test
  void createLive() {
  }

  @Test
  void createToken() {
  }

  @Test
  void webHook() {
  }
}