import api from './api';

export const getMaintenanceTickets = async () => {
    const { data } = await api.get('/maintenance');
    return data;
};

export const createMaintenanceTicket = async (ticketData: any) => {
    const { data } = await api.post('/maintenance', ticketData);
    return data;
};

export const updateMaintenanceTicket = async (id: string, updateData: any) => {
    const { data } = await api.put(`/maintenance/${id}`, updateData);
    return data;
};

export const deleteMaintenanceTicket = async (id: string) => {
    const { data } = await api.delete(`/maintenance/${id}`);
    return data;
};
