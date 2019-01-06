import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { upload } from '@/services/image';

export default {
  namespace: 'image',

   state: {
       images:[],
  },
  effects: {
    *upload({ payload }, { call, put }) {
      const response = yield call(upload, payload);  
      payload.response=response;
      yield put({
        type: 'uploadReducer',
        payload: payload,
      });
    },
  },

  reducers: {
    uploadReducer(state,{ payload }){
        var {images} = state;
        images.push(payload);
        
        return {
            ...state,
            images
            
        }
    },  
  },
};
