import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { change_alias } from '@/utils/utils';
import { Editor } from 'react-draft-wysiwyg';
var currencyFormatter = require('currency-formatter');
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
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
  InputNumber
    
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './ProductDetail.less';

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
class ProductDetail extends PureComponent {
  state = { visible: false, done: false ,pageSize: 10,current: 1 ,
           previewVisible: false,
            previewImage: '',
            fileList: [],
           editorState: EditorState.createEmpty(),
           editorStateDetail: EditorState.createEmpty(),
           editorStateCSD: EditorState.createEmpty(),
           editorStateSizeDesc: EditorState.createEmpty(),
           imageUrl:'',
           nodeid: undefined,
           seo_link:'',
           currency: 'USD'
          };
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
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  handleChange = ({ fileList }) => {
      this.setState({ fileList });
  }
  handleRemove = (file)=>{
      console.log(file);
  }
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
 onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
 onEditorStateChangeDetail = (editorStateDetail) => {
     this.setState({
      editorStateDetail,
    });
 }
 onEditorStateCSD = (editorStateCSD) => {
    this.setState({
      editorStateCSD,
    });
  };
onEditorStateChangeSizeDesc = (editorStateSizeDesc) => {
    this.setState({
      editorStateSizeDesc,
    });
  };

 handleSubmit = (e) =>{
     const {dispatch , form} = this.props;
     e.preventDefault();
     form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        
        dispatch({
          type: 'product/saveProduct',
          payload: values,
        });
      }
    }); 
     
 }
beforeUpload=(file)=>{
      
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type==='image/webm' );
      if (!isJPG) {
        message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 12;
      if (!isLt2M) {
        message.error('Image must smaller than 12MB!');
      }
      return isJPG && isLt2M;
}
getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
} 
handleChangeThumb = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    } 
    if(info.file.response && info.file.response.status=='ok'){
        this.setState({
            thumbnail:info.file.response.file.imageid
        })
    }
    
  }
remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
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
    const nextKeys = keys.concat(keys.length);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }

changeCurrency=(e)=>{
    this.setState({
        currency: e
    })
}
handleChangePrice = (e) =>{
   
}
handleSalePrice = (e) =>{
     
}
onChangeNodeID =(nodeid)=>{
    console.log(nodeid);
    this.setState({ nodeid });
}
handleTitle = (e)=>{
    const {name,value} = e.target;
    this.setState({
        seo_link:change_alias(value)
    })
}
render() {
    const {
      list: { list },
      loading,
      order,    
      product: { data }  ,
      category: { treeMap}    
    } = this.props;
    const {
      form: { getFieldDecorator,getFieldValue },
    } = this.props;
    const {previewVisible, previewImage, fileList, editorState, thumbnail,editorStateDetail,editorStateCSD,editorStateSizeDesc,currency} = this.state;
    getFieldDecorator('keys', { initialValue: [] });
    let ls=[];
    let listRaito=[];
     const treeData = (treeMap) ? treeMap : [];
    try{  
        if(order.currency){
            order.currency.raito.forEach(function(e){
                ls.push(<SelectOption value={e.currency} key={e.currency}>{e.currency}</SelectOption>);
                listRaito[[e.currency]]=e.raito;
            });
        }
    }catch(e){
        
    }
                
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <div key={k}>
          
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? 'Passengers' : ''}
          required={false}
          
        >
                     
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "Please input passenger's name or delete this field.",
            }],
          })(
            
            
            <Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />
          )}
              
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
              
        </FormItem>
        </div>
      );
    });  
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 12, offset: 0 },
      },
    };
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
    const imageUrl = this.state.imageUrl;
    let image=[];
    fileList.map((e,i)=>{
        if(e.response && e.response.status=='ok' && e.response.file.isValid) image.push(e.response.file.imageid)
    })  
    let htmlDescription=draftToHtml(convertToRaw(editorState.getCurrentContent()))
    let htmlDescriptionDetail=draftToHtml(convertToRaw(editorStateDetail.getCurrentContent()))
    let htmlCSD=draftToHtml(convertToRaw(editorStateCSD.getCurrentContent()))
    let htmlSizeDesc=draftToHtml(convertToRaw(editorStateSizeDesc.getCurrentContent()))
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
                <FormItem label="Loại tiền" {...this.formLayout}>
                    {getFieldDecorator('currency', {
                            initialValue:currency
                    }) (<Select
                            onChange={this.changeCurrency}
                         >
                        {ls}
                    </Select>)}
                </FormItem> 
            </Col>
        </Row>
        <Row>   
             
             <Col md={12}> 
              <FormItem label="Tiêu đề" {...this.formLayout}>
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: 'Yêu cầu nhập tiêu đề ! ' }],
                  onChange: this.handleTitle 
                })(
                  <Input />
                )}
              </FormItem>
              
            </Col>
            <Col md={12}> 
                <FormItem label="Danh mục" {...this.formLayout}>
                    {getFieldDecorator('nodeid', {
                      initialValue: this.state.nodeid
                    })( 
                     <TreeSelect
                        showSearch
                        style={{ width: 265 }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        allowClear
                        multiple
                        treeDefaultExpandAll
                        onChange={this.onChangeNodeID}
                        treeData={treeData}
                      >

                     </TreeSelect>
                    )}
                </FormItem>
            </Col>
        </Row>    
        <Row>
            <Col md={12}> 
                <FormItem label="Gía gốc" {...this.formLayout}>
                    {getFieldDecorator('price', {
                        onChange: this.handleChangePrice
                    })(
                      <InputNumber
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          style={{width:"100%"}} 
                      />
                    )}
                  </FormItem>
                   
            </Col>
            <Col md={12}> 
                <FormItem label="Sale" {...this.formLayout}>
                    {getFieldDecorator('sale', {

                    })(
                      <Input  />
                    )}
                 </FormItem>
            </Col>
        </Row>
        <Row>
            <Col md={12}> 
            <FormItem label="Giá đã sale " {...this.formLayout}>
                {getFieldDecorator('sale_price', {
                    onChange: this.handleSalePrice
                })(
                 <InputNumber
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      style={{width:"100%"}}    
                  />
                )}
              </FormItem>
                
            </Col>
            <Col md={12}> 
            <FormItem label="Số lượng " {...this.formLayout}>
                {getFieldDecorator('amount', {
                  
                })(
                 <InputNumber
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      style={{width:"100%"}}    
                  />
                )}
              </FormItem>
            </Col>
        </Row><Row>
            <Col md={12}> 
            <FormItem label="Màu" {...this.formLayout}>
                {getFieldDecorator('color', {
                  
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col md={12}> 
            <FormItem label="Style" {...this.formLayout}>
                {getFieldDecorator('style', {
                  
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
        </Row>
        <Row>
            <Col md={12}> 
            <FormItem label="Size" {...this.formLayout}>
                {getFieldDecorator('size', {
                  
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col md={12}> 
            <FormItem label="Người bán" {...this.formLayout}>
                    {getFieldDecorator('seller', {

            })(
             <Input />
            )}
            </FormItem> 
            </Col>
        </Row>
        <Row>
            <Col md={12}> 
            <FormItem label="Nhà sản xuất" {...this.formLayout}>
                {getFieldDecorator('manufacturer', {
                  
                })(
                  <Input />
                )}
              </FormItem> 
            </Col>
            <Col md={12}> 
            <FormItem label="Thời gian sale" {...this.formLayout}>
                {getFieldDecorator('death_clock', {
                  
                })(
                  <RangePicker showTime={{
                        hideDisabledOptions: true,
                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                    }}
                    style={{width: '265px'}}
                    format="YYYY-MM-DD HH:mm:ss" 
                    />
                )}
             </FormItem>
            </Col>
        </Row>
<Row>
    <Col md={12}>
        <FormItem label="Kích thước" {...this.formLayout}>
            {getFieldDecorator('dimensions', {

            })(
                <Input />
            )}
        </FormItem>
    </Col>
    <Col md={12}>
        <FormItem label="Cân nặng" {...this.formLayout}>
            {getFieldDecorator('item_weight', {

            })(
                <Input />
            )}
        </FormItem>   
    </Col>
</Row>
<Row>
    <Col md={12}>
        <FormItem label="Shipping Weight" {...this.formLayout}>
                {getFieldDecorator('shipping_weight', {

        })(
         <Input />
        )}
        </FormItem> 
    </Col>
    <Col md={12}>
        <FormItem label="Item model number" {...this.formLayout}>
             {getFieldDecorator('model_number', {
                })(
                 <Input />
                )}
        </FormItem>  
    </Col>  
</Row>

<Row>
    <Col md={12}>
        <FormItem label="Nhãn hiệu" {...this.formLayout}>
                {getFieldDecorator('brand', {
                  
                })(
                  <Input />
                )}
              </FormItem>
    </Col>
    <Col md={12}>
        
        <FormItem label="ASIN" {...this.formLayout}>
                {getFieldDecorator('asin', {

                })(
                 <Input />
                )}
        </FormItem> 
    </Col>
</Row>
<Row>
    <Col md={24}>
        <div className={styles.noteContainer}>
            <div className={styles.noteTitle}><span> Hình ảnh: </span></div>
            <div clssName={styles.noteContent}>
                <p>
                    Định dạng cho phép .png .jpg .webm, kích cỡ nhỏ hơn 12mb, kích thước tối thiểu 1024x768
                </p> 
            </div>
        </div>
    </Col>
</Row>
<Row>
<Col md={12}>
    <FormItem label="Hình ảnh" {...this.formLayout}>
                <Upload
                      action="/api/upload/"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                      onRemove={this.handleRemove}
                      beforeUpload={this.beforeUpload}
                      multiple
                    >
                   {(fileList.length > 15) ? null : uploadButton}
                </Upload>
          </FormItem>  
</Col>
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
                    {imageUrl ? <img src={imageUrl} alt="Thumbnail" style={{width: '120px'}} /> : uploadThumb}
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
<Row>
<Col md={20}>
            <FormItem label="Mô tả ">
              <div style={{backgroundColor:'white'}}>
                  <Editor
                      editorState={editorState}
                      wrapperClassName={`${styles['demo-wrapper']}`}
                      editorClassName={`${styles['demo-editor']}`}
                     toolbar={{
                        fontSize:{ className: `${styles['editor-custom-font-size']}` },
                        fontFamily:{ className: `${styles['editor-custom-font-family']}`}
                    }}
                      onEditorStateChange={this.onEditorStateChange}
                    />
                  <FormItem  {...this.formLayout}>
                    {getFieldDecorator('description', {
                      rules: [{ required: true, message: 'Yêu cầu nhập tiêu đề ! ' }],
                      initialValue: htmlDescription
                    })(
                      <TextArea
                        disabled 
                        style={{'display': 'none'}}
                    />
                    )}
                  </FormItem>
              </div>
         </FormItem>
    </Col>
</Row>

<Row>
<Col md={20}>
            <FormItem label="Chất liệu & Cách sử dụng">
              <div style={{backgroundColor:'white'}}>
                  <Editor
                      editorState={editorStateCSD}
                      wrapperClassName={`${styles['demo-wrapper']}`}
                      editorClassName={`${styles['demo-editor']}`}
                      onEditorStateChange={this.onEditorStateCSD}
                    />
                  <FormItem  {...this.formLayout}>
                    {getFieldDecorator('materials_use', {
                      initialValue: htmlCSD
                    })(
                      <TextArea disabled 
                        style={{'display': 'none'}}
                    />
                    )}
                  </FormItem>
              </div>
         </FormItem>
</Col>
</Row>
<Row>
<Col md={20}>
            <FormItem label="Chi tiết kích cỡ">
              <div style={{backgroundColor:'white'}}>
                  <Editor
                      editorState={editorStateSizeDesc}
                      wrapperClassName={`${styles['demo-wrapper']}`}
                      editorClassName={`${styles['demo-editor']}`}
                      onEditorStateChange={this.onEditorStateChangeSizeDesc}
                    />
                  <FormItem  {...this.formLayout}>
                    {getFieldDecorator('size_desc', {
                      initialValue: htmlSizeDesc
                    })(
                      <TextArea
                        disabled 
                        style={{'display': 'none'}}
                    />
                    )}
                  </FormItem>
              </div>
         </FormItem>
</Col>
</Row>

<Row>
<Col md={20}>
            <FormItem label="Mô tả chi tiết">
              <div style={{backgroundColor:'white'}}>
                  <Editor
                      editorState={editorStateDetail}
                      wrapperClassName={`${styles['demo-wrapper']}`}
                      editorClassName={`${styles['demo-editor']}`}
                      onEditorStateChange={this.onEditorStateChangeDetail}
                    />
                  <FormItem  {...this.formLayout}>
                    {getFieldDecorator('desc_detail', {
                      initialValue: htmlDescriptionDetail
                    })(
                      <TextArea
                        disabled 
                        style={{'display': 'none'}}
                    />
                    )}
                  </FormItem>
              </div>
         </FormItem>
</Col>
</Row>

<Row>
 <Col md={24}>
            <FormItem label="Meta"  {...this.formLayout}>
                {getFieldDecorator('meta', {
                  
                })(
                  <Input  />
                )}
              </FormItem>
</Col>

</Row>
<Row>
 <Col md={24}>
            <FormItem label="Meta Description"  {...this.formLayout}>
                {getFieldDecorator('meta_description', {
                  
                })(
                  <TextArea ></TextArea>
                )}
              </FormItem>
</Col>

</Row>
<Row>
 <Col md={24}>
            <FormItem label="Seo Link"  {...this.formLayout}>
                {getFieldDecorator('view_seo_link', {
                  
                  initialValue: this.state.seo_link,
                  onChange: this.handleTitle ,
                })(
                  <Input  addonBefore="/product/" />
                )}
              </FormItem>
</Col>
<Col md={24}>
            <FormItem  {...this.formLayout}>
                {getFieldDecorator('seo_link', {
                  initialValue: this.state.seo_link,
                })(
                  <Input  type="hidden"/>
                )}
              </FormItem>
</Col>
</Row>
<FormItem>
        <Button type="primary" htmlType="submit" loading={loading}>Thêm mới</Button>
    </FormItem>
</Form> 
<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="Image" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ProductDetail;
