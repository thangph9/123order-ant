import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { getTreeMap,saveCategory,getAllCategory,getDetailCategory,getSearch,updateCategory,deleteCategory,addCategory,getLVer2 } from '@/services/category';

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
     let rs={ treeMap: [] };
        try{
            if(response.status =='ok'){
                rs=(response && response.data) ? response.data : []
            }
        }catch(e){
            
        }
      yield put({
        type: 'map',
        payload: rs,
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
        try{
           if(response.status == 'ok'){
            d=(response && response.data) ? response.data : {}
           } 
        }catch(e){
            
        }
        
         yield put({
                type:'all',
                payload: d
            })
    }, 
    *lver2({payload },{call,put}){
        const response =yield call(getLVer2,payload);
        let d = [];
        try{
           if(response.status == 'ok'){
            d=(response && response.data) ? response.data : {}
           } 
        }catch(e){
            
        }
        
        yield put({
                type:'lver2Reducer',
                payload: d
        })
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
    *add({ payload },{call, put}){
         const response = yield call(addCategory, payload);
             
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
                ...response
            },
          });
    },
    *save({ payload },{call, put}){
    
          const response = yield call(saveCategory, payload);
             
          if(response.status==='ok'){
                message.success('Thêm mới thành công');
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
    *update({payload} , {call,put}){
            const response = yield call(updateCategory, payload);
          var newData='';
          if(response.status==='ok'){
                newData=payload;
                message.success('Thay đổi thành công');
            }else if (response.status==='expired'){
                message.warning('Đăng nhập lại ');
            }else{
                message.error('Lỗi! không thể thay đổi');
            }
          yield put({
            type: 'saveReducer',
            payload: {
                newData:newData
            },
          });
    },
    *remove({ payload }, { call , put }){
         const response = yield call(deleteCategory, payload);
         var id='';
        if(response==='ok'){
                id=payload;
                message.success('Xoá thành công');
            }else if (response==='expired'){
                message.warning('Đăng nhập lại ');
            }else{
                message.error('Lỗi! không thể xoá');
            }
         
          yield put({
            type: 'deleteReducer',
            payload: id,
          });
    }
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
    lver2Reducer(state,{ payload }){
        return {
            ...state,
            data: payload
        }
    },    
    saveReducer(state,{ payload }){
        if(payload.newData){
            state.data=payload.newData;
        }
        return {
                ...state
            }
        
    }, 
    addReducer(state,{payload}){
        if(payload.newData){
            state.data=payload.newData;
        }
        return {
                ...state
            }
    },
    deleteReducer(state,{payload}){
        var newData=[];
        try{
            const oldData=state.data.list;
            newData= oldData.filter(k=>{
                return k.nodeid != payload
            });
            state.data.list=newData;
        }catch(e){
            console.log(e);
        }
        return {
                ...state
            }
    },
  },
};
