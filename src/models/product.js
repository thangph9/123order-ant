import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getProducts,saveProduct,getProductDetail,saveProducts,getProduct,getVariantsBy,getOptionsBy,deleteOption,addOption,updateOption, searchProduct,saveProductVariants,getProductsByCategory,getProductsByCategoryDetail,updateProduct,addProduct } from '@/services/product';
var currencyFormatter = require('currency-formatter');

export default {
  namespace: 'product',

   state: {
    data: {
      list: [],
      pagination: {},
    },
    detail: {}   
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getProducts, payload);    
        let list=[];
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
         let d = [];
        if(response.status == 'ok'){
            yield put({
                type:'detail',
                payload: (response.data) ? response.data : {}
            })
        }
        
    },  
    *test_list({payload },{call,put}){
        const response =yield call(getProductsByCategory,payload);
         let d = [];
        if(response.status == 'ok'){
            
            d=(response.list) ? response.list : []
            yield put({
                type:'list',
                payload: {
                    list: d,
                    pagination:  response.pagination,
                    
                }
            })
        }
        
    },
    *getPOD({payload}, { call ,put}){
          const response =yield call(getProductsByCategoryDetail,payload);
         let d = [];
        
        if(response.status == 'ok'){
            
            d=(response.data) ? response.data : []
            yield put({
                type:'list',
                payload: d
            })
        }
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
    *saveProducts({ payload },{call, put}){
        const response = yield call(saveProducts, payload);
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
    *add({ payload },{call, put}){
        const response = yield call(addProduct, payload);
          if(response.status==='ok'){
                message.success('Thêm mới thành công');
            }else if (response.status==='expired'){
                message.warning('Đăng nhập lại ');
            }else{
                message.error('Lỗi! không thể thay đổi');
            }
          yield put({
            type: 'addReducer',
            payload: {
                row:payload,
                ...response
            },
          });
    },
    *saveProductVariants({ payload },{call, put}){
          const response = yield call(saveProductVariants, payload);
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
    *update({payload},{call,put}){
          const response = yield call(updateProduct, payload);
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
    *search({payload} , {call, put}){
        const response = yield call(searchProduct, payload);    
        let list=[];
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
    *getBy({ payload }, { call, put }) {
        
        const response = yield call(getProduct, payload);    
       
      yield put({
        type: 'getByReducer',
        payload: response.data,
      });
    },
    *optionsBy({ payload }, { call, put }) {
        
      const response = yield call(getOptionsBy, payload);    
       let list=[];
        try{
            list=Array.isArray(response.data) ? response.data : []  ;
        }catch(e){
            list=[];
        }
      yield put({
        type: 'optionsByReducer',
        payload: list,
      });
    },
    *variantsBy({ payload }, { call, put }) {
        
        const response = yield call(getVariantsBy, payload);    
       
      yield put({
        type: 'variantsByReducer',
        payload: response.data,
      });
    },
    *deleteOption({ payload }, { call, put }) {
        
      const response = yield call(deleteOption, payload); 
        var res = JSON.parse(response);
       if(res.status==='ok'){
                message.success('Đã xoá');
            }else if (res.status==='expired'){
                message.warning('Đăng nhập lại ');
            }else{
                message.error('Lỗi! không thể thay đổi');
        }
      yield put({
        type: 'deleteOptionReducer',
        payload: payload,
      });
    },    
    *addOption({ payload }, { call, put }) {
      const response = yield call(addOption, payload); 
        var data=payload;
       if(response.status==='ok'){
           data=response.data;
                message.success('Thêm thành công');
            }else if (response.status==='expired'){
                message.warning('Đăng nhập lại ');
            }else{
                message.error('Lỗi! không thể thay đổi');
        }
        
      yield put({
        type: 'addOptionReducer',
        payload: data,
      });
    },   
    *updateOption({ payload }, { call, put }) {
      const response = yield call(updateOption, payload); 
        var data=payload;
       if(response.status==='ok'){
                data=response.data;
                message.success('Sửa thành công');
            }else if (response.status==='expired'){
                message.warning('Đăng nhập lại ');
            }else{
                message.error('Lỗi! không thể thay đổi');
        }
      yield put({
        type: 'updateOptionReducer',
        payload: data,
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
            detail: payload
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
    getByReducer(state,{payload}){
         return {
            ...state,
            detail: payload
        }
    },
    optionsByReducer(state,{payload}){
         return {
            ...state,
            options: payload
        }
    } 
    ,
    variantsByReducer(state,{payload}){
         return {
            ...state,
            variants: payload
        }
    },
    deleteOptionReducer(state,{payload}){
         return {
            ...state,
        }
    },
    addOptionReducer(state,{payload}){
        var newOption=state.options;
        newOption.push(payload);     
        return {
                 ...state,
                options: newOption,
             }
    },
    updateOptionReducer(state,{payload}){
        var oldOption=state.options;
        var newOption=oldOption.filter(k=>{
            if(k.optid===payload.optid){
                k=payload;
                return true;
            }
        })
             return {
                 ...state,
                 options:newOption,
             }
    },         
  },
};
