import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getTreeMap,saveCategory,getAllCategory,getDetailCategory,getSearch } from '@/services/category';

export default {
  namespace: 'category',

   state: {
    data: {
      list: [],
      pagination: {},
    },
    detail: {},
    treeMap:[],
       
  },
  effects: {
    *treemap({ payload }, { call, put }) {
      const response = yield call(getTreeMap, payload);
      
      yield put({
        type: 'map',
        payload: (response && response.data) ? response.data : [],
      });
    },
    *fetchDetail({payload },{call,put}){
        const response =yield call(getDetailCategory,payload);
         let d = [];
        if(response.status == 'ok'){
            yield put({
                type:'detail',
                payload: (response && response.data) ? response.data : {}
            })
        }
    },  
    *fetchAll({payload },{call,put}){
        const response =yield call(getAllCategory,payload);
         let d = [];
        if(response.status == 'ok'){
            yield put({
                type:'all',
                payload: (response && response.data) ? response.data : {}
            })
        }
    },  
    *search({ payload },{call,put}){
        const response =yield call(getSearch,payload);
        let d = [];
        try{
            if(response.status=='ok'){
                d=(response && response.data) ? response.data : [];
            }
            
        }catch(e){
        }
        
        yield put({
                type:'all',
                payload: d
            })
    } , 
    *save({ payload },{call, put}){
    
          const response = yield call(saveCategory, payload);
          if(response.status==='ok'){
                message.success('Thay đổi thành công');
            }else if (response.status==='expired'){
                message.warning('Đăng nhập lại ');
            }else{
                message.error('Lỗi! không thể thay đổi');
            }
          yield put({
            type: 'saveReducer',
            payload: {
                ...response
            },
          });
    },
  },

  reducers: {
    map(state,{ payload }){
        return {
            ...state,
            treeMap: payload
        }
    },
    detail(state,{ payload }){
        return {
            ...state,
            data: payload
        }
    },
    all(state,{ payload }){
        return {
            ...state,
            data: payload
        }
    },
    saveReducer(state,{ payload }){
        return {
                ...state
            }
        
    },   
  },
};
