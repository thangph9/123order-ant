import { stringify } from 'qs';
import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';


export async function saveCategory(params) {
  return request(`/api/category/save?ref=${new Date().getTime()}`,{
      method : "POST",
      body: params,
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function updateCategory(params) {
  return request(`/api/category/UP?ref=${new Date().getTime()}`,{
      method : "PUT",
      body: params,
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function getTreeMap() {
  return request(`/api/category/treemap?ref=${new Date().getTime()}`,{
      method : "GET",
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function getAllCategory() {
  return request(`/api/category/LS?ref=${new Date().getTime()}`,{
      method : "GET",
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function getDetailCategory(params) {
  return request(`/api/category/DT?nodeid=${params}&ref=${new Date().getTime()}`,{
      method : "GET",
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function getSearch(params) {
  return request(`/api/category/search`,{
      method : "POST",
      body: params,
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}

