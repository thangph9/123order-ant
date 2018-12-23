import { stringify } from 'qs';
import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';
export async function getBlogs(params) {
  return request(`/api/blog/list?${stringify(params)}`);
}
export async function saveBlogs(params) {
  console.log(params);
  return request(`/api/blog/UPDATE`,{
      method: 'PUT',
      body: params
  });
}
export async function addBlogs(params) {
  return request(`/api/blog/SAVE`,{
      method: 'PUT',
      body: params
  });
}
export async function blogByID(params) {
    console.log(params);
  return request(`/api/blog/BY/${params}`,);
}