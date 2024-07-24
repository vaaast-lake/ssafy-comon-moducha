package com.example.restea.oauth2.service;

import com.example.restea.oauth2.dto.CustomOAuth2User;
import com.example.restea.oauth2.dto.GoogleResponse;
import com.example.restea.oauth2.dto.OAuth2JwtMemberDTO;
import com.example.restea.oauth2.dto.OAuth2Response;
import com.example.restea.oauth2.entity.AuthToken;
import com.example.restea.oauth2.repository.AuthTokenRepository;
import com.example.restea.oauth2.util.AuthIdCreator;
import com.example.restea.oauth2.util.NicknameCreator;
import com.example.restea.user.entity.User;
import com.example.restea.user.repository.UserRepository;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    //DefaultOAuth2UserService OAuth2UserService의 구현체

    private final UserRepository userRepository;
    private final AuthTokenRepository authTokenRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String authValue = userRequest.getAccessToken().getTokenValue();

        // registrationId : 프로바이더 변수
        OAuth2Response oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());

        // DB 저장 구현
        // 전달받은 데이터에서 username으로 지칭할 수 있는 것이 없기에 별도의 메소드를 구현한다.
        String authId = AuthIdCreator.getAuthId(oAuth2Response);
        Optional<User> optionalUser = userRepository.findByAuthId(authId);

        // 기존에 존재하는 유저는 handleExistingUser
        // 새로 가입한 유저는 handleNewUser
        return optionalUser.map(this::handleExistingUser)
                .orElseGet(() -> handleNewUser(authId, authValue));
    }

    private CustomOAuth2User handleNewUser(String authId, String authValue) {
        // user 저장
        User user = createNewUser(authId);
        userRepository.save(user);

        // auth token 저장
        AuthToken authToken = createAuthToken(authValue);
        authTokenRepository.save(authToken);

        // CustomOAUth2User에 파라미터로 이용될 OAuth2JwtMemberDTO 생성
        OAuth2JwtMemberDTO oAuth2JwtMemberDTO = createOAuth2JwtMemberDTO(NicknameCreator.getNickname(), user);

        return new CustomOAuth2User(oAuth2JwtMemberDTO);
    }

    private User createNewUser(String authId) {
        return User.builder()
                .nickname(NicknameCreator.getNickname())
                .authId(authId)
                .build();
    }

    private AuthToken createAuthToken(String authValue) {
        return AuthToken.builder()
                .value(authValue)
                .build();
    }

    private OAuth2JwtMemberDTO createOAuth2JwtMemberDTO(String nickname, User user) {
        return OAuth2JwtMemberDTO.builder()
                .nickname(nickname)
                .userId(user.getId())
                .role(user.getRole().name())
                .build();
    }

    private CustomOAuth2User handleExistingUser(User existUser) {
        OAuth2JwtMemberDTO oAuth2JwtMemberDTO = OAuth2JwtMemberDTO.builder()
                .nickname(existUser.getNickname())
                .userId(existUser.getId())
                .role(existUser.getRole().name())
                .build();

        return new CustomOAuth2User(oAuth2JwtMemberDTO);
    }
}