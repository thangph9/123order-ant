import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';
export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request(`/api/currentUser`,{
        method:'GET',
        headers:{'X-Access-Token':getAuthority()[0].token}
    });
}
