/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  // 👇 Si usas variables personalizadas en tu .env
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
