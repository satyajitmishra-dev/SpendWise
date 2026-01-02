import api from './api';

export const parseText = async (text) => {
    const response = await api.post('/smart/parse-text', { text });
    return response.data;
};

export const scanReceipt = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/smart/scan', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};
