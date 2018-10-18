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
var currencyFormatter = require('currency-formatter');
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
class CurrencyForm extends PureComponent {
    state={
        defaultCurrency:'USD',
        currencyRate:{USD: '24500',
                     EUR: '29500',
                     JPY: '211.50',
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
  handleChangeCurrency = (e)=>{
      this.setState({
          defaultCurrency:e
      })
  }
  handleUpdate = e=>{
    const { dispatch, form } = this.props;
    
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        dispatch({
          type: 'order/saveCurrencyRaito',
          payload: values,
        });
      }
    });
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
        type: 'order/fetchRaito',
        payload:{},
    })
  }
  componentDidUpdate(){
      
  }
  componentWillUnmount(){
    window.onbeforeunload = null;
  }
  
  render() {
    const { submitting, order } = this.props;
      
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
     
    let ls=[];
    let list=[];
    const { defaultCurrency } = this.state;
    if(order.currency){
        order.currency.raito.forEach(function(e){
            ls.push(<Option value={e.currency} key={e.currency}>{e.currency}</Option>);
            list[[e.currency]]=e.raito;
        });
    }
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
        title="Tỷ giá"
      >
        <Card bordered={false}>
          <Form  hideRequiredMark style={{ marginTop: 8 }}>
            <Row>
                <Col xs={{ span: 24, offset: 0 }} sm={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Tiền">
                      {getFieldDecorator('currency', {
                        rules: [
                          {
                            required: true,
                            message: ' ',

                          },
                        ],
                        initialValue:defaultCurrency,             
                        onChange:this.handleChangeCurrency 
                      })(<Select>{ls}</Select>)}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col xs={{ span: 24, offset: 0 }} sm={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Tỷ giá">
                      {getFieldDecorator('raito', {
                        rules: [
                          {
                            required: true,
                            message: ' ',

                          },
                        ],
                         initialValue:list[defaultCurrency], 
                      })(<Input placeholder=" " addonAfter="VND" />)}
                    </FormItem>
                </Col>
            </Row>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="button" loading={submitting} onClick={(e)=>{this.handleUpdate(e)}} >
                Cập nhập
              </Button>
              <Button style={{ marginLeft: 8 }}>Huỷ</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default CurrencyForm;
