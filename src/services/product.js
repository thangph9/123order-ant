import { stringify } from 'qs';
import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';
export async function getProducts(params) {
  return request(`/api/product/list?${stringify(params)}`);
}

export async function saveProduct(params) {
  return request('/api/product/save',{
      method : "POST",
      body: params,
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function getProductDetail(params) {
  return request('/api/product/detail',{
      method : "GET",
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}

