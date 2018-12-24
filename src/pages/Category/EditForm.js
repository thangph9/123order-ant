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
class EditForm extends PureComponent {
  state = { visible: false, done: false ,pageSize: 10,current: 1 ,
          
           imageUrl:'',
           imageIsValid:true,
           nodeid: undefined,
           data : {},
           treeData: [],
          };
  componentDidMount() {
      const {dispatch,match} = this.props;
      dispatch({
          type: 'category/fetchDetail',
          payload: match.params.nodeid,
        });
      dispatch({
          type: 'category/treemap',
          payload: {},
        });
  }
componentWillReceiveProps(nextProps){
  if(nextProps.category!==this.props.category){
    //Perform some operation
    var data= nextProps.category.data;
    var treeData=nextProps.category.treeMap;
    var thumbnail=data.thumbnail;
    var imageUrl='';
    if(thumbnail){
        if(this.state.uploaded){
            imageUrl=this.state.imageUrl;
        }else{
            imageUrl='/api/category/image/'+data.thumbnail;
        }
        
    }
      
    this.setState({data,thumbnail,imageUrl,treeData});
  }
}
  formLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
 handleSubmit = (e) =>{
     const {dispatch , form} = this.props;
     e.preventDefault();
     form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'category/update',
          payload: values,
        });
          
      }
    }); 
 }
beforeUpload=(file)=>{
      
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webm' || file.type === 'image/webp' );
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
    if(info.file.response && info.file.response.status=='ok'  ){
        console.log(info)
        if(info.file.response.file.isValid){
             this.setState({
                thumbnail:info.file.response.file.imageid, 
                uploaded:true,
            });
        }else{
            this.setState({
                thumbnail:info.file.response.file.imageid,
                imageIsValid: false
            });
            message.error('Ảnh không đạt tiêu chuẩn!')
        }
       
    }else{
        message.error('Lỗi ko thể upload!')
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
      loading,   
    } = this.props;
    const {
      form: { getFieldDecorator,getFieldValue },
    } = this.props;
    
    const {thumbnail,data ,treeData,imageUrl } = this.state;
    
    //console.log(data);
    
    getFieldDecorator('keys', { initialValue: [] });
    
    //let categoryTreeNode1=this.generateCategoryNode(category,null);
    let start=moment();
    let end=moment();
    try{
        if(data){
          start = moment(data.death_clock.start) 
          end   = moment(data.death_clock.end) 
        }
    }catch(e){
        
    }
    //console.log(start,end);
    
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
     const uploadThumb = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const previewExtra=(
        <a href="https://123order.vn/category/">Xem trước</a>
    )
    return (  
      <PageHeaderWrapper> 
        <Form onSubmit={this.handleSubmit} className="login-form">
        <Row>
            <Col xs={24} md={16}>
                <div className={styles.cardLayoutLeft}>
                    <Card extra={previewExtra}>
                        <Row>       
                            <Col xs={24} md={24}>
                                <FormItem label='Tiêu đề'  {...this.formLayout}>
                                    {getFieldDecorator('title', {
                                        rules: [{ required: true, message: 'Yêu cầu nhập tiêu đề ! ' }],
                                        onChange: this.handleTitle ,
                                        initialValue: data.title
                                    })(
                                      <Input  />
                                    )}
                                </FormItem>
                                <FormItem  {...this.formLayout}>
                                    {getFieldDecorator('nodeid', {
                                        rules: [{ required: true, message: 'Yêu cầu nhập tiêu đề ! ' }],
                                        initialValue: data.nodeid
                                    })(
                                      <Input type='hidden' />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                </div>
                <div className={styles.cardLayoutLeft}>
                    <Card>
                        <Row>       
                            <Col xs={24} md={24}>
                                Danh sách
                            </Col>
                        </Row>
                    </Card>
                </div>
                <div className={styles.cardLayoutLeft}>
                    <Card title="SEO">
                                <Row>       
                                    <Col xs={24} md={24}>
                                        <FormItem label="Meta"  {...this.formLayout}>
                                            {getFieldDecorator('meta', {
                                              initialValue: data.meta_title
                                            })(
                                              <Input  />
                                            )}
                                          </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} md={24}>
                                        <FormItem label="Meta Description"  {...this.formLayout}>
                                            {getFieldDecorator('meta_description', {
                                              initialValue: data.meta_description
                                            })(
                                              <TextArea rows={4} ></TextArea>
                                            )}
                                          </FormItem>
                        
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={24}>
                                        <FormItem label="Seo Link"  {...this.formLayout}>
                                            {getFieldDecorator('view_seo_link', {

                                              initialValue: (this.state.seo_link) ? this.state.seo_link: data.seo_link ,
                                              onChange: this.handleTitle ,
                                            })(
                                              <Input  addonBefore="/category/" />
                                            )}
                                          </FormItem>
                                    </Col>
                                    <Col md={24}>
                                        <FormItem  {...this.formLayout}>
                                            {getFieldDecorator('seo_link', {
                                              initialValue: (this.state.seo_link) ? this.state.seo_link: data.seo_link,
                                            })(
                                              <Input  type="hidden"/>
                                            )}
                                          </FormItem>
                                    </Col>
                                </Row>
                    </Card>
                </div>
                <div className={styles.cardLayoutLeft}>
                    <Card>
                        <FormItem>
                          <Button type="primary" htmlType="submit" loading={loading}>Lưu lại</Button>
                        </FormItem>
                    </Card>
                </div>
            </Col>
            <Col xs={24} md={8}>
                <div className={styles.cardLayout}>
                    <Card title='Hình ảnh'>
                        <Row>
                            <Col md={24}>
                                <FormItem {...this.formLayout}>
                                        <Upload
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            showUploadList={false}
                                            action="/api/upload/thumb/"
                                            beforeUpload={this.beforeUpload}
                                            onChange={this.handleChangeThumb}
                                          >
                                            {imageUrl ? <img src={imageUrl} alt={data.title} style={{width: '230px'}} /> : uploadThumb}
                                          </Upload>
                                </FormItem>
                                <FormItem  {...this.formLayout}>
                                     {getFieldDecorator('thumbnail', {
                                         initialValue: thumbnail
                                        })(
                                         <Input type="hidden" />
                                    )}
                                </FormItem>
                                <p>Định dạng cho phép .png .jpg .webm,.webp kích cỡ nhỏ hơn 12mb, kích thước tối thiểu 1024x768</p>
                            </Col>
                        </Row>
                    </Card>
                </div>
                <div className={styles.cardLayout}>
                    <Card title='Danh mục'>
                        <Row>
                            <Col md={24}>
                                 <FormItem {...this.formLayout}>
                                    {getFieldDecorator('category', {
                                        initialValue: data.category
                                    })( 
                                     <TreeSelect
                                        showSearch
                                        style={{ width: '205px' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        allowClear

                                        multiple
                                        onChange={this.onChangeNodeID}
                                        treeData={treeData}
                                      >

                                     </TreeSelect>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                </div>
                <div className={styles.cardLayout}>
                    <Card title='Thời gian'>
                        <Row>
                            <Col md={24}>
                                 <FormItem  {...this.formLayout}>
                                    {getFieldDecorator('death_clock', {
                                      initialValue: [start,end]
                                    })(
                                      <RangePicker showTime={{
                                            hideDisabledOptions: true,
                                            defaultValue: [start, end],
                                        }}
                                        style={{width: '265px'}}
                                        format="YYYY-MM-DD HH:mm:ss" 
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </Col>
        </Row>    
        </Form> 
      </PageHeaderWrapper>
    );
  }
}

export default EditForm;
