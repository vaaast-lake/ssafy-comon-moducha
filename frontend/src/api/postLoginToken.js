export const postLoginToken = async idToken => {
  const API_URL = import.meta.env.VITE_API_URL; // 환경 변수에서 API URL을 가져옴
  const path = '/v1/oauth/login'; // 로그인 경로 설정

  try {
    const response = await fetch(`${API_URL}${path}`, { // fetch API를 사용하여 서버에 POST 요청
      method: 'POST',
      credentials: 'include', // 쿠키를 포함하여 요청을 전송
      headers: {
        Accept: 'application/json', // 서버가 JSON 응답을 반환할 것으로 기대
        'Content-Type': 'application/json', // 요청 본문이 JSON 형식임을 지정
      },
      body: JSON.stringify(idToken), // idToken을 JSON 문자열로 변환하여 요청 본문에 포함
    });
    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errorDetail}`);
    }

    return true; 
  } catch (e) {
    console.error('postLoginToken Error: ', e.message);
    return false; 
  }
};
