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
import styles from './style.less';

@Form.create()
class ModalViewOrder extends PureComponent{
    constructor(props){
        super(props);
        this.state={
            visible: this.props.visible,
        }
    }
    
    handleCancel=()=>{
        this.setState({ loading: true });
        setTimeout(() => {
          this.setState({ loading: false, visible: false });
        }, 3000);
    }
    
    handleUpdate=()=>{
        const { form, handleUpdate } = this.props;
        const { formVals: oldValue } = this.state;
        
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          const formVals = { ...oldValue, ...fieldsValue };
          this.setState(
            {
              formVals,
            },
            handleUpdate(formVals),
          );
        });
    }
    componentDidMount(){
        
        this.setState({
            visible:this.props.visible
        })
    }
    componentWillUpdate(){
        
    }
    render(){
        const {modalVisible, handleUpdateModalVisible , selectedRow} = this.props;
        const { form: { getFieldDecorator} } = this.props;
        
        const {
              loading,
              order,
            } = this.props;
        let ls=[];
        let list=[];
        if(order.currency){
            order.currency.raito.forEach(function(e){
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
                                    initialValue:selectedRow.fwebprice  
                              })(<Input placeholder="Giá web" />)}
                            </FormItem>
                        </Col>
                        <Col md={{ span: 5, offset: 1 }}>
                            <FormItem {...formItemLayoutCurrencyRight}>
                               {getFieldDecorator('scurrency', {
                                    initialValue:selectedRow.scurrency
                                }) (<Select
                                    onChange={this.changeCurrency}
                                  >
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
                              {getFieldDecorator('shipWeb', {
                              })(<Input placeholder=" " />)}
                            </FormItem>
                        </Col>
                        <Col md={{ span: 5, offset: 1 }}>
                            <FormItem {...formItemLayoutCurrencyRight}>
                               { getFieldDecorator('scurrency', {
                                    initialValue:selectedRow.scurrency
                                }) (<Select
                                    onChange={this.changeCurrency}
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
                                    initialValue:selectedRow.scurrency
                                }) (<Select
                                    onChange={this.changeSurcharge}
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
                            initialValue:selectedRow._exchangerate
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
                        initialValue:selectedRow._price,
                        onChange: this.handleFormatCurrency
                      })(<Input placeholder=" " addonAfter="VND"  />)}
                    </FormItem>
                </Col>  
            </Row>
            <Row>
                <Col md={{ span: 12, offset: 0 }}>
                    <FormItem {...formItemLayout} label="Đặt cọc">
                      {getFieldDecorator('fdeposit', {
                         initialValue:selectedRow._deposit,   
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
                        initialValue:selectedRow._realpayprice
                      })(<Input placeholder=" " addonAfter="VND"/>)}
                    </FormItem> 
                </Col>  
            </Row>
            <Row>
                    <Col md={{ span: 12, offset: 0 }}>
                            <FormItem {...formItemLayout} label="Trạng thái">
                               {getFieldDecorator('scurrency', {
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

