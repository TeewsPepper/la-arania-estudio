/* const hostname = window.location.hostname;
const protocol = window.location.protocol;
const port = window.location.port;

// Detectar automáticamente el contexto
export const API_URL = ((): string => {
  console.log('🌐 Hostname detectado:', hostname);
  
  // 1. Si estamos en el túnel de VSCode
  if (hostname.includes('devtunnels.ms') || hostname.includes('preview.app.github.dev')) {
    console.log('🔗 Modo: Túnel de VSCode');
    return "https://wrcgqstz-4000.brs.devtunnels.ms";
  }
  
  // 2. Si estamos en localhost (desarrollo en PC)
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
    console.log('💻 Modo: Localhost (PC)');
    return "http://localhost:4000";
  }
  
  // 3. Si estamos en una IP local
  const ipPattern = /^(192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|10\.)/;
  if (ipPattern.test(hostname) || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    console.log('📱 Modo: IP local (móvil en red)');
    return `http://${hostname}:4000`;
  }
  
  // 4. Por defecto
  console.log('🚀 Modo: Producción');
  return import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
})();

// URL del frontend para OAuth (muy importante)
export const FRONTEND_URL = ((): string => {
  if (hostname.includes('devtunnels.ms') || hostname.includes('preview.app.github.dev')) {
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  }
  
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
    return "http://localhost:3000";
  }
  
  const ipPattern = /^(192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|10\.)/;
  if (ipPattern.test(hostname) || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return `http://${hostname}:3000`;
  }
  
  return import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000";
})();

console.log("✅ API_URL configurada:", API_URL);
console.log("✅ FRONTEND_URL configurada:", FRONTEND_URL); */
const hostname = window.location.hostname;


export const API_URL = hostname === 'localhost' || hostname === '127.0.0.1' 
  ? 'http://localhost:4000' // Desde PC
  : 'http://192.168.1.4:4000'; // Desde móvil o otros dispositivos

console.log('🎯 API_URL configurada para:', API_URL);