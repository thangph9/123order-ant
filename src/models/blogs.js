import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getBlogs,addBlogs,saveBlogs,deleteBlogs,blogDetail,blogByID } from '@/services/blogs';

export default {
  namespace: 'blog',

   state: {
    data: {
      list: [],
      pagination: {},
    },
    detail: {}   
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getBlogs, payload);    
        let list=[];
        
        try{
            list=Array.isArray(response.list) ? response.list : []  ;
        }catch(e){
            list=[];
        }
        var data={
            list:list,
            pagination:response.pagination
        }
      yield put({
        type: 'list',
        payload: data,
      });
    },
    *add({payload},{call,put}){
        const response = yield call(addBlogs, payload);    
       if(response.status==='ok'){
           message.success('Thêm mới thành công!');
       }else{
           message.error(response.status);
       }
      yield put({
        type: '_add',
      }); 
    },   
    *byID({payload},{call,put}){
        const response = yield call(blogByID, payload);  
        var data={};
           if(response.status==='ok'){
               try{
                   data=(response.data) ? response.data : []  ;
               }catch(e){
                   
               }
           }else{
               message.error(response.status);
           }
          yield put({
            type: '_byID',
            payload: data
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
    *save({payload},{call,put}){
        const response = yield call(saveBlogs, payload);    
       if(response.status==='ok'){
           message.success('Thay đổi mới thành công!');
       }else{
           message.error(response.status);
       }
      yield put({
        type: '_save',
      }); 
    }
  },
 reducers: {
     list(state,{ payload }){
        return {
            data:payload
        }
    },
    _add(state,{payload}){
        return state;
    },
    _save(state,{payload}){
        return state
    },
    _byID(state,{payload}){
        return {data: payload};
    },
    
 }
};
