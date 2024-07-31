package com.example.restea.config;

import com.example.restea.oauth2.handler.CustomSuccessHandler;
import com.example.restea.oauth2.jwt.CustomLogoutFilter;
import com.example.restea.oauth2.jwt.JWTFilter;
import com.example.restea.oauth2.jwt.JWTUtil;
import com.example.restea.oauth2.repository.RefreshTokenRepository;
import com.example.restea.oauth2.service.CustomOAuth2UserService;
import com.example.restea.user.repository.UserRepository;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JWTUtil jwtUtil;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // CORS 설정
        http
                .cors(corsCustomizer -> corsCustomizer.configurationSource(request -> {

                    CorsConfiguration configuration = new CorsConfiguration();

                    configuration.setAllowedOrigins(
                            Collections.singletonList("http://localhost:5173"));
                    configuration.setAllowedMethods(Collections.singletonList("*"));
                    configuration.setAllowCredentials(true);
                    configuration.setAllowedHeaders(Collections.singletonList("*"));
                    configuration.setMaxAge(3600L);

                    configuration.setExposedHeaders(Collections.singletonList("Set-Cookie"));
                    configuration.setExposedHeaders(Collections.singletonList("Authorization"));

                    return configuration;
                }));

        //csrf disable
        /*
          session 방식은 session이 고정적이기 때문에 csrf 공격을 방어해주어야 한다.
          JWT는 session을 Stateless 상태로 관리하기 때문에 disable로 둔다.
         */
        http
                .csrf(AbstractHttpConfigurer::disable);

        /*
          JWT를 쓰므로 formLogin, httpBasic 인증 방식 또한 disable 해준다.
         */
        //From 로그인 방식 disable
        http
                .formLogin(AbstractHttpConfigurer::disable);
        //http basic 인증 방식 disable
        http
                .httpBasic(AbstractHttpConfigurer::disable);

        //JWTFilter 추가
        http
                .addFilterBefore(new JWTFilter(jwtUtil), OAuth2LoginAuthenticationFilter.class);

        http
                .oauth2Login((oauth2) -> oauth2
                        .userInfoEndpoint((userInfoEndpointConfig -> userInfoEndpointConfig
                                .userService(customOAuth2UserService)))
                        .successHandler(customSuccessHandler)
                        .redirectionEndpoint(redirectionEndpointConfig ->
                                redirectionEndpointConfig.baseUri("/api/v1/login/oauth2/code/*")));

        /*
          SpringSecurity의 LogoutFilter가 작동하기 전에 RefreshToken을 제거하는 필터를 추가하는 것
         */
        http
                .addFilterBefore(new CustomLogoutFilter(jwtUtil, refreshTokenRepository, userRepository),
                        LogoutFilter.class);

        // 로그아웃 설정
        http
                .logout((oauth2) -> oauth2
                        .logoutUrl("/api/v1/logout")
                        .logoutSuccessUrl("/")
                        .permitAll());

        //경로별 인가 작업
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/", "/login/**", "/api/v1/reissue"
                                , "/api/v1/login/oauth2/code/google")
                        .permitAll()
                        .anyRequest().authenticated());

        //세션 설정 : STATELESS
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}