import { useRef } from 'react';
import useScript from '../../../hooks/useScript';

export default function GoogleLogout({
  onGoogleSignOut = () => {}, 
}) {
  const googleSignOutButton = useRef(null);

  useScript('https://accounts.google.com/gsi/client', () => {
    
    const handleLogout = () => {
      window.google.accounts.id.disableAutoSelect();
      onGoogleSignOut();
    };

    if (googleSignOutButton.current) { // 로그아웃 버튼을 렌더링
      googleSignOutButton.current.innerHTML = '';
      const button = document.createElement('button');
      button.innerText = 'Logout / 보이면 예외처리 필요';
      button.onclick = handleLogout;
      
      // 임시버튼이라 CSS 그냥 여기 만들었어요.
      button.style.backgroundColor = '#007bff';
      button.style.color = '#ffffff';
      button.style.width = '300px';
      button.style.height = '40px';
      button.style.border = 'none';
      button.style.borderRadius = '5px'; 
      button.style.cursor = 'pointer';
      button.style.fontSize = '16px';
      
      googleSignOutButton.current.appendChild(button);
    }
    
  });

  return (
    <>
      <div ref={googleSignOutButton}></div>
    </>
  );
}
