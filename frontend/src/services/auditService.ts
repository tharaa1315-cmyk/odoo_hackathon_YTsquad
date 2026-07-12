import api from './api';

export const getAudits = async () => {
    const { data } = await api.get('/audits');
    return data;
};

export const getAuditById = async (id: string) => {
    const { data } = await api.get(`/audits/${id}`);
    return data;
};

export const createAudit = async (auditData: any) => {
    const { data } = await api.post('/audits', auditData);
    return data;
};

export const updateAudit = async (id: string, updateData: any) => {
    const { data } = await api.put(`/audits/${id}`, updateData);
    return data;
};
