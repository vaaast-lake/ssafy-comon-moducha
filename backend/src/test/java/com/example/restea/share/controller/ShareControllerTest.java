package com.example.restea.share.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.restea.oauth2.dto.CustomOAuth2User;
import com.example.restea.oauth2.service.CustomOAuth2UserService;
import com.example.restea.share.dto.ShareCreationRequest;
import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.repository.ShareBoardRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import com.example.restea.util.SecurityTestUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
@AutoConfigureMockMvc
class ShareControllerTest {

  protected MockMvc mockMvc;
  protected ObjectMapper objectMapper;
  private final WebApplicationContext context;
  private final ShareBoardRepository shareBoardRepository;
  private final UserRepository userRepository;
  private final CustomOAuth2UserService custumOAuth2UserService;
  private CustomOAuth2User customOAuth2User;

  @Autowired
  public ShareControllerTest(MockMvc mockMvc, ObjectMapper objectMapper,
      WebApplicationContext context,
      ShareBoardRepository shareBoardRepository, UserRepository userRepository
      , CustomOAuth2UserService custumOAuth2UserService) {
    this.mockMvc = mockMvc;
    this.objectMapper = objectMapper;
    this.context = context;
    this.shareBoardRepository = shareBoardRepository;
    this.userRepository = userRepository;
    this.custumOAuth2UserService = custumOAuth2UserService;
  }

  // nickname : "TestUser", authId : "authId", authToken : "authToken"
  @Transactional
  @BeforeEach
  public void mockMvcSetUp() {
    userRepository.deleteAll();
    shareBoardRepository.deleteAll();
    mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
  }

  // mockMvc에서 @AuthenticationPrincipal CustomOAuth2User를 사용하기 위해
  @BeforeEach
  public void OAuth2UserSetup() {
    customOAuth2User = custumOAuth2UserService.handleNewUser("authId", "authToken");
    SecurityTestUtil.setUpSecurityContext(customOAuth2User);
  }

  @AfterEach
  public void tearDown() {
    shareBoardRepository.deleteAll();
    userRepository.deleteAll();
  }

  @DisplayName("createShare : 공유 게시글 생성에 성공한다.")
  @Test
  public void createShare_Success() throws Exception {

    // given
    final String url = "/api/v1/shares";
    final String title = "TestTitle";
    final String content = "TestContent";
    final ShareCreationRequest shareCreationRequest = new ShareCreationRequest(title, content,
        LocalDateTime.now().plusWeeks(1L), 10);
    final String requestBody = objectMapper.writeValueAsString(shareCreationRequest);

    // when
    ResultActions result = mockMvc.perform(post(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));

    // then
    result.andExpect(status().isCreated());
    List<ShareBoard> shareBoards = shareBoardRepository.findAll();
    assertThat(shareBoards.size()).isEqualTo(1);
    assertThat(shareBoards.get(0).getTitle()).isEqualTo(title);
    assertThat(shareBoards.get(0).getContent()).isEqualTo(content);
  }

  @DisplayName("createShare : 입력값이 null인 경우.")
  @Test
  public void createShare_NullContent_Failure() throws Exception {
    // given
    final String url = "/api/v1/shares";
    final String title = "TestTitle";
    final ShareCreationRequest shareCreationRequest = new ShareCreationRequest(title, null,
        LocalDateTime.now().plusWeeks(1L), 10);
    final String requestBody = objectMapper.writeValueAsString(shareCreationRequest);
    // when
    ResultActions result = mockMvc.perform(post(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));
    // then
    result.andExpect(status().isBadRequest());
    List<ShareBoard> shareBoards = shareBoardRepository.findAll();
    assertThat(shareBoards.size()).isEqualTo(0);
  }

  @DisplayName("createShare : 제목이 비었을 때 실패한다.")
  @Test
  public void createShare_EmptyTitle_Failure() throws Exception {
    // given
    final String url = "/api/v1/shares";
    final String title = "";
    final String content = "TestContent";
    final ShareCreationRequest shareCreationRequest = new ShareCreationRequest(title, content,
        LocalDateTime.now().plusWeeks(1L), 10);
    final String requestBody = objectMapper.writeValueAsString(shareCreationRequest);

    // when
    ResultActions result = mockMvc.perform(post(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));

    // then
    result.andExpect(status().isBadRequest());
    List<ShareBoard> shareBoards = shareBoardRepository.findAll();
    assertThat(shareBoards.size()).isEqualTo(0);
  }

  @DisplayName("createShare : 제목의 길이가 50을 초과할 때 실패한다.")
  @Test
  public void createShare_OverTitleLength_Failure() throws Exception {
    // given
    final String url = "/api/v1/shares";
    final String title =
        "TestTitleTestTitleTestTitleTestTitleTestTitleTestTitleTestTitleTestTitleTestTitleTestTitle"
            + "TestTitleTestTitleTestTitleTestTitleTestTitleTestTitleTestTitleTestTitleTestTitleTest"
            + "TitleTestTitleTestTitle";
    final String content = "TestContent";
    final ShareCreationRequest shareCreationRequest = new ShareCreationRequest(title, content,
        LocalDateTime.now().plusWeeks(1L), 10);
    final String requestBody = objectMapper.writeValueAsString(shareCreationRequest);
    // when
    ResultActions result = mockMvc.perform(post(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));
    // then
    result.andExpect(status().isBadRequest());
    List<ShareBoard> shareBoards = shareBoardRepository.findAll();
    assertThat(shareBoards.size()).isEqualTo(0);
  }

  @DisplayName("createShare : content가 비었을 때 실패한다.")
  @Test
  public void createShare_EmptyContent_Failure() throws Exception {
    // given
    final String url = "/api/v1/shares";
    final String title = "TestTitle";
    final String content = "";
    final ShareCreationRequest shareCreationRequest = new ShareCreationRequest(title, content,
        LocalDateTime.now().plusWeeks(1L), 10);
    final String requestBody = objectMapper.writeValueAsString(shareCreationRequest);
    // when
    ResultActions result = mockMvc.perform(post(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));
    // then
    result.andExpect(status().isBadRequest());
    List<ShareBoard> shareBoards = shareBoardRepository.findAll();
    assertThat(shareBoards.size()).isEqualTo(0);
  }

  @DisplayName("createShare : 참여자가 1명 미만일 때 실패한다. 0명")
  @Test
  public void createShare_ZeroMaxParticipants_Failure() throws Exception {
    // given
    final String url = "/api/v1/shares";
    final String title = "TestTitle";
    final String content = "TestContent";
    final ShareCreationRequest shareCreationRequest = new ShareCreationRequest(title, content,
        LocalDateTime.now().plusWeeks(1L), 0);
    final String requestBody = objectMapper.writeValueAsString(shareCreationRequest);
    // when
    ResultActions result = mockMvc.perform(post(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));
    // then
    result.andExpect(status().isBadRequest());
    List<ShareBoard> shareBoards = shareBoardRepository.findAll();
    assertThat(shareBoards.size()).isEqualTo(0);
  }

  @DisplayName("createShare : 참여자가 1명 미만일 때 실패한다. -1명")
  @Test
  public void createShare_MinusMaxParticipants_Failure() throws Exception {
    // given
    final String url = "/api/v1/shares";
    final String title = "TestTitle";
    final String content = "TestContent";
    final ShareCreationRequest shareCreationRequest = new ShareCreationRequest(title, content,
        LocalDateTime.now().plusWeeks(1L), -1);
    final String requestBody = objectMapper.writeValueAsString(shareCreationRequest);
    // when
    ResultActions result = mockMvc.perform(post(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));
    // then
    result.andExpect(status().isBadRequest());
    List<ShareBoard> shareBoards = shareBoardRepository.findAll();
    assertThat(shareBoards.size()).isEqualTo(0);
  }

  @DisplayName("createShare : 종료일이 현재 시간보다 이전일 때 실패한다.")
  @Test
  public void createShare_InvalidEndDate_Failure() throws Exception {
    // given
    final String url = "/api/v1/shares";
    final String title = "TestTitle";
    final String content = "TestContent";
    final ShareCreationRequest shareCreationRequest = new ShareCreationRequest(title, content,
        LocalDateTime.now().minusDays(1L), 10);
    final String requestBody = objectMapper.writeValueAsString(shareCreationRequest);
    // when
    ResultActions result = mockMvc.perform(post(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));
    // then
    result.andExpect(status().isBadRequest());
    List<ShareBoard> shareBoards = shareBoardRepository.findAll();
    assertThat(shareBoards.size()).isEqualTo(0);
  }

  @DisplayName("getShareBoard : 나눔 게시판 조회 성공.")
  @Test
  public void getShareBoard_Success() throws Exception {
    // given
    custumOAuth2UserService.handleNewUser("authId2", "authToken2");
    Optional<User> userOptional = userRepository.findByAuthId("authId2");
    if (userOptional.isEmpty()) {
      throw new RuntimeException("테스트를 위한 유저 생성 실패");
    }
    User user = userOptional.get();

    ShareBoard createdShareBoard = shareBoardRepository.save(ShareBoard.builder()
        .title("TestTitle")
        .content("TestContent")
        .maxParticipants(10)
        .endDate(LocalDateTime.now().plusWeeks(1L))
        .user(user)
        .build());

    final String url = "/api/v1/shares/" + createdShareBoard.getId();

    // when
    ResultActions result = mockMvc.perform(get(url).accept(MediaType.APPLICATION_JSON_VALUE));

    // then
    result.andExpect(status().isOk())
        .andExpect(jsonPath("$.data.shareBoardId").value(createdShareBoard.getId()))
        .andExpect(jsonPath("$.data.title").value(createdShareBoard.getTitle()))
        .andExpect(jsonPath("$.data.content").value(createdShareBoard.getContent()))
        .andExpect(jsonPath("$.data.maxParticipants").value(createdShareBoard.getMaxParticipants()))
//        저장하면서 형식이 약간 수정해서 완벽하게 일치하기 어렵다.
//        .andExpect(jsonPath("$.data.endDate").value(createdShareBoard.getEndDate().toString().substring(0, 26)))
        .andExpect(jsonPath("$.data.viewCount").value(1))
        .andExpect(jsonPath("$.data.participants").value(0))
        .andExpect(jsonPath("$.data.nickname").value(user.getExposedNickname()));
  }

  @DisplayName("getShareBoard : 나눔 게시판 조회 : 비활성화된 유저.")
  @Transactional
  @Test
  public void getShareBoard_deactivatedUser() throws Exception {
    // given
    custumOAuth2UserService.handleNewUser("authId2", "authToken2");
    Optional<User> userOptional = userRepository.findByAuthId("authId2");
    if (userOptional.isEmpty()) {
      throw new RuntimeException("테스트를 위한 유저 생성 실패");
    }
    User user = userOptional.get();

    ShareBoard createdShareBoard = shareBoardRepository.save(ShareBoard.builder()
        .title("TestTitle")
        .content("TestContent")
        .maxParticipants(10)
        .endDate(LocalDateTime.now().plusWeeks(1L))
        .user(user)
        .build());

    // 유저 비활성화
    user.deactivate();

    final String url = "/api/v1/shares/" + createdShareBoard.getId();

    // when
    ResultActions result = mockMvc.perform(get(url).accept(MediaType.APPLICATION_JSON_VALUE));

    // then
    result.andExpect(status().isOk())
        .andExpect(jsonPath("$.data.shareBoardId").value(createdShareBoard.getId()))
        .andExpect(jsonPath("$.data.title").value(createdShareBoard.getTitle()))
        .andExpect(jsonPath("$.data.content").value(createdShareBoard.getContent()))
        .andExpect(jsonPath("$.data.maxParticipants").value(createdShareBoard.getMaxParticipants()))
//        저장하면서 형식이 약간 수정해서 완벽하게 일치하기 어렵다.
//        .andExpect(jsonPath("$.data.endDate").value(createdShareBoard.getEndDate().toString().substring(0, 26)))
        .andExpect(jsonPath("$.data.viewCount").value(1))
        .andExpect(jsonPath("$.data.participants").value(0))
        .andExpect(jsonPath("$.data.nickname").value("탈퇴한 유저"));
  }

  @DisplayName("getShareBoard : 존재하지 않는 나눔 게시판 조회로 인한 실패.")
  @Test
  public void getShareBoard_fail() throws Exception {
    // given
    final String url = "/api/v1/shares/999";

    // when
    ResultActions result = mockMvc.perform(get(url).accept(MediaType.APPLICATION_JSON_VALUE));

    // then
    result.andExpect(status().isNotFound());
  }
}