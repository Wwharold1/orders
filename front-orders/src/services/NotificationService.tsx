import { isAxiosError } from 'axios';

import { apiUrl } from '@/common/utils/axios';

export const NotificationService = () => {
  const hasUnread = async () => {
    try {
      return (await apiUrl.post(`/notification/app/has-unread`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  const listNotifications = async () => {
    try {
      return (await apiUrl.post(`/notification/app/list`)).data;
    } catch (error) {
      if (isAxiosError(error)) {
        return error.response?.data;
      }
    }
  };

  return {
    listNotifications,
    hasUnread,
  };
};
