interface AppConfig {
  API_BASE_URL: string;
}

// Gán biến từ đối tượng window._env_ do entrypoint script tạo ra.
// Nếu không có, dùng biến VITE_API_BASE_URL từ .env (dành cho lúc dev local).
const config: AppConfig = {
  API_BASE_URL: (window as any)._env_?.API_BASE_URL || import.meta.env.VITE_API_BASE_URL,
};

export default config;
