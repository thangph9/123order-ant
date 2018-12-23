import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
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
import styles from './styles.less';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const {RangePicker} = DatePicker;
const { Search, TextArea } = Input;
@connect(({ list, loading,blog}) => ({
    list,
    loading: loading.models.blog,
    blog,
}))
@Form.create()
class Add extends PureComponent {
    state={
        editorState: EditorState.createEmpty(),
        data: {
            expired:{}
        }
    }
    onEditorStateChange = (editorState) => {
        this.setState({
          editorState,
        });
    };
    handleSubmit=(e)=>{
         const {dispatch , form} = this.props;
         var error=false;
         e.preventDefault();
         form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            if(!error){
                dispatch({
                  type: 'blog/save',
                  payload: values,
                });
            }  

          }
        }); 
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
            image:info.file.response.file.imageid
        })
    }
    
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
componentDidMount(){
    const { dispatch,match } = this.props;
    var artid=match.params.artid;
    dispatch({
        type: 'blog/byID',
        payload: artid,
    });
}
componentWillReceiveProps(nextProps){
  if(nextProps.blog!==this.props.blog){
    //Perform some operation
    var data= nextProps.blog.data;
    var image=data.image;
    var imageUrl='';
    if(image){
        imageUrl='/api/blog/image/'+data.image;
    }
    let a = ContentState.createFromBlockArray(htmlToDraft(data.content));
    var editorState= EditorState.createWithContent(a);  
    this.setState({data,image,imageUrl,editorState});
  }
}
    render(){
        const {
              form: { getFieldDecorator,getFieldValue },
              loading
            } = this.props;
        
        const {editorState, image,data} = this.state;
        const imageUrl = this.state.imageUrl;
        
         const uploadThumb = (
          <div>
            <Icon type={this.state.loading ? 'loading' : 'plus'} />
            <div className="ant-upload-text">Upload</div>
          </div>
        );
        
        let htmlContent=draftToHtml(convertToRaw(editorState.getCurrentContent()));
        const preview=(
            <a href="https://123order.vn/blog/preivew/">Xem bài viết</a>
        )
        return(
        <PageHeaderWrapper>
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Row>
                    <Col md={17} xs={24}>
                        <Card
                        extra={preview}
                        >
                            <Row>
                                <Col md={12} xs={24}>
                                    <FormItem label="Tiêu đề" {...this.formLayout}>
                                        {getFieldDecorator('title', {
                                        initialValue: data.title
                                    }) (<Input />)}
                                    </FormItem>
                                    <FormItem>
                                        {getFieldDecorator('artid', {
                                        initialValue: data.artid
                                    }) (<Input type="hidden" />)}
                                    </FormItem>            
                                </Col>
                            </Row>
                            <Row>
                                <Col md={24} xs={24}>
                                    <FormItem label="Tóm tắt" {...this.formLayout}>
                                        {getFieldDecorator('short_desc', {                   
                                         initialValue: data.short_desc
                                    }) (<TextArea rows={4} />)}
                                    </FormItem>

                                </Col>
                            </Row>
                            <Row>
                                <Col md={24} xs={24}>
                                    <FormItem label="Nội dung">
                                      <div style={{backgroundColor:'white'}}>
                                          <Editor
                                              editorState={editorState}
                                              wrapperClassName={styles['demo-wrapper']}
                                              editorClassName={styles['demo-editor']}
                                              toolbar={{
                                                fontSize:{ className: styles['editor-custom-font-size']},
                                                fontFamily:{ className: styles['editor-custom-font-family']}
                                            }}
                                              onEditorStateChange={this.onEditorStateChange}
                                            />
                                          <FormItem  {...this.formLayout}>
                                            {getFieldDecorator('content', {
                                              rules: [{ required: true, message: 'Yêu cầu nhập nội dung ! ' }],
                                              initialValue: htmlContent
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
                                <Col md={24} xs={24}>
                                   <Button type="primary" htmlType="submit" loading={loading}>Lưu lại</Button>
                                </Col>       
                            </Row>                   
                        </Card>
                    </Col>
                    <Col md={7} xs={24}>
                        <div className={styles.cardLayout}>                
                            <Card title="Hình ảnh"
                                >
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="/api/upload/blog/"
                                    style={{width:'100%'}}
                                    beforeUpload={this.beforeUpload}
                                    onChange={this.handleChangeThumb}
                                  >
                                    {imageUrl ? <img src={imageUrl} alt="Hinh ảnh" style={{width: '205px',display:'inline-block'}} /> : uploadThumb}
                                  </Upload>
                                  
                                <FormItem  {...this.formLayout}>
                                    {getFieldDecorator('image', {
                                      initialValue: image
                                    })(
                                      <Input type="hidden" />
                                    )}
                                  </FormItem>
                                <p>Định dạng cho phép .png .jpg .webm, kích cỡ nhỏ hơn 12mb, kích thước tối thiểu 1024x768</p>
                            </Card>
                            <Card bordered={false}
                            title="Thời gian"
                            style={{ marginTop: 24 }}>
                                <FormItem {...this.formLayout}>
                                {getFieldDecorator('expired', {
                                    initialValue: [moment(data.expired.start,'YYYY-MM-DD'), moment(data.expired.end,'YYYY-MM-DD') ]               
                                })(
                                  <RangePicker showTime={{
                                        hideDisabledOptions: true,
                                    }}
                                    style={{width: '100%'}}
                                    format="YYYY-MM-DD HH:mm:ss" 
                                    />
                                )}
                             </FormItem>
                            </Card>
                        </div>
                    </Col>
                </Row>
                
                
            </Form>
        </PageHeaderWrapper>
        )
    }
}
export default Add;
