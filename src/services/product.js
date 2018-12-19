import { stringify } from 'qs';
import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';
export async function getProducts(params) {
  return request(`/api/product/list?${stringify(params)}`);
}

export async function saveProduct(params) {
  return request(`/api/product/save?ref=${new Date().getTime()}`,{
      method : "POST",
      body: params,
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function getProductDetail(params) {
  return request(`/api/product/DT?productid=${params.productid}&ref=${new Date().getTime()}`,{
      method : "GET",
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function searchProduct(params) {
  return request(`/api/product/search`,{
      method : "POST",
      body: params,
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function saveProductVariants(params) {
  return request(`/api/product/saveProductVariants`,{
      method : "PUT",
      body: params,
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function getProductsByCategory() {
  return request(`/api/product/PL?ref=${new Date().getTime()}`,{
      method : "GET",
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
} 
export async function getProductsByCategoryDetail() {
  return request(`/api/product/POD?ref=${new Date().getTime()}`,{
      method : "GET",
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
} 

