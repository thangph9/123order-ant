import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';
export async function query() {
  return request('/api/users',{
      method:'GET',
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
    
}export async function queryUsers() {
  return request('/api/users',{
      method:'GET',
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
    
}

export async function queryCurrent() {
  return request(`/api/currentUser?ref=${new Date().getTime()}`,{
        method:'GET',
        headers:{'X-Access-Token':getAuthority()[0].token}
    });
}
export async function userList() {
  return request(`/api/user/list`,{
        method:'GET',
        headers:{'X-Access-Token':getAuthority()[0].token}
    });
}
