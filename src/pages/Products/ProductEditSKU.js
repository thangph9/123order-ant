import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { change_alias,encodeVI } from '@/utils/utils';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
var currencyFormatter = require('currency-formatter');
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown, 
  Menu,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
  Upload,
  message,
  TreeSelect,
  Affix,
  Popover,
  Table,    
  InputNumber,
  Tag,
  Divider,
  Tooltip
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './styles.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const {RangePicker} = DatePicker;
const { Search, TextArea } = Input;
const TreeNode = TreeSelect.TreeNode;


@connect(({ list, loading,product,order,category }) => ({
    list,
    loading: loading.models.product,
    product,
    order,
    category
}))
@Form.create()
class ProductEditSKU extends PureComponent {
    state={
        fileList: [],
    }
componentDidMount(){
     const {dispatch} = this.props;
     dispatch({
        type: 'order/fetchRaito',
        payload:{},
    })
     dispatch({
        type: 'category/treemap',
        payload:{},
    })
}
formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
render() {
    const {
      loading, 
      order,    
      product: { data },
      category: { treeMap }  
    } = this.props;
    const {
      form: { getFieldDecorator,getFieldValue },form
    } = this.props;
    const { fileList } = this.state;
    const uploadButton = (
      <div>  
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const uploadThumb = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    let image='';
    let thumbnail='';
    let imageUrl='';
return (  
      <PageHeaderWrapper> 
        <Form onSubmit={this.handleSubmit} className="login-form">
            <Affix offsetTop={10}>
                <FormItem>
                    <Button type="primary" htmlType="submit" loading={loading}>Thêm mới</Button>
                </FormItem>
            </Affix>
            
    
    
             <Row>
                <Col md={12}>
                   <FormItem label="Giá"  {...this.formLayout}>
                        {getFieldDecorator('sale_price', {
                        })(<Input />)}
                    </FormItem>        
                </Col>
                <Col md={12}>
                    <FormItem label="Số lượng"  {...this.formLayout}>
                        {getFieldDecorator('amount', {
                            
                        })(<Input />)}
                    </FormItem>
                 </Col> 
            </Row>
            <Row>
                <Col md={12}>
                      <FormItem label="Trạng thái"  {...this.formLayout}>
                        {getFieldDecorator('stock', {
                            
                        })(<Select>
                           <SelectOption value="1">Còn hàng</SelectOption>
                           <SelectOption value="0">Hết hàng</SelectOption>
                           </Select>)}
                    </FormItem>
                </Col>
                <Col md={12}>
                    <FormItem label="Color"  {...this.formLayout}>
                        {getFieldDecorator('color', {
                            
                        })(<Input />)}
                    </FormItem>
                 </Col> 
            </Row>
            <Row>
                <Col md={12}>
                      <FormItem label="Size"  {...this.formLayout}>
                        {getFieldDecorator('size', {
                            
                        })(<Input />)}
                    </FormItem>
                </Col>
                <Col md={12}>
                    <FormItem label="Style"  {...this.formLayout}>
                        {getFieldDecorator('style', {
                            
                        })(<Input />)}
                    </FormItem>
                 </Col> 
                
            </Row>
            <Row>
                <Col md={12}>
                      
                </Col>
                <Col md={12}>
                 </Col> 
                
            </Row>                
            <Row>
                <Col md={12}>
                    <FormItem label="Ảnh đại diện" {...this.formLayout}>
                         <Upload
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="/api/upload/thumb/"
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleChangeThumb}
                                      >
                                {imageUrl ? <img src={imageUrl} alt="Thumbnail" style={{width: '120px'}}/> : uploadThumb}
                         </Upload>
                    </FormItem>  
                </Col>
                <Col md={12}>
                    <FormItem label="Hình ảnh" {...this.formLayout}>
                         <Upload
                             action="/api/upload/"
                             listType="picture-card"
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                            onRemove={this.handleRemove}
                            multiple
                        >
                        {(fileList.length > 15) ? null : uploadButton}
                        </Upload>
                    </FormItem>  
                </Col>        
            </Row>
                        
            <Row>
                <Col md={12}>
                <FormItem  {...this.formLayout}>
                            {getFieldDecorator('images', {
                              initialValue: image
                            })(
                              <Input type="hidden" />
                            )}
                          </FormItem>
                </Col>  
                <Col md={12}>
                        <FormItem  {...this.formLayout}>
                            {getFieldDecorator('thumbnail', {
                              initialValue: thumbnail
                            })(
                              <Input type="hidden" />
                            )}
                          </FormItem>
            </Col>
            </Row>            
            <FormItem>
                    <Button type="primary" htmlType="submit" loading={loading}>Thêm mới</Button>
            </FormItem>
            </Form> 
      </PageHeaderWrapper>
    );
  }
}

export default ProductEditSKU;
