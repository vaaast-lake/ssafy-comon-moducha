#################
#
# init.sh
# 프로젝트를 실행하기 위한 초기화 스크립트
# 2024.07.31 created by uigeun-kim
#
#################

set -e  # 실패하면 바로 멈추도록 설정

# 이전에 사용한 frontend, backend image를 삭제하는 스크립트
docker-compose down  # docker-compose down
frontend_images=$(docker images -q frontend)  # frontend 이미지 id
if  [ -n "$frontend_images" ]; then
  docker rmi -f $frontend_images  # frontend 이미지 제거
fi
backend_images=$(docker images -q backend)  # backend 이미지 id
if  [ -n "$backend_images" ]; then
  docker rmi -f $backend_images  # backend 이미지 제거
fi

# frontend build
cd ./frontend
npm install || { echo "npm install failed"; exit 1; }
npm run build || { echo "npm run build failed"; exit 1; }
cd ..

# backend build
cd ./backend
./gradlew clean build -x test || { echo "./gradlew clean build -x test failed"; exit 1; }
cd ..

# docker compose up
# 프로젝트 최상단 디렉터리에 .env 파일을 설정하세요.
read -p "Enter profile(dev or prod): " PROFILE
export PROFILE
docker-compose up -d || { echo "docker-compose up failed"; exit 1; }

echo "success"  # 모든 단계가 성공적으로 완료되면 출력
# chrome 실행
cd /mnt/c/Program\ Files/Google/Chrome/Application
if [ $PROFILE = dev ]
then
  ./chrome.exe http://localhost
elif [ $PROFILE = prod ]
then
  ./chrome.exe http://moducha.site
else
  echo "PROFILE is not dev or prod"
  exit 1
fi
