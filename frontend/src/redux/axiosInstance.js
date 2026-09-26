import axios from 'axios';

const api = axios.create({
    withCredentials: true,
});

let refreshPromise = null;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config || {};
        const url = (original.url || '').split('?')[0];
        const skipRefresh = url.endsWith('/auth/refresh')
            || url.endsWith('/auth/logout')
            || url.endsWith('Login')
            || url.endsWith('Reg');

        if (error.response && error.response.status === 401 && !original._retry && !skipRefresh) {
            original._retry = true;
            try {
                if (!refreshPromise) {
                    refreshPromise = api
                        .post(`${process.env.REACT_APP_BASE_URL}/auth/refresh`)
                        .finally(() => {
                            refreshPromise = null;
                        });
                }
                await refreshPromise;
                return api(original);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
