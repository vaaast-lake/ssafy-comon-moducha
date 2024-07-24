// 타입스크립트에서 import.meta.env를 제대로 쓰기 위해서는 다음과 같이 ImportMetaEnv와 ImportMeta 인터페이스를 정의해주어야 합니다.
// https://khj0426.tistory.com/238
/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_CUSTOM_ENV_VARIABLE: string;
    readonly VITE_GOOGLE_CLIENT_ID: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }