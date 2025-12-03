import axios from "axios";
import type {
  LoginDto,
  RegisterDto,
  LoginResponse,
  RegisterResponse,
  User,
  Post,
  Story,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Создаем axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginDto): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (userData: RegisterDto): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  getByUsername: async (username: string): Promise<User> => {
    const response = await api.get<User>(`/users/username/${username}`);
    return response.data;
  },

  search: async (query: string): Promise<User[]> => {
    const response = await api.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  update: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Posts API
export const postsApi = {
  getAll: async (): Promise<Post[]> => {
    const response = await api.get<Post[]>("/posts");
    return response.data;
  },

  getById: async (id: string): Promise<Post> => {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  getByUserId: async (userId: string): Promise<Post[]> => {
    const response = await api.get<Post[]>(`/posts?userId=${userId}`);
    return response.data;
  },

  create: async (postData: Partial<Post>): Promise<Post> => {
    const response = await api.post<Post>("/posts", postData);
    return response.data;
  },

  update: async (id: string, postData: Partial<Post>): Promise<Post> => {
    const response = await api.put<Post>(`/posts/${id}`, postData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

// Stories API
export const storiesApi = {
  getAll: async (): Promise<Story[]> => {
    const response = await api.get<Story[]>("/stories");
    return response.data;
  },

  getById: async (id: string): Promise<Story> => {
    const response = await api.get<Story>(`/stories/${id}`);
    return response.data;
  },

  getByUserId: async (userId: string): Promise<Story[]> => {
    const response = await api.get<Story[]>(`/stories?userId=${userId}`);
    return response.data;
  },

  create: async (storyData: { content: string; mediaUrl?: string }): Promise<Story> => {
    const response = await api.post<Story>("/stories", storyData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/stories/${id}`);
  },
};

// Followers API
export const followersApi = {
  // Подписаться на пользователя
  follow: async (userId: string): Promise<{ message: string; followerId: string; followingId: string; createdAt: string }> => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  // Отписаться от пользователя
  unfollow: async (userId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${userId}/follow`);
    return response.data;
  },

  // Получить список подписчиков пользователя
  getFollowers: async (userId: string): Promise<User[]> => {
    const response = await api.get<User[]>(`/users/${userId}/followers`);
    return response.data;
  },

  // Получить список подписок пользователя
  getFollowing: async (userId: string): Promise<User[]> => {
    const response = await api.get<User[]>(`/users/${userId}/following`);
    return response.data;
  },

  // Проверить, подписан ли текущий пользователь на указанного пользователя
  isFollowing: async (userId: string): Promise<{ isFollowing: boolean }> => {
    const response = await api.get<{ isFollowing: boolean }>(`/users/${userId}/is-following`);
    return response.data;
  },
};
