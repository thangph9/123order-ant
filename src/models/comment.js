import { getComment,saveComment } from '@/services/api';
import { message } from 'antd';
export default {
  namespace: 'comment',

  state: {
     list:[],
     status:'',
  },

  effects: {
    *save({payload}, { call, put }) {
      let result=[];
      const response = yield call(saveComment,payload);
      if(response.status==='ok'){
                message.success('Đã gửi ');
            }else if (response.status==='expired'){
                message.warning('Đăng nhập lại ');
            }else{
                message.error('Lỗi! không thể gửi');
            }
    
      yield put({
        type: 'saveComment',
        payload: {row: response.result,status: response.status},
      });
    },
    *fetch({payload}, {call , put}){
          const response = yield call(getComment, payload);
          let newlist =[];
          let list = [];
            try{
                list=Array.isArray(response.list) ? response : []  ;
            }catch(e){
                list=[];
            }
          yield put({
            type: 'getComment',
            payload: list,
          });
    }
  },

  reducers: {
    
   saveComment(state, { payload }) {
      if(payload.status ==='ok'){
            
            const { comment: { list } } = state;
            const row=payload.row;
            const newData = [...list];
           
            if(newData.length > 0){
                const index = newData.findIndex(item =>(row.sbill_code === item.sbill_code && row.username === item.username)   );
                const item = newData[index];
                newData.splice(index, 1, {
                  ...item,
                  ...row,
                });
                return {
                    comment: {list : newData},           
                } 
            }else{
                return {
                    comment: {list : [payload.row]},           
                } 
            }
            
        }else{
            return {
                ...state
            }
        }   
    },
    getComment(state, { payload }){
         return {
                ...state,
                comment:payload
        }        
     } 
        
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
