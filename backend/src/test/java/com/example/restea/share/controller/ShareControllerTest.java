package com.example.restea.share.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.restea.oauth2.dto.CustomOAuth2User;
import com.example.restea.oauth2.dto.OAuth2JwtMemberDTO;
import com.example.restea.oauth2.entity.AuthToken;
import com.example.restea.oauth2.repository.AuthTokenRepository;
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
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.annotation.SecurityTestExecutionListeners;
import org.springframework.security.test.context.support.WithSecurityContext;
import org.springframework.security.test.context.support.WithSecurityContextTestExecutionListener;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
@AutoConfigureMockMvc
class ShareControllerTest {

  protected MockMvc mockMvc;
  protected ObjectMapper objectMapper;
  private WebApplicationContext context;
  private ShareBoardRepository shareBoardRepository;
  private UserRepository userRepository;
  private CustomOAuth2UserService custumOAuth2UserService;
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

    // request 설정
    final String url = "/api/v1/shares";
    final String title = "TestTitle";
    final String content = "TestContent";
    final ShareCreationRequest shareCreationRequest = new ShareCreationRequest(title, content,
        LocalDateTime.now().plusWeeks(1), 10);
    final String requestBody = objectMapper.writeValueAsString(shareCreationRequest);

    // when
    ResultActions result = mockMvc.perform(post(url)
        .with(SecurityMockMvcRequestPostProcessors.oauth2Login().oauth2User(customOAuth2User))
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

//  @DisplayName("createShare : 요청 본문이 유효하지 않을 때 실패한다.")
//  @Test
//  public void createShare_InvalidRequestBody_Failure() throws Exception {
//    // given
//    // when
//    // then
//  }
//  @DisplayName("createShare : 요청 본문이 유효하지 않을 때 실패한다.")
//  @Test
//  public void createShare_InvalidRequestBody_Failure() throws Exception {
//    // given
//    // when
//    // then
//  }
//  @DisplayName("createShare : 요청 본문이 유효하지 않을 때 실패한다.")
//  @Test
//  public void createShare_InvalidRequestBody_Failure() throws Exception {
//    // given
//    // when
//    // then
//  }
//
//  @DisplayName("createShare : 인증되지 않은 사용자가 요청할 때 실패한다.")
//  @Test
//  public void createShare_UnauthenticatedUser_Failure() throws Exception {
//    // given
//    // when
//    // then
//  }

}