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
export async function deleteCategory(params) {
  return request(`/api/category/DEL?id=${params}&ref=${new Date().getTime()}`,{
      method : "DELETE",
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
export async function getLVer2() {
  return request(`/api/category/LVer2?ref=${new Date().getTime()}`,{
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
export async function addCategory(params) {
  return request(`/api/category/add?ref=${new Date().getTime()}`,{
      method : "POST",
      body: params,
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

