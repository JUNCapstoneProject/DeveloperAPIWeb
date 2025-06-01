export default function fetchWithAssist(url, options = {}) {
    let destination = '';
    if (url.includes('auth_server')) {
      destination = 'assist';
    } else {
      destination = 'analysis';
    }
    const isProduction = import.meta.env.MODE === 'production';
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...(isProduction ? { destination } : {})
    };
    const defaultOptions = {
      credentials: "include",
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      },
      ...options,
    };
    return fetch(url, defaultOptions);
} 