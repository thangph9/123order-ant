import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
@connect(({order, loading }) => ({
  order,       
  submitting: loading.effects['order/submitRegularForm'],
  loading:loading, 
}))
@Form.create()
class OrderForm extends PureComponent {
    state={
        status:'pending'
    }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'order/submitRegularForm',
          payload: values,
        });
      }
    });
  }
  changeStatus=e=>{
      this.setState({
          status: e,
      })
  }
  componentDidMount() {
    const { dispatch } = this.props;
      
    dispatch({
      type: 'order/generateBillCode',
      payload: {},
    });
      
  }
  render() {
    const { submitting, order } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const {status} = this.state;
    let bill_code=order.billcode;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
      
    return (
      <PageHeaderWrapper
        title="Đặt hàng"
        content="Đặt hàng"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="Mã Bill">
              {getFieldDecorator('bill', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                    
                  },
                ],
                initialValue:bill_code
              })(<Input placeholder=" " disabled  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Tên khách hàng">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Nhập tên khách hàng',
                  },
                ],
              })(<Input placeholder="Tên khách hàng" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Địa chỉ">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: 'Nhập địa chỉ khách hàng',
                  },
                ],
              })(<Input placeholder=" " />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Email">
              {getFieldDecorator('email', {
                
              })(<Input placeholder=" " />)}
            </FormItem>
             <FormItem {...formItemLayout} label="Số điện thoại">
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: 'Nhập số điện thoại khách hàng',
                  },
                ],
              })(<Input placeholder=" " />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Code sp">
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                  },
                ],
              })(<Input placeholder="Mã sản phẩm " />)}
            </FormItem>
             
            <FormItem {...formItemLayout} label="Tên sp">
              {getFieldDecorator('product_name', {
                rules: [
                  {
                    required: true,
                    message: 'Nhập tên sản phẩm',
                  },
                ],
              })(<Input placeholder="Tên sản phẩm" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Link sp">
              {getFieldDecorator('link', {
                rules: [
                  {
                    required: true,
                    message: 'Nhập link sản phẩm',
                  },
                ],
              })(<Input placeholder="Link sản phẩm" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Size">
              {getFieldDecorator('size', {
                
              })(<Input placeholder="Size" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Màu">
              {getFieldDecorator('color', {
                
              })(<Input placeholder="Color" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Số lượng">
              {getFieldDecorator('amount', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                  },
                ],
              })(<Input placeholder="Số lượng" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Giá web">
              {getFieldDecorator('web_price', {
                
              })(<Input placeholder="Giá web" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Sale">
              {getFieldDecorator('sale', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                  },
                ],
              })(<Input placeholder="sale" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Tỷ giá báo khách">
              {getFieldDecorator('rate', {
                
              })(<Input placeholder=" " />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Giá báo khách">
              {getFieldDecorator('price', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                  },
                ],
              })(<Input placeholder=" " />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Đặt cọc">
              {getFieldDecorator('deposit', {
                
              })(<Input placeholder=" " />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Cần thu">
              {getFieldDecorator('realpayprice', {
                rules: [
                  {
                    required: true,
                    message: ' ',
                  },
                ],
              })(<Input placeholder=" " />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Vận chuyển thực tế">
              {getFieldDecorator('delivery', {
                
              })(<Input placeholder=" " />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Vận chuyển báo khách">
              {getFieldDecorator('deliveryprice', {
                
              })(<Input placeholder=" " />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Ship Web">
              {getFieldDecorator('shipWeb', {
                
              })(<Input placeholder=" " />)}
            </FormItem>
            <FormItem {...formItemLayout} label="% dịch vụ">
              {getFieldDecorator('servicerate', {
                rules: [
                  {
                    required: true,
                    message: 'Bắt buộc ',
                  },
                ],
              })(<Input placeholder=" " />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Trạng thái">
               {getFieldDecorator('status', {
                    initialValue:status
                }) (<Select
                    size="large"
                    onChange={this.changeStatus}
                    style={{ width: '60%' }}
                    disabled
                  >
                    <Option value="pending">Chờ</Option>
                    <Option value="paid">Đã mua</Option>
              </Select>)}
            </FormItem>
            <FormItem {...formItemLayout} label="Ghi chú">
              {getFieldDecorator('comment', {
                
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder=" "
                  rows={4}
                />
              )}
            </FormItem>
            
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Lên Đơn
              </Button>
              <Button style={{ marginLeft: 8 }}>Huỷ</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OrderForm;
