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
  TreeSelect
    
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

@connect(({ list, loading,product }) => ({
  list,
  loading: loading.models.product,
  product    
}))
@Form.create()
class ProductDetail extends PureComponent {
  state = { visible: false, done: false ,pageSize: 10,current: 1 ,
           previewVisible: false,
            previewImage: '',
            fileList: [],
           editorState: EditorState.createEmpty(),
           editorStateDetail: EditorState.createEmpty(),
           imageUrl:'',
           nodeid: undefined,
          };
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    console.log(file);
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
      
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' );
      if (!isJPG) {
        message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJPG && isLt2M;
}
getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
} 
handleChangeThumb = (info) => {
    console.log(info);
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

onChangeNodeID =(nodeid)=>{
    this.setState({ nodeid });
}
render() {
    const {
      list: { list },
      loading,
      product: { data }    
    } = this.props;
    const {
      form: { getFieldDecorator,getFieldValue },
    } = this.props;
    const {previewVisible, previewImage, fileList, editorState, thumbnail,editorStateDetail} = this.state;
    getFieldDecorator('keys', { initialValue: [] });
      
    const treeData = [{
      title: 'Amazon',
      value: '0-0',
      key: '0-0',
      children: [{
        title: 'Thời Trang',
        value: '0-0-1',
        key: '0-0-1',
        children:[
            {
                title: 'Nam',
                value: '0-0-1-0',
                key: '0-0-1-0',
            },
            {
                title: 'Nữ',
                value: '0-0-1-1',
                key: '0-0-1-1',
            },
        ]
      }, {
        title: 'Công Nghệ',
        value: '0-0-2',
        key: '0-0-2',
      }],
    }, {
      title: 'eBay',
      value: '0-1',
      key: '0-1',
    }];
    
    //let categoryTreeNode1=this.generateCategoryNode(category,null);
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
        if(e.response && e.response.status=='ok') image.push(e.response.file.imageid)
    })  
    let htmlDescription=draftToHtml(convertToRaw(editorState.getCurrentContent()))
    let htmlDescriptionDetail=draftToHtml(convertToRaw(editorStateDetail.getCurrentContent()))
    return (  
      <PageHeaderWrapper> 
        <Form onSubmit={this.handleSubmit} className="login-form">
        <Row>   
             
             <Col md={12}> 
              <FormItem label="Tiêu đề" {...this.formLayout}>
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: 'Yêu cầu nhập tiêu đề ! ' }],
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

                    })(
                      <Input />
                    )}
                  </FormItem>
            </Col>
            <Col md={12}> 
                <FormItem label="Sale" {...this.formLayout}>
                    {getFieldDecorator('sale', {

                    })(
                      <Input />
                    )}
                  </FormItem>
            </Col>
        </Row>
        <Row>
            <Col md={12}> 
            <FormItem label="Giá đã sale " {...this.formLayout}>
                {getFieldDecorator('sale_price', {
                  
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col md={12}> 
            <FormItem label="Số lượng " {...this.formLayout}>
                {getFieldDecorator('amount', {
                  
                })(
                  <Input />
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
<Col md={12}>
    <FormItem label="Hình ảnh" {...this.formLayout}>
                <Upload
                      action="//192.168.56.104:3000/api/upload/"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={this.handlePreview}
                      onChange={this.handleChange}
                      onRemove={this.handleRemove}
                      directory
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
                    action="//192.168.56.104:3000/api/upload/"
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChangeThumb}
                  >
                    {imageUrl ? <img src={imageUrl} alt="Thumbnail" /> : uploadThumb}
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
            <FormItem label="Mô tả ">
              <div style={{backgroundColor:'white'}}>
                  <Editor
                      editorState={editorState}
                      wrapperStyle={styles.wrapper}
                      editorStyle={styles.editor}
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
</Row>
<Row>
            <FormItem label="Mô tả chi tiết">
              <div style={{backgroundColor:'white'}}>
                  <Editor
                      editorState={editorStateDetail}
                      wrapperStyle={styles.wrapper}
                      editorStyle={styles.editor}
                      onEditorStateChange={this.onEditorStateChangeDetail}
                    />
                  <FormItem  {...this.formLayout}>
                    {getFieldDecorator('desc_detail', {
                      rules: [{ required: true, message: 'Yêu cầu nhập tiêu đề ! ' }],
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
</Row>
         <FormItem>
                
                <Button type="primary" htmlType="submit" loading={loading}>Thêm mới</Button>
               
         </FormItem>
        </Form> 
      </PageHeaderWrapper>
    );
  }
}

export default ProductDetail;
