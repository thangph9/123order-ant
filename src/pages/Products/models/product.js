import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getProducts,saveProduct,getProductDetail } from '@/services/product';
var currencyFormatter = require('currency-formatter');

export default {
  namespace: 'product',

   state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getProducts, payload);    
      let list = [];
        try{
            list=Array.isArray(response.list) ? response : []  ;
        }catch(e){
            list=[];
        }
      yield put({
        type: 'list',
        payload: list,
      });
    },
    *fetchDetail({payload },{call,put}){
        const response =yield call(getProductDetail,payload);
        yield put({
            type:'detail',
            payload: response
        })
    },    
    *saveProduct({ payload },{call, put}){
          const response = yield call(saveProduct, payload);
          if(response.status==='ok'){
                message.success('Thay đổi thành công');
            }else if (response.status==='expired'){
                message.warning('Đăng nhập lại ');
            }else{
                message.error('Lỗi! không thể thay đổi');
            }
          yield put({
            type: 'save',
            payload: {
                row:payload,
                ...response
            },
          });
    },
  },

  reducers: {
    list(state,{ payload }){
        return {
            ...state,
            data: payload
        }
    },
    detail(state,{ payload }){
        return {
            ...state,
            data: payload
        }
    },
    save(state,{ payload }){
        const { data: {list,pagination} } = state;
        const row=payload.row;
        const newData = [...list];
        /*
        if(newData.length > 0){
            const index = newData.findIndex(item => row.sbill_code === item.sbill_code);
            const item = newData[index];
            newData.splice(index, 1, {
              ...item,
              ...row,
            });
        }
                           
        if(payload.status ==='ok'){
            return {
                data: {list: newData,pagination},
            }
        }else{
            return {
                ...state
            }
        }   */
        return {
                ...state
            }
        
    },   
  },
};
