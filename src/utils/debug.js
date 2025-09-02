// Utilitário para controlar logs de debug baseado em parâmetro da URL

export const isAdminMode = () => {
  if (typeof window === 'undefined') return false;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('admin') === 'true';
};

// Wrapper para console.log que só mostra em modo admin
export const adminLog = (...args) => {
  if (isAdminMode()) {
    console.log(...args);
  }
};

// Wrapper para console.error que só mostra em modo admin
export const adminError = (...args) => {
  if (isAdminMode()) {
    console.error(...args);
  }
};

// Wrapper para console.warn que só mostra em modo admin
export const adminWarn = (...args) => {
  if (isAdminMode()) {
    console.warn(...args);
  }
};

// Wrapper para console.info que só mostra em modo admin
export const adminInfo = (...args) => {
  if (isAdminMode()) {
    console.info(...args);
  }
};

// Exporta objeto com todos os métodos para uso similar ao console
export const adminConsole = {
  log: adminLog,
  error: adminError,
  warn: adminWarn,
  info: adminInfo
};