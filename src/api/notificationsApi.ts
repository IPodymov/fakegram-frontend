import { api } from './index';
import type { Notification } from '../types';

export const notificationsApi = {
  // Получить все уведомления
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
  },

  // Получить непрочитанные уведомления
  getUnread: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/notifications/unread');
    return response.data;
  },

  // Получить количество непрочитанных уведомлений
  getUnreadCount: async (): Promise<number> => {
    const response = await api.get<{ count: number }>('/notifications/unread-count');
    return response.data.count;
  },

  // Отметить уведомление как прочитанное
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await api.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  // Отметить все уведомления как прочитанные
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },

  // Удалить уведомление
  delete: async (id: string): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },

  // Удалить все уведомления
  deleteAll: async (): Promise<void> => {
    await api.delete('/notifications');
  },
};
