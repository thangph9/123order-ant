import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { change_alias,encodeVI,populateFromArray } from '@/utils/utils';
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
  Affix
    
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

@connect(({ list, loading,category }) => ({
  list,
  loading: loading.models.category,
  category    
}))
@Form.create()
class Category extends PureComponent {
  state = { visible: false, done: false,
           imageUrl:'',
           nodeid: undefined,
           seo_link:'',
          };

  componentDidMount() {
      const {dispatch} = this.props;
  }
  formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

 handleSubmit = (e) =>{
     const {dispatch , form} = this.props;
     e.preventDefault();
     var error=false;
     form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.lname=encodeVI(values.title);
        console.log(values);
        dispatch({
          type: 'category/add',
          payload: values,
        });
          
      }
    }); 
     
 }
beforeUpload=(file)=>{
      
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/webm' );
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
    if(info.file.response && info.file.response.status=='ok' && info.file.response.file.isValid){
        
        this.setState({
            thumbnail:info.file.response.file.imageid
        })
    }
    
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
    } = this.props;
    const {
      form: { getFieldDecorator,getFieldValue },
    } = this.props;
    
    const { thumbnail } = this.state;
    console.log(thumbnail);
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
    
    return (  
      <PageHeaderWrapper> 
        <Form onSubmit={this.handleSubmit} className="login-form">
        <Row>
            <Col xs={24} md={16}>
                <div className={styles.cardLayoutLeft}>
                    <Card>
                        <Row>
                            <Col md={24}>
                                <FormItem label="Tiêu đề"  {...this.formLayout}>
                                    {getFieldDecorator('title', {
                                        rules: [{ required: true, message: 'Yêu cầu nhập tiêu đề ! ' }],
                                        onChange: this.handleTitle 
                                    })(
                                      <Input  />
                                    )}
                                </FormItem>
                                <FormItem label="Ghi chú"  {...this.formLayout}>
                                    {getFieldDecorator('note', {
                                    })(
                                      <Input.TextArea rows={4} />
                                    )}
                                </FormItem>
                            </Col>
                            
                        </Row>
                    </Card>
                </div>
                <div className={styles.cardLayoutLeft}>
                    <Card title="SEO Meta">
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
                                            {getFieldDecorator('meta_desc', {
    
                                            })(
                                              <TextArea rows={4}></TextArea>
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
                                              <Input  addonBefore="/category/" />
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
                   
                    </Card>
                </div>
            </Col>
            <Col xs={24} md={8}>
                <div className={styles.cardLayout}>
                    <Card title="Hình ảnh">
                        <Row>
                            <Col md={24}>
                                <FormItem {...this.formLayout}>
                                        <Upload
                                            className={styles.picture}
                                            showUploadList={false}
                                            action="/api/upload/thumb/"
                                            beforeUpload={this.beforeUpload}
                                            onChange={this.handleChangeThumb}
                                          >
                                            {imageUrl ? <img src={imageUrl} alt="Thumbnail" style={{width: '100%'}} /> : uploadThumb}
                                          </Upload>
                                </FormItem>
                                <p>Định dạng cho phép .png .jpg .webm,.webp kích cỡ nhỏ hơn 12mb, kích thước tối thiểu 1080x480, tỷ lệ 9:4</p>
                                </Col>
                                <Col md={24}>
                                    <FormItem  {...this.formLayout}>
                                         {getFieldDecorator('image', {
                                             initialValue: thumbnail
                                        })(
                                             <Input type="hidden" />
                                        )}
                                    </FormItem>
                                </Col>  
                        </Row>
                    </Card>
                </div>
            </Col>
        </Row>
        <Row>
            <Col md={24} xs={24}>
                <div>
                    <Card>
                         <FormItem>
                          <Button type="primary" htmlType="submit" loading={loading}>Thêm mới</Button>
                        </FormItem>
                    </Card>
                </div>
            </Col>
        </Row>
        </Form> 
      </PageHeaderWrapper>
    );
  }
}

export default Category;
