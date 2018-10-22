import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { addOrder, generateBillCode, getOrderList, updateOrder, deleteRow ,getRaito, saveCurrencyRaito } from '@/services/api';
var currencyFormatter = require('currency-formatter');

export default {
  namespace: 'order',

   state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *submitRegularForm({ payload }, { call,put }) {
      yield call(addOrder, payload);
      message.success('Thành công');
      yield put(routerRedux.push('/order/order-list'));
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(addOrder, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/form/step-form/result'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      yield call(addOrder, payload);
      message.success('Đặt hàng thành công');
      
    },  
    *generateBillCode({ payload }, { call,put }){
        const response = yield call(generateBillCode, payload);
        yield put({
            type: 'fetchBillCode',
            payload: response,
          });
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(getOrderList, payload);
      let newlist =[];
      let list = Array.isArray(response.list) ? response : []  ;
      yield put({
        type: 'orderList',
        payload: list,
      });
    },
    *saveOrder({ payload },{call, put}){
          console.log(payload);
          const response = yield call(updateOrder, payload);
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
        
    *deleteRow({ payload },{call ,put}){
          const response = yield call(deleteRow, payload);
          console.log(response);
          if(response=='ok'){
                message.success('Xoá thành công');
            }else if (response=='expired'){
                message.warning('Đăng nhập lại ');
            }else{
                message.error('Lỗi! không thể thay đổi');
            }
          yield put({
            type: 'deleteOrder',
            payload: {
                key:payload,
                status:response
            },
          });
    },
    *fetchRaito({payload},{call,put}){
        const response = yield call(getRaito, payload);
        yield put({
            type: 'currencyRaito',
            payload: {
                ...response
            },
          });
    },
    *saveCurrencyRaito({payload},{call,put}){
       const response = yield call(saveCurrencyRaito, payload);
       
       if(response.status=='ok'){
                message.success('Thay đổi thành công');
            }else if (response.status=='expired'){
                message.warning('Đăng nhập lại ');
            }else{
                message.error('Lỗi! không thể thay đổi');
            }
   }
  },

  reducers: {
    saveStepFormData(state, { payload }) { 
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    fetchBillCode(state,{ payload }){
        return{
            ...state,
            ...payload
        };
    },
    orderList(state,{ payload }){
        return {
            ...state,
            data: payload
        }
    },
    save(state,{ payload }){
        const { data: {list,pagination} } = state;
        const row=payload.row;
        const newData = [...list];
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
        }                   
        
    },
    deleteOrder( state, { payload }){
        const { data: {list,pagination} } = state;
        var key=payload.key;
        var newData=[]
        var dataSource=[...list];
        
        if(dataSource.length > 0){
           newData= dataSource.filter(item => item.sbill_code !== key);
        }
        if(payload.status ==='ok'){
            return {
                data: {list: newData,pagination},
            }
        }else{
            return {
                ...state
            }
        }  
    },   
    currencyRaito(state,{ payload }){
        return {
            ...state,
            currency: payload,
        }
    }    
  },
};
