import { useRef } from 'react';
import useScript from '../../../hooks/useScript';

export default function GoogleLogin({
  onGoogleSignIn = () => {}, 
}) {
  const googleSignInButton = useRef(null);

  useScript('https://accounts.google.com/gsi/client', () => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: onGoogleSignIn, 
    });

    window.google.accounts.id.renderButton(
      googleSignInButton.current, 
      {
        theme: 'filled_blue', 
        size: 'large', 
        width: '300',
      }
    );
  });

  return (
    <>
      <div ref={googleSignInButton}></div>
    </>
  );
}
