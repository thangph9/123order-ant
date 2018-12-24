import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { Editor } from 'react-draft-wysiwyg';
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
var currencyFormatter = require('currency-formatter');
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const {RangePicker} = DatePicker;
const { Search, TextArea } = Input;
const TreeNode = TreeSelect.TreeNode;

@connect(({ list, loading,product,order ,category}) => ({
    list,
    loading: loading.models.product,
    product,
    order,
    category
}))
@Form.create()
class EditProduct extends PureComponent {
  state = { visible: false, done: false ,pageSize: 10,current: 1 ,
           previewVisible: false,
            previewImage: '',
           nodeid: undefined,
          };
 componentWillMount(){
     const {dispatch,match} = this.props;
     
     const productid=match.params.productid;
     dispatch({
        type: 'product/fetchDetail',
        payload:{productid},
    })
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
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
      this.setState({ fileList })
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
     var error=false;
     e.preventDefault();
     form.validateFieldsAndScroll((err, values) => {
      if (!err) {
          var img=[];
        try{
           values.images.map(e=>{
                if(e.response &&  e.response.file.isValid &&  e.response.file.imageid){
                    img.push(e.response.file.imageid);
                }else{
                    message.error('File '+ e.name + ' không đúng kích thước!'  );
                    error=true;
                }
            });
        }catch(e){
            error=true
        }
          try{
            if(values.thumbnail && values.thumbnail.file ){
                if(values.thumbnail.file.response.file.isValid){
                    values.thumbnail=values.thumbnail.file.response.file.imageid;
                }else{
                    message.error('Thumbnail File '+ e.name + ' không đúng kích thước!'  );
                    error=true;
                }
              }
          }catch(e){
              error=true
          }
        values.images=img;  
        console.log(values);
        if(!error){
            dispatch({
              type: 'product/update',
              payload: values,
            });
        }  
        
      }
    }); 
     
 }
beforeUpload=(file)=>{
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type==='image/webm' || file.type==='image/webp' );
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
            thumbnail:info
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
        currency: e,
        isChangeCurrency: true
    })
}
handleChangePrice = (e) =>{
   
}
handleSalePrice = (e) =>{
     
}
onChangeNodeID =(nodeid)=>{
    this.setState({ nodeid });
}
handleTitle = (e)=>{
    const {name,value} = e.target;
    this.setState({
        seo_link:this.change_alias(value)
    })
}
change_alias(alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim(); 
    str=str.replace(/\s+/g, '-');
    return str;
}
render() {
    const {
      list: { list },
      loading,
      order,    
      product: { data,detail }  ,
      category: { treeMap }
    } = this.props;
    const {
      form: { getFieldDecorator,getFieldValue },
    } = this.props;
    if(detail && detail.productid){
            
    }
    const {previewVisible, previewImage, fileList, editorState, thumbnail,editorStateDetail,editorStateCSD,currency,imageUrl,editorStateSizeDesc} = this.state;
    getFieldDecorator('keys', { initialValue: [] });
    let ls=[];
    let listRaito=[];
    let initDeathClock= [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]
    if(detail.death_clock){
        initDeathClock=[moment(detail.death_clock.start),moment(detail.death_clock.end)]
    }
    let initFile=[];
    let images=[];
    if(detail.image_huge){
            detail.image_huge.map((e,i)=>{
                initFile.push({
                    uid: e,
                    url: `/api/product/image/${e}`,
                    response:{
                        status: 'ok',
                        file:{
                            imageid: e,
                            isValid: true
                        }
                    }
                })
            })
    }
    
    let initFileList=(fileList) ? fileList : initFile;
    
    let initImageThumb=undefined;
    if(detail.thumbnail){
        initImageThumb=(imageUrl) ? imageUrl : `/api/product/image/${detail.thumbnail}`;
    }
    initFileList.map((e,i)=>{
        images.push(e);
        
    });
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
    
    
    let htmlDescription='';
    if(editorState){
       htmlDescription= draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }
    let htmlDescriptionDetail=''
    if(editorStateDetail){
       htmlDescriptionDetail= draftToHtml(convertToRaw(editorStateDetail.getCurrentContent()))
    }
    
    let htmlCSD='';
    if(editorStateCSD){
       htmlCSD=draftToHtml(convertToRaw(editorStateCSD.getCurrentContent()))
    }
    let htmlSizeDesc='';
    if(editorStateSizeDesc){
       htmlSizeDesc=draftToHtml(convertToRaw(editorStateSizeDesc.getCurrentContent()))
    }
    
    let defaultEditorContentDesc='';
    if(detail.description){
        let a = ContentState.createFromBlockArray(htmlToDraft(detail.description));
       defaultEditorContentDesc= EditorState.createWithContent(a);
    }else{
        defaultEditorContentDesc=EditorState.createEmpty()
    }
    
    let defaultEditorContentDesc_detail={}
    if(detail.desc_detail){
         let b = ContentState.createFromBlockArray(htmlToDraft(detail.desc_detail));
        defaultEditorContentDesc_detail= EditorState.createWithContent(b);
    }else{
        defaultEditorContentDesc_detail=EditorState.createEmpty()
    }
    let defaultEditorContentCSD='';
   
    if(detail.materials_use){
        
        let c = ContentState.createFromBlockArray(htmlToDraft(detail.materials_use));
        defaultEditorContentCSD= EditorState.createWithContent(c);
    }else{
        
        defaultEditorContentCSD=EditorState.createEmpty()
    }

    let defaultEditorContentSizeDesc='';
   
    if(detail.size_desc){
        let c = ContentState.createFromBlockArray(htmlToDraft(detail.size_desc));
        defaultEditorContentSizeDesc= EditorState.createWithContent(c);
    }else{
        
        defaultEditorContentSizeDesc=EditorState.createEmpty()
    }
    let c= (currency) ? currency : detail.currency;
    return ( 
      <PageHeaderWrapper> 
        <Form onSubmit={this.handleSubmit} className="login-form">
<Affix offsetTop={10}>
    <FormItem>
        <Button type="primary" htmlType="submit" loading={loading}>Lưu lại</Button>
    </FormItem>
</Affix>   
        <Row>
            <Col md={12}>
                <FormItem label="Loại tiền" {...this.formLayout}>
                    {getFieldDecorator('currency', {
                            initialValue: c
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
                  initialValue: detail.title ,  
                  onChange: this.handleTitle 
                })(
                  <Input />
                )}
              </FormItem>
              
            </Col>
            <Col md={12}> 
            <FormItem label="Danh mục" {...this.formLayout}>
                {getFieldDecorator('nodeid', {
                  initialValue: detail.nodeid
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
                        initialValue: Number.parseFloat(detail.price).toFixed(2), 
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
                        initialValue: detail.sale , 
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
                    initialValue: Number.parseFloat(detail.sale_price).toFixed(2) , 
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
                    initialValue: detail.amount , 
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
                   initialValue: detail.color , 
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col md={12}> 
            <FormItem label="Style" {...this.formLayout}>
                {getFieldDecorator('style', {
                  initialValue: detail.style , 
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
                  initialValue: detail.size , 
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col md={12}> 
            <FormItem label="Người bán" {...this.formLayout}>
                    {getFieldDecorator('seller', {
                 initialValue: detail.seller , 
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
                  initialValue: detail.manufacturer , 
                })(
                  <Input />
                )}
              </FormItem> 
            </Col>
            <Col md={12}> 
            <FormItem label="Thời gian sale" {...this.formLayout}>
                {getFieldDecorator('death_clock', {
                    initialValue: initDeathClock, 
                })(
                  <RangePicker showTime={{
                        hideDisabledOptions: true,
                        defaultValue: initDeathClock,
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
                initialValue: (detail.infomation) ? detail.infomation.dimensions : '',
            })(
                <Input />
            )}
        </FormItem>
    </Col>
    <Col md={12}>
        <FormItem label="Cân nặng" {...this.formLayout}>
            {getFieldDecorator('item_weight', {
                 initialValue: (detail.infomation) ? detail.infomation.item_weight : '' ,
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
            initialValue: (detail.infomation) ? detail.infomation.shipping_weight : '' ,
        })(
         <Input />
        )}
        </FormItem> 
    </Col>
    <Col md={12}>
        <FormItem label="Item model number" {...this.formLayout}>
             {getFieldDecorator('model_number', {
                initialValue: (detail.infomation) ? detail.infomation.model_number : '' ,
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
                  initialValue:detail.brand
                })(
                  <Input />
                )}
              </FormItem>
    </Col>
    <Col md={12}>
        
        <FormItem label="ASIN" {...this.formLayout}>
                {getFieldDecorator('asin', {
                    initialValue: (detail.infomation) ? detail.infomation.asin : '' ,
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
            <div className={styles.noteContent}>
                <p>
                    Định dạng cho phép .png .jpg .webm .webp, kích cỡ nhỏ hơn 12mb, kích thước tối thiểu 1024x768
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
                      fileList={initFileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                      beforeUpload={this.beforeUpload}
                      onRemove={this.handleRemove}
                      multiple
                    >
                   {(initFileList.length > 15) ? null : uploadButton}
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
                    {initImageThumb ? <img src={initImageThumb} alt="Thumbnail" style={{width: '120px'}} /> : uploadThumb}
                  </Upload>
              </FormItem>
    </Col>

         
</Row>
<Row>
    <Col md={12}>
    <FormItem  {...this.formLayout}>
                {getFieldDecorator('images', {
                  initialValue: images
                })(
                  <Input type="hidden" />
                )}
              </FormItem>
    </Col>  
    <Col md={12}>
            <FormItem  {...this.formLayout}>
                {getFieldDecorator('thumbnail', {
                  initialValue: (thumbnail) ? thumbnail : detail.thumbnail
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
                      editorState={(editorState) ? editorState : defaultEditorContentDesc}
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
                      
                      initialValue: (htmlDescription) ? htmlDescription : detail.description
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

                      editorState={(editorStateCSD) ? editorStateCSD : defaultEditorContentCSD}
                      wrapperClassName={`${styles['demo-wrapper']}`}
                      editorClassName={`${styles['demo-editor']}`}
                      onEditorStateChange={this.onEditorStateCSD}
                        defaultEditorState={defaultEditorContentCSD}
                    />
                  <FormItem  {...this.formLayout}>
                    {getFieldDecorator('materials_use', {
                      
                      initialValue: (htmlCSD) ? htmlCSD : detail.materials_use
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
            <FormItem label="Chi tiết kích cỡ">
              <div style={{backgroundColor:'white'}}>
                  <Editor
                      editorState={(editorStateSizeDesc) ? editorStateSizeDesc : defaultEditorContentSizeDesc}
                      wrapperClassName={`${styles['demo-wrapper']}`}
                      editorClassName={`${styles['demo-editor']}`}
                      onEditorStateChange={this.onEditorStateChangeSizeDesc}
                    />
                  <FormItem  {...this.formLayout}>
                    {getFieldDecorator('size_desc', {
                      initialValue: (htmlSizeDesc) ? htmlSizeDesc : detail.size_desc
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

                      editorState={(editorStateDetail) ? editorStateDetail : defaultEditorContentDesc_detail}
                      wrapperClassName={`${styles['demo-wrapper']}`}
                      editorClassName={`${styles['demo-editor']}`}
                      onEditorStateChange={this.onEditorStateChangeDetail}
                    />
                  <FormItem  {...this.formLayout}>
                    {getFieldDecorator('desc_detail', {
                      
                      initialValue: (htmlDescriptionDetail) ? htmlDescriptionDetail : detail.desc_detail
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
                    initialValue:detail.meta
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
                  initialValue:detail.meta_description
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
                  
                  initialValue: (this.state.seo_link) ? this.state.seo_link : detail.seo_link,
                  onChange: this.handleTitle ,
                })(
                  <Input  addonBefore="/product/" />
                )}
              </FormItem>
</Col>
<Col md={24}>
            <FormItem  {...this.formLayout}>
                {getFieldDecorator('seo_link', {
                  initialValue: (this.state.seo_link) ? this.state.seo_link : detail.seo_link,
                })(
                  <Input  type="hidden"/>
                )}
              </FormItem>
            <FormItem  {...this.formLayout}>
                {getFieldDecorator('productid', {
                  initialValue: detail.productid,
                })(
                  <Input  type="hidden"/>
                )}
              </FormItem>
</Col>
</Row>
        <FormItem>
          <Button type="primary" htmlType="submit" loading={loading}>Lưu lại</Button>
        </FormItem>
        </Form> 
<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="Image" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default EditProduct;
