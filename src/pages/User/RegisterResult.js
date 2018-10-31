import React from 'react';
import { Button } from 'antd';
import Link from 'umi/link';
import Result from '@/components/Result';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/">
      <Button size="large">Trang chủ</Button>
    </Link>
  </div>
);

const RegisterResult = ({ location }) => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        Tài khoản：
        <b>{location.state ? location.state.account : '123order@example.com'}</b><br/>
        Đăng ký thành công
      </div>
    }
    description=" "
    actions={actions}
    style={{ marginTop: 56 }}
  />
);

export default RegisterResult;
