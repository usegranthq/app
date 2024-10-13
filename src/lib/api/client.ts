import ky from 'ky';

export const clientApi = ky.create({
  prefixUrl: '/api/backend',
  credentials: 'include',
  hooks: {},
});

export default clientApi;
