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
  Row, 
  Col    
} from 'antd';
import {isDirty} from 'redux-form';
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
        status:'pending',
        currency: 'USD',
        surcharge: 'USD',
        price:0,
        currencyRate:{USD: '24500',
                     EUR: '29500',
                     JPY: '2111',
                     GBP: '33000'}
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
  changeCurrency = e =>{
      this.setState({
          currency: e,
      })
  }
  changeSurcharge =e=>{
      this.setState({
          surcharge: e,
      })
  }
  componentDidMount() {
    const { dispatch } = this.props;
      
    dispatch({
      type: 'order/generateBillCode',
      payload: {},
    });
    
  }
  componentDidUpdate(){
      
      const {currency,surcharge,currencyRate} = this.state;
      
      let web_price=this.props.form.getFieldValue('web_price');
      let sale=this.props.form.getFieldValue('sale');
      let servicerate=this.props.form.getFieldValue('servicerate');
      let amount=this.props.form.getFieldValue('amount');
      let fsurcharge=this.props.form.getFieldValue('surcharge');
      let deliveryprice=this.props.form.getFieldValue('deliveryprice');
      let shipWeb=this.props.form.getFieldValue('shipWeb');
      
      let _web_price=Number.isNaN(web_price) ? 0 : parseInt(web_price);
      let _sale=Number.isNaN(sale) ? 0 : parseInt(sale);
      let _servicerate=Number.isNaN(servicerate) ? 0 : parseFloat(servicerate);
      let _amount=Number.isNaN(amount) ? 0 : parseFloat(amount);
      let _surcharge=Number.isNaN(fsurcharge) ? 0 : parseFloat(fsurcharge);
      let _deliveryprice=Number.isNaN(deliveryprice) ? 0 : parseFloat(deliveryprice);
      let _shipWeb=Number.isNaN(shipWeb) ? 0 : parseFloat(shipWeb);
      
      let price=0;
      _web_price= Number.isNaN(_web_price) ? 0 : _web_price
      _sale= Number.isNaN(_sale) ? 0 : _sale
      _servicerate= Number.isNaN(_servicerate) ? 0 : _servicerate
      _amount= Number.isNaN(_amount) ? 1 : _amount
      _surcharge= Number.isNaN(_surcharge) ? 0 : _surcharge
      _deliveryprice= Number.isNaN(_deliveryprice) ? 1 : _deliveryprice
      _shipWeb= Number.isNaN(_shipWeb) ? 1 : _shipWeb
      
      //console.log(_web_price,_sale,_servicerate,_amount)
      
      
      let j=_web_price*((100-_sale)/100)*((100+_servicerate)/100)*_amount;
      
      let s=parseInt(currencyRate[currency])*j;
      let a=parseInt(currencyRate[surcharge])*_surcharge;
      let i=_deliveryprice*250000;
      let e=parseInt(currencyRate[currency])*_shipWeb
      
      price=s+a+i+e;
      
      this.setState({
          price: price
      });
      
  }
  componentWillUnmount(){
    window.onbeforeunload = null;
  }

  render() {
    const { submitting, order } = this.props;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const {status, currency,surcharge,price} = this.state;
    let bill_code=order.billcode;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 15 },
      },
    };
    const formItemLayoutCurrencyLeft={
        labelCol: {
            xs: { span: 24 },
            sm: { span: 12 },
          },
          wrapperCol: {
            xs: { span: 12 },
            sm: { span: 12 },
            md: { span: 12 },
          },
    }
    const formItemLayoutCurrencyRight={
        labelCol: {
            xs: { span: 24 },
            sm: { span: 9 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 },
            md: { span: 24 },
          },
    }
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
            <Row>
                <Col xs={{ span: 24, offset: 0 }} sm={{ span: 12, offset: 0 }}>
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
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
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
                </Col>
                <Col md={{ span: 12, offset: 0 }}>
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
                </Col>
            </Row>
            
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
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
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Email">
                      {getFieldDecorator('email', {

                      })(<Input placeholder=" " />)}
                    </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
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
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
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
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
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
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Màu">
                      {getFieldDecorator('color', {

                      })(<Input placeholder="Color" />)}
                    </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Size">
                      {getFieldDecorator('size', {

                      })(<Input placeholder="Size" />)}
                    </FormItem>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
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
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <Row>
                        <Col md={{ span: 18, offset: 0 }}>
                            <FormItem {...formItemLayoutCurrencyLeft} label="Giá web">
                              {getFieldDecorator('web_price', {

                              })(<Input placeholder="Giá web" />)}
                            </FormItem>
                        </Col>
                        <Col md={{ span: 5, offset: 1 }}>
                            <FormItem {...formItemLayoutCurrencyRight}>
                               {getFieldDecorator('currency', {
                                    initialValue:currency
                                }) (<Select
                                    onChange={this.changeCurrency}
                                  >
                                    <Option value="USD">USD</Option>
                                    <Option value="GBP">GBP</Option>
                                    <Option value="EUR">EUR</Option>
                                    <Option value="JPY">JPY</Option>
                                </Select>)}
                            </FormItem> 
                        </Col>    
                    </Row>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Sale">
                      {getFieldDecorator('sale', {
                        rules: [
                          {
                            required: true,
                            message: ' ',
                          },
                        ],
                      })(<Input placeholder="sale" addonAfter="%" />)}
                    </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <Row>
                        <Col md={{ span: 18, offset: 0 }}>
                            <FormItem {...formItemLayoutCurrencyLeft} label="Ship Web">
                              {getFieldDecorator('shipWeb', {
                              })(<Input placeholder=" " />)}
                            </FormItem>
                        </Col>
                        <Col md={{ span: 5, offset: 1 }}>
                            <FormItem {...formItemLayoutCurrencyRight}>
                               {getFieldDecorator('currency', {
                                    initialValue:currency
                                }) (<Select
                                    onChange={this.changeCurrency}
                                  >
                                    <Option value="USD">USD</Option>
                                    <Option value="GBP">GBP</Option>
                                    <Option value="EUR">EUR</Option>
                                    <Option value="JPY">JPY</Option>
                                </Select>)}
                            </FormItem> 
                        </Col>    
                    </Row>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                     
                    <Row>
                        <Col md={{ span: 18, offset: 0 }}>
                            <FormItem {...formItemLayoutCurrencyLeft} label="Phụ thu">
                              {getFieldDecorator('surcharge', {
                                rules: [
                                  {
                                    required: true,
                                    message: ' ',
                                  },
                                ],
                              })(<Input placeholder="Phụ thu" />)}
                            </FormItem>
                        </Col>
                        <Col md={{ span: 5, offset: 1 }}>
                            <FormItem {...formItemLayoutCurrencyRight}>
                               {getFieldDecorator('ssurcharge', {
                                    initialValue:surcharge
                                }) (<Select
                                    onChange={this.changeSurcharge}
                                  >
                                    <Option value="USD">USD</Option>
                                    <Option value="GBP">GBP</Option>
                                    <Option value="EUR">EUR</Option>
                                    <Option value="JPY">JPY</Option>
                                </Select>)}
                            </FormItem> 
                        </Col>    
                    </Row>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Tỷ giá báo khách">
                      {getFieldDecorator('rate', {
                      })(<Input placeholder=" " addonAfter="VND" />)}
                    </FormItem>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                <FormItem {...formItemLayout} label="Vận chuyển báo khách">
                  {getFieldDecorator('deliveryprice', {

                  })(<Input placeholder=" " addonAfter="Kg" />)}
                </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12 , offset: 0}}>
                    <FormItem {...formItemLayout} label="% dịch vụ">
                      {getFieldDecorator('servicerate', {
                        rules: [
                          {
                            required: true,
                            message: 'Bắt buộc ',
                          },
                        ],
                      })(<Input placeholder=" " addonAfter="%" />)}
                    </FormItem>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Giá báo khách">
                      {getFieldDecorator('price', {
                        rules: [
                          {
                            required: true,
                            message: ' ',
                          },
                        
                        ],
                        initialValue:price
                      })(<Input placeholder=" " addonAfter="VND" />)}
                    </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Đặt cọc">
                      {getFieldDecorator('deposit', {

                      })(<Input placeholder=" "  addonAfter="VND"/>)}
                    </FormItem>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Cần thu">
                      {getFieldDecorator('realpayprice', {
                        rules: [
                          {
                            required: true,
                            message: ' ',
                          },
                        ],
                      })(<Input placeholder=" " addonAfter="VND"/>)}
                    </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
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
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
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
                </Col>
            </Row>
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
