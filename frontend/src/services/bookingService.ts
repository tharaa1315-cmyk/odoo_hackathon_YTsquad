import api from './api';

export const getBookings = async () => {
    const { data } = await api.get('/bookings');
    return data;
};

export const getMyBookings = async () => {
    const { data } = await api.get('/bookings/my-bookings');
    return data;
};

export const createBooking = async (bookingData: any) => {
    const { data } = await api.post('/bookings', bookingData);
    return data;
};

export const updateBookingStatus = async (id: string, status: string) => {
    const { data } = await api.put(`/bookings/${id}`, { status });
    return data;
};

export const deleteBooking = async (id: string) => {
    const { data } = await api.delete(`/bookings/${id}`);
    return data;
};
