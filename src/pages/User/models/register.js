import { register,checkAccount } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(register, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
        if(response.status!=='ok'){
            message.error('Không thể đăng ký tài khoản, mời liên hệ với quản trị viên');
        }
    },
    *checkAccount({ payload } , { call,put }){
        const response = yield call(checkAccount, payload);
      yield put({
        type: 'checkAccountHandle',
        payload: response,
      });
    } 

  },

  reducers: {
    registerHandle(state, { payload }) {
    setAuthority(payload.currentAuthority);
    reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
    checkAccountHandle(state,{ payload }){
        return {
            ...state,
            status:payload
        }
    }    
  },
};
