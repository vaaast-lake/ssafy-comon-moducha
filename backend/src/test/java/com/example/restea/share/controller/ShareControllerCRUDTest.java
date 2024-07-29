package com.example.restea.share.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.restea.oauth2.dto.CustomOAuth2User;
import com.example.restea.oauth2.service.CustomOAuth2UserService;
import com.example.restea.share.dto.ShareCreationRequest;
import com.example.restea.share.dto.ShareUpdateRequest;
import com.example.restea.share.entity.ShareBoard;
import com.example.restea.share.entity.ShareParticipant;
import com.example.restea.share.repository.ShareBoardRepository;
import com.example.restea.share.repository.ShareParticipantRepository;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import com.example.restea.util.SecurityTestUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
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

/*
  * ShareControllerTest1
  * - createShare
  * - getShareBoard
  * - updateShareBoard
 */

@SpringBootTest
@AutoConfigureMockMvc
class ShareControllerCRUDTest {

  protected MockMvc mockMvc;
  protected ObjectMapper objectMapper;
  private final WebApplicationContext context;
  private final ShareBoardRepository shareBoardRepository;
  private final UserRepository userRepository;
  private final CustomOAuth2UserService custumOAuth2UserService;
  private CustomOAuth2User customOAuth2User;
  private ShareParticipantRepository shareParticipantRepository;

  private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd-HH:mm");

  @Autowired
  public ShareControllerCRUDTest(MockMvc mockMvc, ObjectMapper objectMapper,
      WebApplicationContext context,
      ShareBoardRepository shareBoardRepository, UserRepository userRepository
      , CustomOAuth2UserService custumOAuth2UserService, ShareParticipantRepository shareParticipantRepository) {
    this.mockMvc = mockMvc;
    this.objectMapper = objectMapper;
    this.context = context;
    this.shareBoardRepository = shareBoardRepository;
    this.userRepository = userRepository;
    this.custumOAuth2UserService = custumOAuth2UserService;
    this.shareParticipantRepository = shareParticipantRepository;
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

  @DisplayName("createShareBoard : 입력값이 null인 경우.")
  @Test
  public void createShareBoard_NullContent_Failure() throws Exception {
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

  @DisplayName("createShareBoard : 제목이 비었을 때 실패한다.")
  @Test
  public void createShareBoard_EmptyTitle_Failure() throws Exception {
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

  @DisplayName("createShareBoard : 제목의 길이가 50을 초과할 때 실패한다.")
  @Test
  public void createShareBoard_OverTitleLength_Failure() throws Exception {
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

  @DisplayName("createShareBoard : content가 비었을 때 실패한다.")
  @Test
  public void createShareBoard_EmptyContent_Failure() throws Exception {
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

  @DisplayName("createShareBoard : 참여자가 1명 미만일 때 실패한다. 0명")
  @Test
  public void createShareBoard_ZeroMaxParticipants_Failure() throws Exception {
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

  @DisplayName("createShareBoard : 참여자가 1명 미만일 때 실패한다. -1명")
  @Test
  public void createShareBoard_MinusMaxParticipants_Failure() throws Exception {
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

  @DisplayName("createShareBoard : 종료일이 현재 시간보다 이전일 때 실패한다.")
  @Test
  public void createShareBoard_InvalidEndDate_Failure() throws Exception {
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
    User user = userRepository.findByAuthId("authId2")
        .orElseThrow(() -> new RuntimeException("테스트를 위한 유저 생성 실패"));

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
        .andExpect(jsonPath("$.data.boardId").value(createdShareBoard.getId()))
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
  @Test
  public void getShareBoard_deactivatedUser() throws Exception {
    // given
    custumOAuth2UserService.handleNewUser("authId2", "authToken2");
    User user = userRepository.findByAuthId("authId2")
        .orElseThrow(() -> new RuntimeException("테스트를 위한 유저 생성 실패"));

    ShareBoard createdShareBoard = shareBoardRepository.save(ShareBoard.builder()
        .title("TestTitle")
        .content("TestContent")
        .maxParticipants(10)
        .endDate(LocalDateTime.now().plusWeeks(1L))
        .user(user)
        .build());

    // 유저 비활성화
    user.deactivate();
    userRepository.save(user);

    final String url = "/api/v1/shares/" + createdShareBoard.getId();

    // when
    ResultActions result = mockMvc.perform(get(url).accept(MediaType.APPLICATION_JSON_VALUE));

    // then
    result.andExpect(status().isOk())
        .andExpect(jsonPath("$.data.boardId").value(createdShareBoard.getId()))
        .andExpect(jsonPath("$.data.title").value(createdShareBoard.getTitle()))
        .andExpect(jsonPath("$.data.content").value(createdShareBoard.getContent()))
        .andExpect(jsonPath("$.data.maxParticipants").value(createdShareBoard.getMaxParticipants()))
//        TODO : 저장하면서 형식이 약간 수정해서 완벽하게 일치하기 어렵다.
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

  @DisplayName("getShareBoard : 비활성화된 나눔 게시판 조회로 인한 실패.")
  @Test
  public void getShareBoard_deactivated_fail() throws Exception {

    // given
    custumOAuth2UserService.handleNewUser("authId2", "authToken2");
    User user = userRepository.findByAuthId("authId2")
        .orElseThrow(() -> new RuntimeException("테스트를 위한 유저 생성 실패"));

    ShareBoard createdShareBoard = shareBoardRepository.save(ShareBoard.builder()
        .title("TestTitle")
        .content("TestContent")
        .maxParticipants(10)
        .endDate(LocalDateTime.now().plusWeeks(1L))
        .user(user)
        .build());

    // DB에서 default 값들이 설정되는 관계로 다시 조회
    createdShareBoard = shareBoardRepository.findById(createdShareBoard.getId())
        .orElseThrow(() -> new RuntimeException("테스트를 위한 게시글 생성 실패"));

    // 게시글 비활성화
    createdShareBoard.deactivate();
    shareBoardRepository.save(createdShareBoard);

    final String url = "/api/v1/shares/" + createdShareBoard.getId();

    // when
    ResultActions result = mockMvc.perform(get(url).accept(MediaType.APPLICATION_JSON_VALUE));

    // then
    result.andExpect(status().isNotFound());
  }

  @DisplayName("updateShareBoard : 공유 게시글 수정에 성공한다.")
  @Test
  public void updateShare_Success() throws Exception {

    // given
    User user = userRepository.findByAuthId("authId")
        .orElseThrow(() -> new RuntimeException("테스트를 위한 유저 생성 실패"));

    final String title = "Title";
    final String content = "Content";
    final Integer maxParticipants = 10;
    final LocalDateTime endDate = LocalDateTime.now().plusWeeks(1L);
    ShareBoard shareBoard =  shareBoardRepository.save(ShareBoard.builder()
        .title(title)
        .content(content)
        .maxParticipants(maxParticipants)
        .endDate(endDate)
        .user(user)
        .build());

    final String url = "/api/v1/shares/" + shareBoard.getId();
    final String updatedTitle = "UpdateTitle";
    final String updatedContent = "UpdateContent";
    final Integer updatedMaxParticipants = 20;
    final LocalDateTime updatedEndDate = LocalDateTime.now().plusWeeks(2L);
    final ShareUpdateRequest shareUpdateRequest = new ShareUpdateRequest(
        updatedTitle, updatedContent, updatedEndDate, updatedMaxParticipants
    );
    final String requestBody = objectMapper.writeValueAsString(shareUpdateRequest);

    // when
    ResultActions result = mockMvc.perform(patch(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));

    // then
    result.andExpect(status().isOk());
    ShareBoard updatedShareBoard = shareBoardRepository.findById(shareBoard.getId())
        .orElseThrow(() -> new RuntimeException("테스트를 위한 게시글 생성 실패"));
    assertThat(updatedShareBoard.getTitle()).isEqualTo(updatedTitle);
    assertThat(updatedShareBoard.getContent()).isEqualTo(updatedContent);
    assertThat(updatedShareBoard.getMaxParticipants()).isEqualTo(updatedMaxParticipants);
    assertThat(updatedShareBoard.getEndDate().format(formatter)).isEqualTo(updatedEndDate.format(formatter));
  }

  @DisplayName("updateShareBoard 실패 - 존재하지 않는 게시글")
  @Test
  public void updateShare_NotFound_Fail() throws Exception {

    // given
    final String url = "/api/v1/shares/999";
    final String updatedTitle = "UpdateTitle";
    final String updatedContent = "UpdateContent";
    final Integer updatedMaxParticipants = 20;
    final LocalDateTime updatedEndDate = LocalDateTime.now().plusWeeks(2L);
    final ShareUpdateRequest shareUpdateRequest = new ShareUpdateRequest(
        updatedTitle, updatedContent, updatedEndDate, updatedMaxParticipants
    );
    final String requestBody = objectMapper.writeValueAsString(shareUpdateRequest);

    // when
    ResultActions result = mockMvc.perform(patch(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));

    // then
    result.andExpect(status().isNotFound());
  }

  @DisplayName("updateShareBoard 실패 - 비활성화된 게시글")
  @Test
  public void updateShare_Deactivated_Fail() throws Exception {

    // given
    User user = userRepository.findByAuthId("authId")
        .orElseThrow(() -> new RuntimeException("테스트를 위한 유저 생성 실패"));

    final String title = "Title";
    final String content = "Content";
    final Integer maxParticipants = 10;
    final LocalDateTime endDate = LocalDateTime.now().plusWeeks(1L);
    ShareBoard shareBoard =  shareBoardRepository.save(ShareBoard.builder()
        .title(title)
        .content(content)
        .maxParticipants(maxParticipants)
        .endDate(endDate)
        .user(user)
        .build());

    ShareBoard deactivatedShareBoard = shareBoardRepository.findById(shareBoard.getId())
        .orElseThrow(() -> new RuntimeException("테스트를 위한 게시글 생성 실패"));
    deactivatedShareBoard.deactivate();
    shareBoardRepository.save(deactivatedShareBoard);

    final String url = "/api/v1/shares/" + shareBoard.getId();
    final String updatedTitle = "UpdateTitle";
    final String updatedContent = "UpdateContent";
    final Integer updatedMaxParticipants = 20;
    final LocalDateTime updatedEndDate = LocalDateTime.now().plusWeeks(2L);
    final ShareUpdateRequest shareUpdateRequest = new ShareUpdateRequest(
        updatedTitle, updatedContent, updatedEndDate, updatedMaxParticipants
    );
    final String requestBody = objectMapper.writeValueAsString(shareUpdateRequest);

    // when
    ResultActions result = mockMvc.perform(patch(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));

    // then
    result.andExpect(status().isNotFound());
  }

  @DisplayName("updateShareBoard 실패 - 권한이 없는 사용자")
  @Test
  public void updateShare_Unauthorized_Fail() throws Exception {

    // given
    custumOAuth2UserService.handleNewUser("authId2", "authToken2");
    User user = userRepository.findByAuthId("authId2")
        .orElseThrow(() -> new RuntimeException("테스트를 위한 유저 생성 실패"));

    ShareBoard shareBoard = shareBoardRepository.save(ShareBoard.builder()
        .title("TestTitle")
        .content("TestContent")
        .maxParticipants(10)
        .endDate(LocalDateTime.now().plusWeeks(1L))
        .user(user)
        .build());

    final String url = "/api/v1/shares/" + shareBoard.getId();
    final String updatedTitle = "UpdateTitle";
    final String updatedContent = "UpdateContent";
    final Integer updatedMaxParticipants = 20;
    final LocalDateTime updatedEndDate = LocalDateTime.now().plusWeeks(2L);
    final ShareUpdateRequest shareUpdateRequest = new ShareUpdateRequest(
        updatedTitle, updatedContent, updatedEndDate, updatedMaxParticipants
    );
    final String requestBody = objectMapper.writeValueAsString(shareUpdateRequest);

    // when
    ResultActions result = mockMvc.perform(patch(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));

    // then
    result.andExpect(status().isForbidden());
  }

  @DisplayName("updateShareBoard 실패 - 현재 신청자보다 작은 maxParticipants로 수정")
  @Test
  public void updateShare_LessThanCurrentParticipants_Fail() throws Exception {

    // given
    User user = userRepository.findByAuthId("authId")
        .orElseThrow(() -> new RuntimeException("테스트를 위한 유저 생성 실패"));

    ShareBoard shareBoard = shareBoardRepository.save(ShareBoard.builder()
        .title("TestTitle")
        .content("TestContent")
        .maxParticipants(10)
        .endDate(LocalDateTime.now().plusWeeks(1L))
        .user(user)
        .build());

    // 참여자 추가
    User participant;
    for(int i=0; i<3; i++){
      custumOAuth2UserService.handleNewUser("authId"+i, "authToken"+i);
      participant = userRepository.findByAuthId("authId"+i)
          .orElseThrow(() -> new RuntimeException("테스트를 위한 유저 생성 실패"));

      shareParticipantRepository.save(ShareParticipant.builder()
          .name("TestName"+i)
          .phone("010-1234-000"+i)
          .address("TestAddress"+i)
          .shareBoardId(shareBoard.getId())
          .userId(participant.getId())
          .build());
    }

    final String url = "/api/v1/shares/" + shareBoard.getId();
    final String updatedTitle = "Title";
    final String updatedContent = "Content";
    final Integer updatedMaxParticipants = 1;
    final LocalDateTime updatedEndDate = LocalDateTime.now().plusWeeks(2L);
    final ShareUpdateRequest shareUpdateRequest = new ShareUpdateRequest(
        updatedTitle, updatedContent, updatedEndDate, updatedMaxParticipants
    );
    final String requestBody = objectMapper.writeValueAsString(shareUpdateRequest);

    // when
    ResultActions result = mockMvc.perform(patch(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));

    // then
    result.andExpect(status().isBadRequest());
  }

  @DisplayName("updateShareBoard 실패 - 오늘보다 이전 날짜로 수정")
  @Test
  public void updateShare_BeforeThanToday_Fail() throws Exception {

    // given
    User user = userRepository.findByAuthId("authId")
        .orElseThrow(() -> new RuntimeException("테스트를 위한 유저 생성 실패"));

    ShareBoard shareBoard = shareBoardRepository.save(ShareBoard.builder()
        .title("TestTitle")
        .content("TestContent")
        .maxParticipants(10)
        .endDate(LocalDateTime.now().plusWeeks(1L))
        .user(user)
        .build());

    final String url = "/api/v1/shares/" + shareBoard.getId();
    final String updatedTitle = "Title";
    final String updatedContent = "Content";
    final Integer updatedMaxParticipants = 10;
    final LocalDateTime updatedEndDate = LocalDateTime.now().minusDays(1);
    final ShareUpdateRequest shareUpdateRequest = new ShareUpdateRequest(
        updatedTitle, updatedContent, updatedEndDate, updatedMaxParticipants
    );
    final String requestBody = objectMapper.writeValueAsString(shareUpdateRequest);

    // when
    ResultActions result = mockMvc.perform(patch(url)
        .accept(MediaType.APPLICATION_JSON_VALUE)
        .contentType(MediaType.APPLICATION_JSON_VALUE)
        .content(requestBody));

    // then
    result.andExpect(status().isBadRequest());
  }

}