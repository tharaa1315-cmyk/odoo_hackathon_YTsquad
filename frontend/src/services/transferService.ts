import api from './api';

export const getTransfers = async () => {
    const { data } = await api.get('/transfers');
    return data;
};

export const createTransfer = async (transferData: any) => {
    const { data } = await api.post('/transfers', transferData);
    return data;
};

export const updateTransferStatus = async (id: string, updateData: any) => {
    const { data } = await api.put(`/transfers/${id}`, updateData);
    return data;
};

export const deleteTransfer = async (id: string) => {
    const { data } = await api.delete(`/transfers/${id}`);
    return data;
};
