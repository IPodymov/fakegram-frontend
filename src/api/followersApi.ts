// Followers API
// TODO: Эти методы нужно будет добавить после реализации API подписок на бекенде

import { api } from './index';

export const followersApi = {
  // Подписаться на пользователя
  follow: async (userId: string): Promise<void> => {
    await api.post(`/users/${userId}/follow`);
  },

  // Отписаться от пользователя
  unfollow: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}/follow`);
  },

  // Получить список подписчиков пользователя
  getFollowers: async (userId: string): Promise<any[]> => {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data;
  },

  // Получить список подписок пользователя
  getFollowing: async (userId: string): Promise<any[]> => {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
  },

  // Проверить, подписан ли текущий пользователь на другого
  checkFollowing: async (userId: string): Promise<boolean> => {
    const response = await api.get(`/users/${userId}/is-following`);
    return response.data.isFollowing;
  },
};
