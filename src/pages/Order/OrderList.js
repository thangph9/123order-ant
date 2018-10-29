import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Alert,
  Calendar,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  Popconfirm,    
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table    
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ModalViewOrder from '@/components/Modal/ModalViewOrder';
var currencyFormatter = require('currency-formatter');
import styles from './OrderList.less';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});


@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    if (currentStep === 1) {
      return [
        <FormItem key="target" {...this.formLayout} label="监控对象">
          {form.getFieldDecorator('target', {
            initialValue: formVals.target,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">表一</Option>
              <Option value="1">表二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="template" {...this.formLayout} label="规则模板">
          {form.getFieldDecorator('template', {
            initialValue: formVals.template,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">规则模板一</Option>
              <Option value="1">规则模板二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="type" {...this.formLayout} label="规则类型">
          {form.getFieldDecorator('type', {
            initialValue: formVals.type,
          })(
            <RadioGroup>
              <Radio value="0">强</Radio>
              <Radio value="1">弱</Radio>
            </RadioGroup>
          )}
        </FormItem>,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="time" {...this.formLayout} label="开始时间">
          {form.getFieldDecorator('time', {
            rules: [{ required: true, message: '请选择开始时间！' }],
          })(
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
            />
          )}
        </FormItem>,
        <FormItem key="frequency" {...this.formLayout} label="调度周期">
          {form.getFieldDecorator('frequency', {
            initialValue: formVals.frequency,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="month">月</Option>
              <Option value="week">周</Option>
            </Select>
          )}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="name" {...this.formLayout} label="规则名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入规则名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="规则描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="规则配置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="配置规则属性" />
          <Step title="设定调度周期" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

/* Edit cell========== */
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  state = {
    editing: false,
    type: 'input',
    status:'',
      
  }
  
  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    const {record , dataIndex}=this.props;
    let status=record[dataIndex] ;
    this.setState({ editing,status}, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }
  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const { record, handleSave, type } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }
  changeStatus = value =>{
      this.setState({status: value});
  }
  getType = () => {
    const {type, editable} = this.props;    
    switch (type) {
         case "select":
            return <Select
                    size="large"
                    onChange={this.changeStatus}
                    style={{width:'100%'}}
                    ref={node => (this.input = node)}
                    onPressEnter={this.save}
                  >
                    <Option value="pending">Chờ</Option>
                    <Option value="paid">Đã mua</Option>
                    <Option value="cancel">Cancel</Option>
              </Select>;     

        default:
            return <Input ref={node => (this.input = node)}
                                    onPressEnter={this.save}/>;    
        }
   }
  render() {
    const { editing,status } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      type,    
      ...restProps
      
    } = this.props;
      let typeData;
      if(editable){
          if(type==='select'){
              typeData=status;
          }else{
              typeData=record[dataIndex];
          }
          
      }
    
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? 
                  (<FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: /*${title}*/ 'is required.',
                      }],
                      initialValue: typeData,
                    })(this.getType())}
                  </FormItem>)
                 : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

@Form.create()
class ModalEditForm extends PureComponent{
    constructor(props){
        super(props);
        const {order} = this.props;
        let rate=[];
        if(order){
            order.raito.forEach(function(e){
                rate[[e.currency]]=e.raito;
            });
        }
        const { selectedRow } = this.props;
        this.state={
            status:'pending',
            currency: 'USD',
            surcharge: 'USD',
            price: selectedRow._price,
            deposit:selectedRow._deposit,
            payprice: selectedRow._realpayprice,
            changePrice: false,
            locale:{
                  'USD':'en-US',
                  'GBP':'en-GB',
                  'VND':'vi-VN',
                  'JPY':'ja-JP',
                  'EUR':'de-DE',
            },
        }
    }
    
    handleCancel=()=>{
        this.setState({ loading: true });
        setTimeout(() => {
          this.setState({ loading: false, visible: false });
        }, 3000);
    }
    changeCurrency=(e)=>{
        const {rate} = this.state;
        const { form } = this.props;
        this.setState({
            currency: e,
        }) 
    } 
    handleUpdate=()=>{
        const { form, handleUpdate } = this.props;
        const { formVals: oldValue,currency } = this.state;
        
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          const formVals = { ...oldValue, ...fieldsValue,currency };
          this.setState(
            {
              formVals,
            },
            handleUpdate(formVals),
          );
        });
    }
    componentDidMount(){
        
    }
    componentWillUpdate(){
      const {currency,surcharge,changePrice,locale} = this.state;
      
      let web_price=this.props.form.getFieldValue('fwebprice');
      let sale=this.props.form.getFieldValue('fsale');
      let servicerate=this.props.form.getFieldValue('fservicerate');
      let amount=this.props.form.getFieldValue('iquality');
      let fsurcharge=this.props.form.getFieldValue('fsurcharge');
      let deliveryprice=this.props.form.getFieldValue('fdeliveryprice');
      let shipWeb=this.props.form.getFieldValue('fshipweb');
      let deposit=this.props.form.getFieldValue('fdeposit');
      let rprice=this.props.form.getFieldValue('fprice'); 
      let fexchangerate=this.props.form.getFieldValue('fexchangerate');
      
      
      //let _web_price=Number.isNaN(web_price) ? 0 : parseInt(web_price);
      let _sale=Number.isNaN(sale) ? 0 : parseInt(sale);
      let _servicerate=Number.isNaN(servicerate) ? 0 : parseFloat(servicerate);
      let _amount=Number.isNaN(amount) ? 0 : parseFloat(amount);
      //let _surcharge=Number.isNaN(fsurcharge) ? 0 : parseFloat(fsurcharge);
      let _deliveryprice=Number.isNaN(deliveryprice) ? 0 : parseFloat(deliveryprice);
      //let _shipWeb=Number.isNaN(shipWeb) ? 0 : parseFloat(shipWeb);
      let _deposit=Number.isNaN(deposit) ? 0 : parseFloat(deposit);
      let _rprice=Number.isNaN(rprice) ? 0 : parseFloat(rprice);
      let _fexchangerate=Number.isNaN(fexchangerate) ? 0 : parseFloat(fexchangerate);
      
      
      
      
      //_web_price= Number.isNaN(_web_price) ? 0 : _web_price
      _sale= Number.isNaN(_sale) ? 0 : _sale
      _servicerate= Number.isNaN(_servicerate) ? 0 : _servicerate
      _amount= Number.isNaN(_amount) ? 1 : _amount
      //_surcharge= Number.isNaN(_surcharge) ? 0 : _surcharge
      _deliveryprice= Number.isNaN(_deliveryprice) ? 1 : _deliveryprice
      //_shipWeb= Number.isNaN(_shipWeb) ? 0 : _shipWeb
      _deposit= Number.isNaN(_deposit) ? 0 : _deposit
      _rprice= Number.isNaN(_rprice) ? 0 : _rprice
      let _rate= Number.isNaN(_fexchangerate) ? 1 : _fexchangerate
         
      let _web_price=currencyFormatter.unformat(web_price, { locale: locale[currency]})  
      let _surcharge=currencyFormatter.unformat(fsurcharge, { locale: locale[currency]})  
      let _shipWeb=currencyFormatter.unformat(shipWeb, { locale: locale[currency]}) 
      
      let price=0;
      
      let j=Number(_web_price)*((100-_sale)/100)*((100+_servicerate)/100)*_amount;
      
      let s=_rate*j;
      let a=_rate*_surcharge;
      let i=_deliveryprice;
      let e=_rate*_shipWeb;
      
        
      if (changePrice){
          price=_rprice;
      }else{
          price=s+a+i+e;
      }
      
      let payprice=0;
      _deposit= price*0.5; 
      payprice = price - _deposit;
        
      
      payprice=currencyFormatter.format(payprice, { locale: 'en-US' ,symbol: ''});
      price=currencyFormatter.format(price, { locale: 'en-US',symbol: '' });
      deposit=currencyFormatter.format(_deposit, { locale: 'en-US',symbol: '' });
      
        
      this.setState({
          price: price,
          payprice:payprice,
          deposit:deposit
      });
    }
    render(){
        const {modalVisible, handleUpdateModalVisible , selectedRow} = this.props;
        const { form: { getFieldDecorator} } = this.props;
        const {
              loading,
              order,
            } = this.props;
        const {price, payprice,deposit,currency} = this.state;
        let ls=[];
        let list=[];
        if(order){
            order.raito.forEach(function(e){
                ls.push(<Option value={e.currency} key={e.currency}>{e.currency}</Option>);
                list[[e.currency]]=e.raito;
            });
        }
        let lsStatus=[
                <Option key='pending' value="pending">Chờ</Option>,
                <Option key='paid' value="paid">Đã mua</Option>,                         
                <Option key='cancel' value="cancel">Cancel</Option>,                         
                <Option key='back' value="back">Back cọc</Option>,                         
                <Option key='tranfer' value="tranfer">Chuyển cọc</Option>,                         
                ]
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
        
        const footer=[
            <Button key="cancel" onClick={()=>{handleUpdateModalVisible()}}>Huỷ</Button>,
            <Button key="submit" type="primary" onClick={()=>{this.handleUpdate()}}>
              Cập nhập
            </Button>
          ];
                                         
        return (
        <Modal 
          title={selectedRow.sname}
          visible={modalVisible}
          width="80%"
          style={{ top: 20 }}
          zIndex="1001"    
          footer={footer}
          onCancel={()=>{handleUpdateModalVisible()}}
        >
        <div className="gutter-example">
          <Card bordered={false}>
          <Form  hideRequiredMark style={{ marginTop: 8 }}>
            <Row>
                <Col xs={{ span: 24, offset: 0 }} sm={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Mã Bill">
                      {getFieldDecorator('sbill_code', {
                        rules: [
                          {
                            required: true,
                            message: ' ',

                          },
                        ],
                        initialValue:selectedRow.sbill_code
                      })(<Input placeholder=" " disabled  />)}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('status', {
                        initialValue:selectedRow.status
                      })(<Input placeholder=" " disabled type="hidden" />)}
                    </FormItem>
                </Col>
            </Row>
             <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Tên khách hàng">
                      {getFieldDecorator('sname', {
                        rules: [
                          { 
                            required: true,
                            message: 'Nhập tên khách hàng',
                          },
                        ],
                        initialValue:selectedRow.sname
                      })(<Input placeholder="Tên khách hàng" />)}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('ddate', {
                        initialValue:selectedRow.ddate
                      })(<Input type="hidden"/>)}
                    </FormItem>
                </Col>
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Số điện thoại">
                      {getFieldDecorator('sphone', {
                        rules: [
                          {
                            required: true,
                            message: 'Nhập số điện thoại khách hàng',
                          },
                        ],
                        initialValue:selectedRow.sphone
                      })(<Input placeholder=" " />)}
                    </FormItem>
                </Col>
            </Row>   
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Địa chỉ">
                      {getFieldDecorator('saddress', {
                        rules: [
                          {
                            required: true,
                            message: 'Nhập địa chỉ khách hàng',
                          },
                        ],
                        initialValue:selectedRow.saddress
                      })(<Input placeholder=" " />)}
                    </FormItem>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Email">
                      {getFieldDecorator('semail', {
                            initialValue:selectedRow.semail
                      })(<Input placeholder=" " />)}
                    </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Link sp">
                      {getFieldDecorator('slinkproduct', {
                        rules: [
                          {
                            required: true,
                            message: 'Nhập link sản phẩm',
                          },
                        ],
                        initialValue:selectedRow.slinkproduct
                      })(<Input placeholder="Link sản phẩm" />)}
                    </FormItem>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Code sp">
                      {getFieldDecorator('scode', {
                        rules: [
                          {
                            required: true,
                            message: ' ',
                          },
                        ],
                        initialValue:selectedRow.scode
                      })(<Input placeholder="Mã sản phẩm " />)}
                    </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Tên sp">
                      {getFieldDecorator('snameproduct', {
                        rules: [
                          {
                            required: true,
                            message: 'Nhập tên sản phẩm',
                          },
                        ],
                        initialValue:selectedRow.snameproduct
                      })(<Input placeholder="Tên sản phẩm" />)}
                    </FormItem>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Màu">
                      {getFieldDecorator('scolor', {
                        initialValue:selectedRow.scolor
                      })(<Input placeholder="Color" />)}
                    </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Size">
                      {getFieldDecorator('ssize', {
                        initialValue:selectedRow.ssize
                      })(<Input placeholder="Size" />)}
                    </FormItem>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Số lượng">
                      {getFieldDecorator('iquality', {
                        rules: [
                          {
                            required: true,
                            message: ' ',
                          },
                        ],
                         initialValue:selectedRow.iquality                 
                      })(<Input placeholder="Số lượng" />)}
                    </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <Row>
                        <Col md={{ span: 18, offset: 0 }}>
                            <FormItem {...formItemLayoutCurrencyLeft} label="Giá web">
                              {getFieldDecorator('fwebprice', {
                                    initialValue:selectedRow._webprice  
                              })(<Input placeholder="Giá web" />)}
                            </FormItem>
                        </Col>
                        <Col md={{ span: 5, offset: 1 }}>
                            <FormItem {...formItemLayoutCurrencyRight}>
                               {getFieldDecorator('scurrency', {
                                    initialValue:selectedRow.scurrency,   
                                    onChange: this.changeCurrency
                                }) (<Select >
                                    {ls}
                                </Select>)}
                            </FormItem> 
                        </Col>    
                    </Row>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Sale">
                      {getFieldDecorator('fsale', {
                        rules: [
                          {
                            required: true,
                            message: ' ',
                          },
                        ],
                          initialValue: selectedRow.fsale        
                      })(<Input placeholder="sale" addonAfter="%" />)}
                    </FormItem>
                </Col>  
            </Row>  
             <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <Row>
                        <Col md={{ span: 18, offset: 0 }}>
                            <FormItem {...formItemLayoutCurrencyLeft} label="Ship Web">
                              {getFieldDecorator('fshipweb', {
                                initialValue:selectedRow._shipweb,  
                              })(<Input placeholder=" " />)}
                            </FormItem>
                        </Col>
                        <Col md={{ span: 5, offset: 1 }}>
                            <FormItem {...formItemLayoutCurrencyRight}>
                               { getFieldDecorator('scurrency', {
                                    initialValue:selectedRow.scurrency
                                }) (<Select
                                    onChange={this.changeCurrency} disabled
                                  > 
                                    {ls}
                                </Select>)}
                            </FormItem> 
                        </Col>    
                    </Row>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                     
                    <Row>
                        <Col md={{ span: 18, offset: 0 }}>
                            <FormItem {...formItemLayoutCurrencyLeft} label="Phụ thu">
                              {getFieldDecorator('ssurcharge', {
                                rules: [
                                  {
                                    message: ' ',
                                  },
                                ],
                                initialValue:selectedRow.ssurcharge
                              })(<Input placeholder="Phụ thu" />)}
                            </FormItem>
                        </Col>
                        <Col md={{ span: 5, offset: 1 }}>
                            <FormItem {...formItemLayoutCurrencyRight}>
                               {getFieldDecorator('scurrency', {
                                    initialValue:selectedRow._surcharge
                                }) (<Select
                                    onChange={this.changeCurrency} disabled
                                  >
                                    {ls}
                                </Select>)}
                            </FormItem> 
                        </Col>    
                    </Row>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Tỷ giá báo khách">
                      {getFieldDecorator('fexchangerate', {
                            initialValue:list[currency]
                      })(<Input placeholder=" " addonAfter="VND" disabled />)}
                    </FormItem>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                <FormItem {...formItemLayout} label="Vận chuyển báo khách">
                  {getFieldDecorator('fdeliveryprice', {
                        initialValue:selectedRow._deliveryprice
                  })(<Input placeholder=" " addonAfter="VND"  />)}
                </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12 , offset: 0}}>
                    <FormItem {...formItemLayout} label="% dịch vụ">
                      {getFieldDecorator('fservicerate', {
                        rules: [
                          {
                            required: true,
                            message: 'Bắt buộc ',
                          },
                        ],
                        initialValue:selectedRow.fservicerate
                      })(<Input placeholder=" " addonAfter="%" />)}
                    </FormItem>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Giá báo khách">
                      {getFieldDecorator('fprice', {
                        rules: [
                          {
                            required: true,
                            message: ' ',
                          },
                        
                        ],
                        initialValue:price,
                        onChange: this.handleFormatCurrency
                      })(<Input placeholder=" " addonAfter="VND"  />)}
                    </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Đặt cọc">
                      {getFieldDecorator('fdeposit', {
                         initialValue:deposit,   
                      })(<Input placeholder=" "  addonAfter="VND"/>)}
                    </FormItem>
                </Col>  
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Cần thu">
                      {getFieldDecorator('frealpayprice', {
                        rules: [
                          {
                            required: true,
                            message: ' ',
                          },
                        ], 
                        initialValue:payprice
                      })(<Input placeholder=" " addonAfter="VND"/>)}
                    </FormItem> 
                </Col>  
            </Row>
            <Row>
                    <Col md={{ span: 12, offset: 0 }}>
                            <FormItem {...formItemLayout} label="Trạng thái">
                               {getFieldDecorator('sstatus', {
                                    initialValue:selectedRow.sstatus
                                }) (<Select disabled
                                    style={{width:'60%'}}
                                  >
                                    {lsStatus}
                                </Select>)}
                            </FormItem> 
                        </Col> 
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Ghi chú">
                      {getFieldDecorator('scomment', {
                            initialValue:selectedRow.scomment,
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
        </Form>            
        </Card> 
        </div>
        </Modal>  
           
        );
    }
}

/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading,order }) => ({
  rule,
  loading: loading.models.order,
  order,
}))
@Form.create()
class OrderList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    visibleFullScreenTable: false,
    expandForm: false,
    selectedRows: [],
    selectedRow:{},
    formValues: {},
    edit:false,
    stepFormValues: {},
    data:{
        list:[],
        pagination:{},
    },
    visible: false,  
    statusText:{
      pending  :'Chờ',
      paid      :'Đã mua',
      cancel    :'Cancel',
      back      :'Back cọc',
      tranfer   :'Chuyển cọc'   
    }
  };  
   
  
  columns = [
    {
        title: 'Mã Bill',
        dataIndex: 'sbill_code',
        width: 100,
        fixed: 'left'
    },   
    {
        title: 'Ngày',
        dataIndex: 'ddate',
        width: 150,
        fixed: 'left',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
        title: 'Tên Khách',
        dataIndex: 'sname',
        key: 'sname',
        width: 150,
        fixed: 'left',
    },
      
    {
        title: 'Số điện thoại',
        dataIndex: 'sphone',
        key: 'sphone',
        width: 150,
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'saddress',
        key: 'saddress',
        width: 150,
    },
    {
        title: 'Email',
        dataIndex: 'semail',
        width: 250,
        key:'semail',
    },
    {
        title: 'Code SP',
        dataIndex: 'scode',
        width: 150,    
        key:'scode',
    },
    {
        title: 'Link SP',
        dataIndex: 'slinkproduct',
        key:'slinkproduct',
        render: (text, record) => (
             <a href={text} target="_blank">Link sản phẩm</a>
      ),
        width: 150,
    },
    {
        title: 'Tên SP',
        dataIndex: 'snameproduct',
        key:'snameproduct',
        width: 150,
        render: (text, record) => (
             <span>{(text) ? text.substring(0,10)+" ..." : '' }</span>
        ),
    },  
    {
        title: 'Size',
        dataIndex: 'ssize',
        key:'ssize',
        width: 150,
    },
    
    
    {
        title: 'Màu',
        dataIndex: 'scolor',
        key: 'scolor',
        width: 150,
        render: (text, record) => (
             <span>{(text) ? text.substring(0,10)+" ..." : ''}</span>
        ),
    },
    {
        title: 'SL',
        dataIndex: 'iquality',
        key: 'iquality',
        width: 150,
    },
    {
        title: 'Giá WEB',
        dataIndex: '_webprice',
        key: '_webprice',
        width: 150,
    }, 
    {
        title: 'Sale',
        dataIndex: '_sale',
        key: '_sale',
        width: 150,
    },
      {
        title: 'Ship Web',
        dataIndex: '_shipweb',
        key: '_shipweb',
        width: 150,
    },
    {
        title: 'Tỷ giá báo khách',
        dataIndex: '_exchangerate',
        key: '_exchangerate',
        width: 150,
    },
    {
        title: '% dịch vụ',
        dataIndex: '_servicerate',
        key: '_servicerate',
        width: 150,
    },
    {
        title: 'Giá báo khách',
        dataIndex: '_price',
        key: '_price' ,
        width: 150,
    },
      {
        title: 'Đặt cọc',
        dataIndex: '_deposit',
        key: '_deposit',
        width: 150,
    },
    {
        title: 'Cần thu',
        dataIndex: '_realpayprice',
        key: '_realpayprice',
        width: 150,
    },
    {
        title: 'Vận chuyển thực tế',
        dataIndex: '_deliveryprice',
        key: '_deliveryprice',
        width: 150,
    },
    {
        title: 'Vận chuyển báo khách',
        dataIndex: '_delivery',
        key: '_delivery',
        width: 150,
    },
    {
        title: 'Người lên đơn',
        dataIndex: 'semployee',
        key: 'semployee',
        width: 150,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'sstatus',
        key: 'sstatus',
        width: 150,
        render: (text, record) => {
           return (<span>{this.state.statusText[text]}</span>)  
        },
    },
    {
        title: 'Tình trạng',
        dataIndex: '_status',
        key: '_status',
        width: 150,
        
    },
    {
        title: 'Ghi chú',
        dataIndex: 'scomment',
        key: 'scomment',
        width: 150,
        render: (text, record) => (
             <span>{(text) ? text.substring(0,10)+" ..." : ''}</span>
        ),
    },
      /* 
    {
      title: ' ', 
      width: 50,
      fixed: 'right',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="Sure to delete?" onConfirm={()=>this.handleDelete(record.sbill_code)}>
          <a href="javascript:;">x</a>
        </Popconfirm>
        </Fragment>
        
      ),
    },*/
  ];
  
  componentDidMount() {  
    
    const { dispatch } = this.props;  
    let from=moment().format('YYYY/MM/DD');
    let to=moment().format('YYYY/MM/DD');
    const values={
        from,
        to
    } 
    this.setState({
        from,
        to
    })
    dispatch({
        type: 'order/fetch',
        payload:values,
    })   
    dispatch({
        type: 'order/fetchRaito',
        payload:{},
    })
  }
  componentWillUpdate(){
      //console.log(this.props);
      
      
      
  }
            
  handleUpdateOrder = (e) =>{
      const {dispatch,form}=this.props;
      form.validateFields((err, fieldsValue) => {
          if (err) return; 
          /*
          this.setState({
              changeStatus: false,
          })  
          
          dispatch({
                type: 'order/editCeil',
                payload:{...fieldsValue},  
            }
          )  */    
        });
  }            
  handleDelete=(row)=>{
      const { dispatch } = this.props;
      dispatch({
        type: 'order/deleteRow',
        payload:row,  
    }) 
    
  }
  handleChange=(e,value)=>{
      //
      value.sstatus=e;
      this.handleSave(value);
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues,from,to } = this.state;
    
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
      
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
        from,
        to
    };
    console.log(formValues);
    if (sorter.field) {
      params.sorter = sorter.field+"_"+sorter.order;
    }
    
    dispatch({
      type: 'order/fetch', 
      payload: params,
    });
  };
  handleSave=(row)=>{
      const { dispatch } = this.props;
      
      dispatch({
          type:'order/saveOrder',
          payload:{
              ...row
          }
      });
      
      
  }
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows,flag) => {
    this.setState({
      selectedRows: rows,
        
    });
  };
  handleRowSelect = (row,flag) =>{
      this.setState({
          modalVisible: true,  
          selectedRow:row,
        });
       
  }
  handleHeaderRow = (e)=>{
      this.setState({
          visibleFullScreenTable: true,
        });
  }
  
  handleSearch = e => {
    e.preventDefault();
    const { from,to } =this.state;  
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return; 
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        from,
        to
      };
 
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'order/fetch',
        payload: values,
      });
    });
  };


  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };
 
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'order/saveOrder',
      payload: {
        ...fields
      },
    });
    this.handleUpdateModalVisible();
  };
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  
  handleFullScreenTableOk= (e)=>{
    this.setState({
        visibleFullScreenTable: false,
    });
  }
  handleFullScreenTableCancel= (e)=>{
    this.setState({
        visibleFullScreenTable: false,
    });
  }
  onChangeRangPicker =(e)=>{  
      const { formValues } = this.state;
      const { dispatch, form } = this.props;
      if(e.length>0){
          
          let from=e[0].format('YYYY/MM/DD');
          let to=e[1].format('YYYY/MM/DD');
          this.setState({
              from:from,
              to:to
          })
          let values={
              ...formValues,
              from,
              to
          }
          dispatch({
            type: 'order/fetch',
            payload: values,
          });
      }
       
  }  
  renderSimpleForm() {
    const {    
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Tên khách hàng">
              {getFieldDecorator('name')(<Input placeholder="" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Số điện thoại">
              {getFieldDecorator('phone')(
                <Input placeholder="" />
              )}
            </FormItem>
          </Col> 
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                Tìm kiếm
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}> 
        </Row>
    );
  }
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;  
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          type:col.type,
        }),
      };
    });
    
      
    const {
      order: { data },
      loading,
      order
    } = this.props;
    const { selectedRows, modalVisible,selectedRow,statusText,edit } = this.state;

      
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const viewMethods={
        handleModalVisible: this.handleModalVisible,
    };
    let showUpdateForm=false;
    if(selectedRow.sstatus=='pending' && selectedRow.status=='processing' )  {
      showUpdateForm=true;
    }
    return (
      <PageHeaderWrapper title="Danh sách đơn đặt hàng">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              components={components}
              data={data}
              rowKey="sbill_code"
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              onRowSelect={this.handleRowSelect}
              onHeaderRow={this.handleHeaderRow}
              onChangeRangPicker={this.onChangeRangPicker}
            />
          </div>
        </Card>
        <Modal
          visible={this.state.visibleFullScreenTable}
          onOk={this.handleFullScreenTableOk}
          onCancel={this.handleFullScreenTableCancel}
          width="100%"
          style={{ top: 10 }}
          zIndex="1000"
        > 
        <div className={styles.tableListForm}>{this.renderForm()}</div>      
        <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              components={components}
              data={data}
              rowKey="sbill_code"
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              onRowSelect={this.handleRowSelect}
              onHeaderRow={this.handleHeaderRow}
              onChangeRangPicker={this.onChangeRangPicker}
            />
        </Modal>   
        { (showUpdateForm) ? (<ModalEditForm selectedRow={selectedRow} modalVisible={modalVisible} order={order.currency} {...updateMethods} />) : (<ModalViewOrder ModalEditForm selectedRow={selectedRow} modalVisible={modalVisible} order={order.currency} {...viewMethods}/>)
      
        }
        
        
      </PageHeaderWrapper>
    );
  }
}

export default OrderList;
