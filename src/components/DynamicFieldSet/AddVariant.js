import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form, Input, Icon, Button,Row,Col
} from 'antd';

let id = 0;

import styles from './index.less';
@connect(({ loading }) => ({
}))
@Form.create()
class AddVariant extends React.Component {
  state={
      defaultSource:[],
  }
  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 0) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(++id);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

  handleSubmit = (e) => {
    const {variantSubmit,dispatch,match} = this.props; 
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
          variantSubmit(values);
          var productid=match.params.productid;
          dispatch({
              type: 'product/addvariant',
              payload:productid
          })
      }
    });
  }
  componentWillMount(){
      this.setState({
          defaultSource: this.props.defaultSource
      });
      //console.log(this.props);
  }
  componentWillReceiveProps(nextProps){
      
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 24, offset: 0 },
      },
    };
      
    getFieldDecorator('keys', { initialValue: this.state.defaultSource });
    const keys = getFieldValue('keys');
      
    const formItems = keys.map((k, index) => (
     <Row key={`key-${k.variantid}`}>   
        <Col md={9} xs={9}>
           <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? 'Tên' : ''}
            required={false}
          >
            {getFieldDecorator(`names[${k.variantid}]`, {
              initialValue:k.name,        
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{
                required: true,
                message: "",
              }],
            })(
              <Input  style={{ width: '60%', marginRight: 8 }} />
            )}
          </Form.Item>
        </Col>
    </Row>
    ));
    return (
      <Form onSubmit={this.handleSubmit}>
        {formItems}
        {keys.length < 3 &&
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                <Icon type="plus" /> Thêm
              </Button>
            </Form.Item>
           
        }
        <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="primary" htmlType="submit">Lưu lại</Button>
        </Form.Item>
      </Form>
    );
  }
}
export default  AddVariant;