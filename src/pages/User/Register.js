import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import styles from './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>Mức độ：Mạnh</div>,
  pass: <div className={styles.warning}>Mức độ：Vừa</div>,
  poor: <div className={styles.error}>Mức độ：Yếu</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};
let userStatus={}  
@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '84',
    rule: 'member',
    
  };
  
    
  componentDidUpdate() {
    const { form, register, dispatch } = this.props;
    const account = form.getFieldValue('username');
    if (register.status === 'ok') {
      dispatch({type:'null'},
        router.push({ 
          pathname: '/user/register-result',
          state: {
            account,
          },
        })
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch,register } = this.props;
    form.validateFields({ force: true }, (err, values) => {
        
      if (!err) {
        setTimeout(() => {
          // server validate
          if (register.status && register.status.status !== 'ok') {
            this.props.form.setFields({
              username: {
                value: register.status.username,
                errors: [new Error('Tài khoản đã tồn tại!')],
              },
            });
          }else{
              const { prefix,rule } = this.state;
                dispatch({
                  type: 'register/submit',
                  payload: {
                    ...values,
                    prefix,
                    rule,  
                  },
                });
          }
        }, 500);  
          
        
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };
  checkAccount = e =>{
      const { value }= e.target; 
      const { form , dispatch} = this.props;
      
      form.validateFields(['username'],(errors, values)=>{
         
          if(!errors){
              dispatch({
                  type: 'register/checkAccount',
                  payload: {
                    username: value,
                  },
              });
          }
      })
      
  }
  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Mật khẩu không khớp!');
    } else {
      callback();
    }
  };
  
  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: 'Nhập mật khẩu！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = value => {
    this.setState({
      prefix: value,
    });
  };
  changeRule = value =>{
      this.setState({
          rule: value,
      })
      
  }
  renderPasswordProgress = () => {
    const { form } = this.props;
    
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting,register } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, help, visible,rule } = this.state;
    if(register && register.status && register.status.status=='ok'){
       userStatus= {
            hasFeedback: true,
            validateStatus:"success"
            }
    }else if(register && register.status && register.status.status=='invalid'){
        userStatus= {
            help: 'Tài khoản đã tồn tại',
            hasFeedback: true,
            validateStatus:"error"
        };
    }
    return (
      <div className={styles.main}>
        <h3>Đăng ký</h3>
        <Form onSubmit={this.handleSubmit}>
            
      
          <FormItem>
            {getFieldDecorator('name', {
                rules:[
                    {
                      required: true,
                      message: 'Nhập họ tên',
                    },
              ],
            })(<Input size="large" placeholder="Họ tên" />)}
          </FormItem> 
          <FormItem>
            <InputGroup compact>
              <Select
                size="large"
                value={prefix}
                onChange={this.changePrefix}
                style={{ width: '20%' }}
              >
                <Option value="84">+84</Option>
              </Select>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: 'Yêu cầu nhập số điện thoại',
                  },
                  {
                    pattern: /\d{9}$/,
                    message: 'Nhập sai định dạng！',
                  },
                ],
              })(<Input size="large" style={{ width: '80%' }} placeholder="  " />)}
            </InputGroup>
          </FormItem>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'Sai định dạng email',
                },
              ],
            })(<Input size="large" placeholder="Email" />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('address', {
               
              
            })(<Input size="large" placeholder="Địa chỉ" />)}
          </FormItem> 
          <FormItem 
            {...userStatus} 
          >
            {getFieldDecorator('username', {
              rules: [
                    {
                      required: true,
                      message: 'Nhập tài khoản',
                    },
                  ],
            })(<Input size="large" placeholder="Tài khoản" onBlur={this.checkAccount} />)}
          </FormItem>
          <FormItem help={help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    Mât khẩu lớn hơn 6 ký tự
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(<Input size="large" type="password" placeholder="Mật khẩu" />)}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Nhập lại mật khẩu',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder="Nhập lai mật khẩu" />)}
          </FormItem>
          <FormItem>
                <Select
                    size="large"
                    value={rule}
                    onChange={this.changeRule}
                    style={{ width: '60%' }}
                  >
                    <Option value="superadmin">Super Admin</Option>
                    <Option value="admin">Admin</Option>
                    <Option value="moduser">Manager User</Option>
                    <Option value="member">User</Option>
              </Select>
            </FormItem>
    
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              Đăng ký
            </Button>
            <Link className={styles.login} to="/User/Login">
              Đăng nhập
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Register;
