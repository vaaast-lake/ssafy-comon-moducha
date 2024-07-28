package com.example.restea.live.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.restea.live.entity.Live;
import com.example.restea.live.repository.LiveRepository;
import com.example.restea.teatime.entity.TeatimeBoard;
import com.example.restea.teatime.entity.TeatimeParticipant;
import com.example.restea.teatime.repository.TeatimeBoardRepository;
import com.example.restea.teatime.repository.TeatimeParticipantRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import io.livekit.server.AccessToken;
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
        .user(testUser)
        .build();

    ReflectionTestUtils.setField(testTeatimeBoard, "id", 1);
    ReflectionTestUtils.setField(testTeatimeBoard, "activated", true);

    testTeatimeBoard2 = com.example.restea.teatime.entity.TeatimeBoard.builder()
        .title("testTeatimeBoard2")
        .content("내용")
        .broadcastDate(LocalDateTime.now())
        .maxParticipants(5)
        .endDate(LocalDateTime.now())
        .user(testUser)
        .build();

    ReflectionTestUtils.setField(testTeatimeBoard2, "id", 2);
    ReflectionTestUtils.setField(testTeatimeBoard2, "activated", false);


    testTeatimeParticipant = com.example.restea.teatime.entity.TeatimeParticipant.builder()
        .name("test")
        .phone("010xxxxxxxx")
        .address("address")
        .teatimeBoard(testTeatimeBoard)
        .user(testUser2)
        .build();

    ReflectionTestUtils.setField(liveService, "LIVEKIT_API_KEY", "aaa");
    ReflectionTestUtils.setField(liveService, "LIVEKIT_API_SECRET", "bbb");
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
  @DisplayName("방송 생성 테스트 - 성공")
  void createLiveSuccess() {

    // Given
    Mockito.when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.of(testTeatimeBoard));
    when(liveRepository.save(any(Live.class))).thenAnswer(invocation -> invocation.getArgument(0));

    // When
    AccessToken token = liveService.createLive(testTeatimeBoard.getId(), testUser);

    // Then
    assertNotNull(token);
    assertEquals(testUser.getId().toString(), token.getName());
    assertEquals(testUser.getNickname(), token.getIdentity());
    verify(liveRepository, times(1)).save(any(Live.class));
  }

  @Test
  @DisplayName("방송 생성 테스트 - 실패 : 티타임 게시글이 없는 경우")
  void  createLiveFailTeatimeBoardNotFound() {

    // Given
    when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.empty());

    // When & Then
    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
        liveService.createLive(10, testUser));

    assertEquals("404 NOT_FOUND \"TeatimeBoard not found\"", exception.getMessage());
  }

  @Test
  @DisplayName("방송 생성 테스트 - 실패 : 티타임 게시글이 삭제된 경우")
  void  createLiveFailTeatimeBoardNotActivated() {

    // Given
    Mockito.when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.of(testTeatimeBoard2));

    // When & Then
    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
        liveService.createLive(10, testUser));

    assertEquals("404 NOT_FOUND \"TeatimeBoard not activated\"", exception.getMessage());
  }

  @Test
  @DisplayName("방송 생성 여부 조회 테스트 - 실패 : 티타임 게시글이 작성자가 아닌 경우")
  void createLiveFailNotTeatimeBoardWriter() {

    // Given
    when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.of(testTeatimeBoard));

    // When $ Then
    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
        liveService.createLive(1, testUser2));

    assertEquals("403 FORBIDDEN \"Not a writer\"", exception.getMessage());
  }

  @Test
  @DisplayName("방송 생성 여부 조회 테스트 - 실패 : 방송 예정일보다 전인 경우")
  void createLiveFailBeforeBroadcastDate() {

    // Given
    ReflectionTestUtils.setField(testTeatimeBoard, "broadcastDate", LocalDateTime.now().plusMinutes(5));
    when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.of(testTeatimeBoard));

    // When & Then
    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
        liveService.createLive(1, testUser));

    assertEquals("403 FORBIDDEN \"Before the broadcast date\"", exception.getMessage());
  }

  @Test
  @DisplayName("방송 생성 여부 조회 테스트 - 실패 : 방송 예정일과 다른 날인 경우")
  void createLiveFailDifferentBroadcastDate() {

    // Given
    ReflectionTestUtils.setField(testTeatimeBoard, "broadcastDate", LocalDateTime.now().plusDays(5));
    when(teatimeBoardRepository.findById(anyInt())).thenReturn(Optional.of(testTeatimeBoard));

    // When & Then
    ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
        liveService.createLive(1, testUser));

    assertEquals("403 FORBIDDEN \"Different from the broadcast date\"", exception.getMessage());
  }

  @Test
  void createToken() {
  }

  @Test
  void webHook() {
  }
}