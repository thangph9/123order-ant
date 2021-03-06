import { stringify } from 'qs';
import request from '@/utils/request';
import { getAuthority } from '@/utils/authority';
export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}
 
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}  
    
export async function accountLogin(params) {
  return request('/api/login/account', {
    method: 'POST', 
    body: params, 
  });   
}

export async function register(params) {
  return request('/api/register', { 
    method: 'POST',
    body: params,
  });
} 

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function addOrder(params){
    return request(`/api/order/add`,{
        method:'POST',
        body:params,
        headers:{'X-Access-Token':getAuthority()[0].token}
    })
}   
export async function getOrderList(e){
    console.log(e);
    return request(`/api/order/list?ref=${new Date().getTime()}`,{
        method:'POST',
        body:e,
        headers:{'X-Access-Token':getAuthority()[0].token}
    })
}
export async function updateOrder(params){
    
    return request(`/api/order/update_order?ref=${new Date().getTime()}`,{
        method:'PUT',
        body: params,
        headers:{'X-Access-Token':getAuthority()[0].token}
    }) 
} 
export async function deleteRow(params){
    return request(`/api/order/del_row?id=${params}`,{
        method:'DELETE',
        headers:{'X-Access-Token':getAuthority()[0].token}
    });  
} 
export async function generateBillCode(){
    return request(`/api/generate/bill_code?ref=${new Date().getTime()}&type=KL`,{
        method:'GET',
        headers:{'X-Access-Token':getAuthority()[0].token}
    });
} 
  
export async function checkAccount(params){
    return request(`/api/user/check_account`,{
        method:'POST',
        body:params,
    })
}
export async function getRaito(params){
    return request(`/api/currency/raito`,{
        method:'GET',
    })
}
export async function saveCurrencyRaito(params){
    return request(`/api/currency/raito`,{
        method:'POST',
        body: params,
        headers:{'X-Access-Token':getAuthority()[0].token}
    })
}
export async function getComment(params){ 
    
    return request(`/api/comment/list?sbill_code=${params.sbill_code}&username=${params.username}&ref=${new Date().getTime()}`,{
        method:'GET',
        headers:{'X-Access-Token':getAuthority()[0].token}
    })
}
export async function saveComment(params){
    return request(`/api/comment/save?ref=${new Date().getTime()}`,{
        method:'POST',
        body: params,
        headers:{'X-Access-Token':getAuthority()[0].token}
    })
}



