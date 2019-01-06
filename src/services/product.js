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
export async function updateProduct(params) {
  return request(`/api/product/update?ref=${new Date().getTime()}`,{
      method : "PUT",
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
export async function saveProducts(params) {
  return request(`/api/product/saveProducts?ref=${new Date().getTime()}`,{
      method : "PUT",
      body: params,
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function addProduct(params) {
  return request(`/api/product/add?ref=${new Date().getTime()}`,{
      method : "POST",
      body: params,
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function getProduct(params) {
  return request(`/api/product/v2/${params}`);
}
export async function getVariantsBy(params) {
  return request(`/api/product/v2/variants/${params}`);
}
export async function getOptionsBy(params) {
  return request(`/api/product/v2/options/${params}`);
}
export async function deleteOption(params) {
  return request(`/api/product/v2/options/delete/${params.key}/${params.productid}`,{
       method : "DELETE",
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function addOption(params) {
  return request(`/api/product/v2/options/add`,{
       method : "POST",
       body: params,
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}
export async function updateOption(params) {
  return request(`/api/product/v2/options/update`,{
       method : "PUT",
       body: params,
      headers:{'X-Access-Token':getAuthority()[0].token}
  });
}

