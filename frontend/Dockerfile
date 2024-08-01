# 5173 port를 사용하는 React를 정적으로 빌드하다음 Nginx를 이용해 배포한다.

# nginx 이미지를 사용합니다. 뒤에 tag가 없으면 latest 를 사용합니다.
FROM nginx:1.26.1

# root 에 app 폴더를 생성
RUN mkdir /app

# work dir 고정
WORKDIR /app

# work dir 에 build 폴더 생성 /app/build
RUN mkdir /build

# host pc의 현재경로의 dist 폴더를 workdir 의 build 폴더로 복사
ADD ./dist ./build

# profile에 대한 정보 전달
ARG PROFILE

# nginx 의 default.conf 를 삭제
#RUN rm /etc/nginx/conf.d/default.conf

# host pc 의 nginx 설정 파일을 아래 경로에 복사
#COPY nginx-$PROFILE.conf /etc/nginx/conf.d
#COPY nginx-dev.conf /etc/nginx/conf.d
#COPY nginx-prod.conf /etc/nginx/conf.d
#COPY nginx-prod.conf /etc/nginx/conf.d

# PROFILE이 dev일 경우 ./certs 폴더 아래 https 인증서 생성
#RUN if [ "$PROFILE" = "dev" ]; then \
#    mkdir /etc/nginx/certs; \
#    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/certs/localhost.key -out /etc/nginx/certs/localhost.crt -subj "/C=KR/ST=Seoul/L=Seoul/O=42Seoul/OU=42Seoul/CN=localhost"; \
#    fi

# PROFILE이 prod일 경우 ./certs 폴더 아래 https 인증서 생성. 단, letsencrypt 인증서를 사용한다.
#RUN if [ "$PROFILE" = "prod" ]; then \
    # letsencrypt 인증서를 사용하기 위한 certbot 설치
#    apt-get update; \
#    apt-get install -y certbot; \
    # letsencrypt 인증서 발급
#    certbot --nginx -d moducha.site -d www.moducha.site; \
#    fi

# 80 포트 오픈
EXPOSE 80
# 443 포트 오픈
EXPOSE 443

# container 실행 시 자동으로 실행할 command. nginx 시작함
CMD ["nginx", "-g", "daemon off;"]
