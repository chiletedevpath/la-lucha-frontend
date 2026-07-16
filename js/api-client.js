/* =========================
   PUBLIC API CLIENT
========================= */

(function () {
  const API_BASE_URL = window.LA_LUCHA_API_CONFIG?.baseUrl || "https://utp-la-lucha-bd-backend.onrender.com/api";
  const CACHE_PREFIX = "la-lucha-api-cache:";
  const DEFAULT_TIMEOUT_MS = 9000;
  const DEFAULT_RETRIES = 1;
  const DEFAULT_CACHE_TTL_MS = 1000 * 60 * 30;

  function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function readCache(cacheKey) {
    if (!cacheKey) return null;

    try {
      const raw = localStorage.getItem(`${CACHE_PREFIX}${cacheKey}`);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      const savedAt = new Date(parsed.savedAt).getTime();
      const isExpired = !Number.isFinite(savedAt) || Date.now() - savedAt > DEFAULT_CACHE_TTL_MS;

      if (isExpired) {
        localStorage.removeItem(`${CACHE_PREFIX}${cacheKey}`);
        return null;
      }

      return parsed.data;
    } catch (error) {
      return null;
    }
  }

  function writeCache(cacheKey, data) {
    if (!cacheKey) return;

    try {
      localStorage.setItem(
        `${CACHE_PREFIX}${cacheKey}`,
        JSON.stringify({
          savedAt: new Date().toISOString(),
          data
        })
      );
    } catch (error) {
      console.warn("No se pudo guardar cache local de API.", error);
    }
  }

  async function fetchWithTimeout(url, timeoutMs) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        cache: "no-store",
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`La API respondio ${response.status}`);
      }

      return response.json();
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function getJson(path, options = {}) {
    const resultado = await getJsonWithMeta(path, options);

    return resultado.data;
  }

  async function getJsonWithMeta(path, options = {}) {
    const cacheKey = options.cacheKey || path.replace(/^\//, "");
    const fallbackData = options.fallbackData;
    const timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;
    const retries = Number.isInteger(options.retries) ? options.retries : DEFAULT_RETRIES;
    const url = `${API_BASE_URL}${path}`;
    let lastError = null;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const data = await fetchWithTimeout(url, timeoutMs);
        writeCache(cacheKey, data);
        return { data, source: "api", error: null };
      } catch (error) {
        lastError = error;
        if (attempt < retries) {
          await delay(900);
        }
      }
    }

    const cachedData = readCache(cacheKey);
    if (cachedData) {
      console.warn(`Usando cache local para ${path}.`, lastError);
      return { data: cachedData, source: "cache", error: lastError };
    }

    if (fallbackData) {
      console.warn(`Usando datos locales de respaldo para ${path}.`, lastError);
      return { data: fallbackData, source: "fallback", error: lastError };
    }

    throw lastError || new Error(`No se pudo cargar ${path}`);
  }

  window.LaLuchaApi = {
    baseUrl: API_BASE_URL,
    getJson,
    getJsonWithMeta
  };
})();
