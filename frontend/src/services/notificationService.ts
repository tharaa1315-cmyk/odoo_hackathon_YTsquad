import api from './api';

export const getMyNotifications = async () => {
    const { data } = await api.get('/notifications');
    return data;
};

export const markNotificationRead = async (id: string) => {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
};

export const markAllNotificationsRead = async () => {
    const { data } = await api.put('/notifications/read-all');
    return data;
};
