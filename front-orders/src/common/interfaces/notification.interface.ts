export interface INotificationResponse {
  data: INotification[];
}

export interface INotification {
  _id: string;
  title: string;
  description: string;
  isRead: boolean;
  isShown: boolean;
  userId: string;
  type: string;
  createdAt: string;
  readAt: string;
  __v: number;
}
