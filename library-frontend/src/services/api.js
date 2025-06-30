import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(token) {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb) {
  refreshSubscribers.push(cb);
}

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      if (isRefreshing) {
        return new Promise(resolve => {
          addRefreshSubscriber(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refreshtoken`,
          { refreshToken: getRefreshToken() },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { accessToken, refreshToken } = response.data;
        setTokens(accessToken, refreshToken);
        api.defaults.headers.Authorization = `Bearer ${accessToken}`;

        onRefreshed(accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

//Authentication API
export const authAPI = {
  login: async credentials => {
    const response = await api.post('/auth/signin', credentials);
    const data = response.data;

    setTokens(data.token, data.refreshToken);
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      })
    );

    return data;
  },

  logout: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await api.post('/auth/signout', { refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    clearTokens();
  },

  register: async userData => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  refreshToken: async () => {

    const response = await axios.post(
      `${API_BASE_URL}/auth/refreshtoken`,
      { refreshToken: getRefreshToken() },
      { headers: { 'Content-Type': 'application/json' } }
    );
    const { accessToken, refreshToken } = response.data;
    setTokens(accessToken, refreshToken);
    return accessToken;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => !!getToken(),
};

//Books API
export const booksAPI = {
  getAll: async () => {
    const response = await api.get('/books');
    return response.data;
  },

  getById: async id => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  create: async book => {
    const response = await api.post('/books', book);
    return response.data;
  },

  update: async (id, book) => {
    const response = await api.put(`/books/${id}`, book);
    return response.data;
  },

  delete: async id => {
    const response = await api.delete(`/books/${id}`);
    return response.status === 204 || response.status === 200;
  },

  search: async query => {
    const response = await api.get(`/books/search`, {
      params: { q: query },
    });
    return response.data;
  },

  getByAuthor: async authorId => {
    const response = await api.get(`/books/author/${authorId}`);
    return response.data;
  },
};

//Authors API
export const authorsAPI = {
  getAll: async () => {
    const response = await api.get('/authors');
    return response.data;
  },

  getById: async id => {
    const response = await api.get(`/authors/${id}`);
    return response.data;
  },

  create: async author => {
    const response = await api.post('/authors', author);
    return response.data;
  },

  update: async (id, author) => {
    const response = await api.put(`/authors/${id}`, author);
    return response.data;
  },

  delete: async id => {
    const response = await api.delete(`/authors/${id}`);
    return response.status === 204 || response.status === 200;
  },

  search: async query => {
    const response = await api.get(`/authors/search`, {
      params: { q: query },
    });
    return response.data;
  },
};
