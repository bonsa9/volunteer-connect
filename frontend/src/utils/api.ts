export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Set default content type if body exists and content type is not set
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = 'An error occurred';
    try {
      const data = await res.json();
      message = data.message || message;
    } catch (e) {
      // Not JSON
    }
    throw new Error(message);
  }

  return res.json();
};

export const getUserInfo = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      userId: decoded.sub,
      role: decoded.role,
      email: decoded.email
    };
  } catch (e) {
    return null;
  }
};
