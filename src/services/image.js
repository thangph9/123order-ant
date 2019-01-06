import { stringify } from 'qs';
import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';
export async function getProducts(params) {
  return request(`/api/product/list?${stringify(params)}`);
}
export async function upload(params) {
    const formData = new FormData();
    formData.append('file',params);
  return request(`/api/image/upload?ref=${new Date()}`,{
      method : "POST",
      body: formData,
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}