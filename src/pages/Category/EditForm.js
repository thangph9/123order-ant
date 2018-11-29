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
           previewVisible: false,
            previewImage: '',
            fileList: [],
           editorState: EditorState.createEmpty(),
           editorStateDetail: EditorState.createEmpty(),
           imageUrl:'',
           nodeid: undefined,
           seo_link:'',
          };
  componentWillMount(){
      const {dispatch} = this.props;
      dispatch({
          type: 'category/treemap',
          payload: {},
        });
  }
  componentDidMount() {
      const {dispatch,match} = this.props;
      dispatch({
          type: 'category/fetchDetail',
          payload: match.params.nodeid,
        });
  }
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
          type: 'category/save',
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
      category: { treeMap,data }    
    } = this.props;
    const {
      form: { getFieldDecorator,getFieldValue },
    } = this.props;
    
    const {previewVisible, previewImage, fileList, editorState, thumbnail , editorStateDetail} = this.state;
    
    //console.log(data);
    
    getFieldDecorator('keys', { initialValue: [] });
    const treeData = (treeMap) ? treeMap : [];
    let category=(data[0]) ? data[0] : {};
    let nodeid = (data[0]) ? data[0].category : null;
    //let categoryTreeNode1=this.generateCategoryNode(category,null);
    let thumb=(thumbnail) ? thumbnail : category.thumbnail;
    let start=moment();
    let end=moment();
    try{
        if(data[0]){
          start = moment(data[0].death_clock.start) 
          end   = moment(data[0].death_clock.end) 
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
    const imageUrl = (this.state.imageUrl) ? this.state.imageUrl : `/api/category/image/${category.thumbnail}`;
    let image=[];
    fileList.map((e,i)=>{
        if(e.response && e.response.status=='ok') image.push(e.response.file.imageid)
    })  
    return (  
      <PageHeaderWrapper> 
        <Form onSubmit={this.handleSubmit} className="login-form">
<Row>
    <Col md={12}>
        <Row>
            <Col md={24}>
                <FormItem label="Tiêu đề"  {...this.formLayout}>
                    {getFieldDecorator('title', {
                        rules: [{ required: true, message: 'Yêu cầu nhập tiêu đề ! ' }],
                        onChange: this.handleTitle ,
                        initialValue: category.title
                    })(
                      <Input  />
                    )}
                </FormItem>
                <FormItem  {...this.formLayout}>
                    {getFieldDecorator('nodeid', {
                        rules: [{ required: true, message: 'Yêu cầu nhập tiêu đề ! ' }],
                        initialValue: category.nodeid
                    })(
                      <Input type='hidden' />
                    )}
                </FormItem>
            </Col>
            <Col md={24}>
                 <FormItem label="Danh mục" {...this.formLayout}>
                    {getFieldDecorator('category', {
                        initialValue: (this.state.nodeid) ? this.state.nodeid : nodeid
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
            <Col md={24}>
            <FormItem label="Thời gian sale" {...this.formLayout}>
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
    </Col>  
    <Col md={12}>
        <Row>
            
            <Col md={24}>
            <FormItem label="Ảnh đại diện" {...this.formLayout}>
                    <Upload
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="/api/upload/thumb/"
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleChangeThumb}
                      >
                        {imageUrl ? <img src={imageUrl} alt="Thumbnail" style={{width: '320px'}} /> : uploadThumb}
                      </Upload>
            </FormItem>
            </Col>
            <Col md={24}>
                <FormItem  {...this.formLayout}>
                     {getFieldDecorator('thumbnail', {
                         initialValue: thumb
                    })(
                         <Input type="hidden" />
                    )}
                </FormItem>
            </Col>  
        </Row>
    </Col>
</Row>
<Row>
 <Col md={24}>
            <FormItem label="Meta"  {...this.formLayout}>
                {getFieldDecorator('meta', {
                  initialValue: category.meta_title
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
                  initialValue: category.meta_description
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
                  
                  initialValue: (this.state.seo_link) ? this.state.seo_link: category.seo_link ,
                  onChange: this.handleTitle ,
                })(
                  <Input  addonBefore="/category/" />
                )}
              </FormItem>
</Col>
<Col md={24}>
            <FormItem  {...this.formLayout}>
                {getFieldDecorator('seo_link', {
                  initialValue: (this.state.seo_link) ? this.state.seo_link: category.seo_link,
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
      </PageHeaderWrapper>
    );
  }
}

export default EditForm;
