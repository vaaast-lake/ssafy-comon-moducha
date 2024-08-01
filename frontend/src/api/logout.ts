// src/api/logout.ts
export const logout = async (): Promise<void> => {
  const accessToken = localStorage.getItem('authorization');
  if (!accessToken) {
    console.log('[Dev: logout] Access Token이 없습니다.');
  }
  // const response = await fetch(
  //   `${import.meta.env.VITE_API_URL}/api/v1/logout`,
  //   {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       'Content-Type': 'application/json',
  //     },
  //   }
  // );
  // if (!response.ok) {
  //   console.log('Logout failed');
  //   throw new Error('Logout failed');
  // }
  localStorage.removeItem('authorization');
};

// 로그아웃을 처리하는 함수
export const handleLogout = async (
  setLoggedIn: (loggedIn: boolean) => void,
  setCurrentUsername: (username: string) => void,
  navigate: (path: string) => void
) => {
  try {
    await logout(); // 로그아웃 API 호출
    setLoggedIn(false); // zustand에서 로그인 상태를 false로 설정
    setCurrentUsername(''); // zustand에서 닉네임을 ''으로 설정
    navigate('/'); // 홈으로 리디렉션
  } catch (error) {
    console.error('Logout error:', error);
  }
};
