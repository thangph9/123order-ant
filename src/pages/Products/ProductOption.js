import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { change_alias,encodeVI } from '@/utils/utils';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Button,
  Icon,
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

import styles from './ProductOption.less';
var currencyFormatter = require('currency-formatter');
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const {RangePicker} = DatePicker;
const { Search, TextArea } = Input;
const TreeNode = TreeSelect.TreeNode;
class UICard extends PureComponent{
    state={
        className: '',
    }
    componentWillMount(){
        const {className} = this.props;
        this.setState({className});
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.className!==this.props.className){
            this.setState({className: nextProps.className });
        }
    }
    
    render(){
        const {children, title ,footer,extend} = this.props;
        const { className } = this.state;
        return (
                    <div className={styles.uiItem}>
                    <div className={className} >
                    {title &&
                        <div className={styles.uiCardHeader}>{title}</div>
                    }
                    <div className={styles.uiCardBody} >
                            {children}
                    </div>
                    {footer &&
                        <div className={styles.uiCardFooter}>{footer}</div>
                    }
                    </div>
                </div>)
    }
};
var placeholder = document.createElement("li");
    placeholder.className = 'dragged';
class ListImageUpload extends PureComponent{
        state={...this.props};
        
        componentWillMount(){
            const { dataSource  } = this.props;
            this.setState({dataSource});
        }
        componentWillReceiveProps(nextProps){
            if(nextProps.dataSource!==this.props.dataSource){
                
                this.setState({dataSource});
            }
        }
        dragStart(e) {
            this.dragged = e.currentTarget;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.dragged);
            
          }
        dragEnd(e){
            try{
                this.dragged.parentNode.removeChild(placeholder);
                // update state              
                var data = this.state.dataSource;
                var from = Number(this.dragged.dataset.id);
                var to = Number(this.over.dataset.id);
                if(from < to) to--;
                data.splice(to, 0, data.splice(from, 1)[0]);
                this.props.refs(data);
                this.setState({dataSource: data});
                
            }catch(e){
                
            }
          }
          dragOver(e) {
            e.preventDefault();
            if(e.target.className === 'dragged') return;
            this.over = e.target;
            e.target.parentNode.insertBefore(placeholder, e.target);
          }
        dropFile(ev){
            ev.preventDefault();
            var accepted=[];
            var rejected=[];
            const { dataSource }=this.state;
              if (ev.dataTransfer.items) {
                // Use DataTransferItemList interface to access the file(s)
                for (var i = 0; i < ev.dataTransfer.items.length; i++) {
                  // If dropped items aren't files, reject them
                  if (ev.dataTransfer.items[i].kind === 'file') {
                    var file = ev.dataTransfer.items[i].getAsFile();
                    accepted[i]=file;
                    dataSource.push(file.name);
                  }
                }
              } else {
                // Use DataTransfer interface to access the file(s)
                for (var i = 0; i < ev.dataTransfer.files.length; i++) {
                    rejected[i]=ev.dataTransfer.items[i].getAsFile();
                }
              } 
            if(this.props.onDrop){
                this.props.onDrop(accepted,rejected);
            } 
            this.props.refs(dataSource);
            this.setState({dataSource})
            this.removeDragData(ev);
          }
        removeDragData(ev) {
          ev.preventDefault();
          if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to remove the drag data
            ev.dataTransfer.items.clear();
          } else {
            // Use DataTransfer interface to remove the drag data
            ev.dataTransfer.clearData();
          }
            this.setState({
                enter:false
            })
        }
        dragEnterHandler(e){
            e.preventDefault();
            if(this.props.dragEnter){
                this.props.dragEnter.bind(e);
            }
            this.setState({
                enter:true
            })
        }
        dragOverHandler(e){
           e.preventDefault();
            if(this.props.dragOver){
                this.props.dragOver.bind(e);
            }
            
            
        }
        dragLeaveHandle(e){
            console.log("Drag Leave");
            e.preventDefault();
            if(this.props.dragLeave){
                this.props.dragLeave.bind(e);
            }
            this.setState({
                enter:false
            })
            
        }
        render(){
            //console.log(this.state.dataSource);
            var listItems = this.state.dataSource.map((item, i) => {
                return (<li   className={styles.imgItem}
                              data-id={i}
                              key={i}
                              draggable='true'
                              onDragEnd={this.dragEnd.bind(this)}
                              onDragStart={this.dragStart.bind(this)}>{item}</li>
                          )
                         });
        return (
            <div>
                { this.state.enter &&
                 <div onDragOver={this.dragOverHandler.bind(this)} >
                    <div className={styles.dropZone} 
                        onDrop={this.dropFile.bind(this)} 
                        onDragLeave={this.dragLeaveHandle.bind(this)}
                    >
                        <p>Drop file here !</p>
                    </div>     
                 </div>         
                }
                <ol onDragOver={this.dragOver.bind(this)}
                    onDragEnter={this.dragEnterHandler.bind(this)} 
                >
                         {listItems}
                </ol>
            </div>
            )
        }
}
class A extends PureComponent {
    state={
        dataSources:[],
        columns: [],
    }
    
    componentWillMount(){
        const { source  } = this.props;
        this.setState({dataSources: source})
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.source!==this.props.source){
            this.setState({dataSources: nextProps.source });
        }
    }
    render(){
        const {form: { getFieldDecorator,getFieldValue }} = this.props;
        const { changePrice, selectedRowKeys,dataSources,fileList,columns } =this.state;
        return (
            <Row>
                <Table 
                    dataSource={dataSources} columns={columns} />
            </Row>
            )
    }
}

@connect(({ list, loading,product,order,category }) => ({
    list,
    loading: loading.models.product,
    product,
    order,
    category
}))

@Form.create()
class ProductOption extends PureComponent {
  state = { 
        currency: 'USD',
        imageUrl:'',
        previewVisible: false,
        previewImage: '',
        fileList: [],
        imgHover: false,
        sizeData:[
        {
            title   : 'Adidas',
            key     : 'adidas',
            value   : 'adidas',
            children:[
                {
                    title   : 'HEEL-TOE MEASUREMENT',
                    key     : '01',
                    value   : '01',  
                },
                {
                    title   : "US - MEN\'S",
                    key     : '02',
                    value   : '02',  
                },
                {
                    title   : "US - WOMEN'S",
                    key     : '03',
                    value   : '03',  
                },
                {
                    title   : 'UK',
                    key     : '04',
                    value   : '04',  
                },
                {
                    title   : 'EU',
                    key     : '05',
                    value   : '05',  
                },
                {
                    title   : 'JP',
                    key     : '06',
                    value   : '06',  
                },
            ]
        }
    ],
        colors: ['Red', 'Green', 'Blue', 'Yellow', 'Black', 'White', 'Orange'],
        editorState: EditorState.createEmpty()
    };
handleSubmit=(e)=>{
    const {dispatch , form} = this.props;
     e.preventDefault();
     form.validateFieldsAndScroll((err, values) => {
      if (!err) {
           dispatch({
              type: 'product/saveProductVariants',
              payload: values,
            });
      }
    }); 
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

beforeUpload=(file)=>{
      
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' );
      if (!isJPG) {
        message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
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
handleRemoveCategory=(e)=>{
    console.log(e);
}
handleDeleteImage=(e)=>{
    console.log(e);   
}
handlePreview=(e)=>{
    console.log(e);
}
handleHoverImage=(e)=>{
    this.setState({
        [e.id]:true
    })
}
handleMouseOutImage=(e)=>{
    this.setState({
        //[e.id]:undefined
    })
}
changeCurrency=(e)=>{
    this.setState({
        currency: e
    })
}
handleCallback = (e)=>{
    if(e){
        this.setState({
            colors: e
        })
    }
    
}
handleDrop=(accepted,rejected)=>{
    const {form} = this.props;
    if(accepted.length > 0){
        form.setFieldsValue({
          keys: accepted,
        });
    }
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
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };
formLayoutSelect={
    labelCol: { span: 24 },
    wrapperCol: { span: 5 },
}
uploadButton = (
      <div>  
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
uploadThumb = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };
uploadFileButton =(
    <Button type="button">Thêm hình ảnh</Button>
)
render() {
    const {
      loading, 
      order,    
      product: { data },
      category: { treeMap}  
    } = this.props;
    const {
      form: { getFieldDecorator,getFieldValue },form
    } = this.props;
    const {currency,fileList, thumbnail,sizeData}=this.state;
    const imageUrl = this.state.imageUrl;
    let image=[];
    fileList.map((e,i)=>{
        if(e.response && e.response.status=='ok' && e.response.file.isValid)
        image.push(e.response.file.imageid);
    }) 
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
    return (  
      <PageHeaderWrapper> 
        <Form onSubmit={this.handleSubmit} className="login-form">
        <div className={styles.container}>
        <Affix offsetTop={10}>
                <FormItem>
                    <Button type="primary" htmlType="submit" loading={loading}>Thêm mới</Button>
                </FormItem>
        </Affix>
        <div>
            <Row>
                <Col md={17} className={styles.box} >
                    <div className={styles.boxBorder}>
                        <div className={styles.uiLayoutItem}>
                             <UICard>
                                <FormItem label="Loại tiền: " {...this.formLayoutSelect}>
                                    {getFieldDecorator('currency', {
                                        initialValue: currency
                                    }) (<Select
                                            onChange={this.changeCurrency}
                                        >
                                            {ls}
                                        </Select>)}
                                </FormItem> 
                                <FormItem label="Tên: "  {...this.formLayout}>
                                    {getFieldDecorator('name', {

                                    })(<Input />)}
                                </FormItem>
                                <FormItem label="Mô tả ">
                                      <div style={{backgroundColor:'white'}}>
                                          <Editor
                                              editorState={this.state.editorState }
                                              wrapperClassName={styles['demo-wrapper']}
                                              editorClassName={styles['demo-editor']}
                                             toolbar={{
                                                fontSize:{ className: styles['editor-custom-font-size'] },
                                                fontFamily:{ className: styles['editor-custom-font-family']}
                                            }}
                                              onEditorStateChange={this.onEditorStateChange}
                                            />
                                          <FormItem  {...this.formLayout}>
                                            {getFieldDecorator('description', {
                                            })(
                                              <TextArea
                                                disabled 
                                                style={{'display': 'none'}}
                                            />
                                            )}
                                          </FormItem>
                                      </div>
                                 </FormItem>
                            </UICard>
                        </div>
                        <div className={styles.uiLayoutItem}>
                                       
                            <UICard title="Hình ảnh" extend={this.uploadFileButton}>
                                <Row>
                                    <Col md={24}>
                                        <ListImageUpload 
                                            onDrop={this.handleDrop}
                                            refs={this.handleCallback}
                                            dataSource={this.state.colors} />	             
                                    </Col>   
                                </Row>        
                            </UICard>           
                        </div> 
                        <div className={styles.uiLayoutItem}>
                            <UICard title="Giá">
                                <Row>
                                    <Col xs={12} md={12}>
                                       <FormItem label="Giá gốc"  {...this.formLayout}>
                                            {getFieldDecorator('price', {
                                            })(<InputNumber className={styles.inputNumber} />)}
                                        </FormItem>        
                                    </Col>
                                    <Col xs={12} md={12} >
                                       <FormItem label="Sale"  {...this.formLayout}>
                                            {getFieldDecorator('sale', {
                                            })(<InputNumber className={styles.inputNumber}/>)}
                                        </FormItem>        
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={12}>
                                       <FormItem label="Giá đã sale"  {...this.formLayout}>
                                            {getFieldDecorator('sale_price', {
                                            })(<InputNumber className={styles.inputNumber}/>)}
                                        </FormItem>        
                                    </Col>
                                    <Col xs={12} md={12} >
                                        <FormItem label="Số lượng"  {...this.formLayout}>
                                            {getFieldDecorator('amount', {

                                            })(<InputNumber  />)}
                                        </FormItem>
                                     </Col> 
                                </Row>
                            </UICard>     
                        </div> 
                        <div className={styles.uiLayoutItem}>
                            <UICard title="Lựa chọn">
                                <Tag>Màu sắc</Tag>
                                <Tag>Kích cỡ</Tag>
                                <Tag>Kiểu dáng</Tag>
                            </UICard>  
                        </div> 
                        <div className={styles.uiLayoutItem}>
                            <UICard title="Chuẩn SEO ">
                                <Row>
                                     <Col md={24}>
                                        <FormItem  {...this.formLayout}>
                                            {getFieldDecorator('seo_meta', {

                                            })(<Input />)}
                                        </FormItem>
                                     </Col> 
                                </Row>             
                            </UICard>
                        </div>                       
                    </div>             
                </Col>
                <Col md={8} className={styles.box}>
                    <div className={styles.boxBorder}>
                        <div className={styles.uiLayoutItem}>
                           <UICard className={styles.uiCardBgColor}>
                                <FormItem label="Danh mục" {...this.formLayout}>
                                {getFieldDecorator('nodeid', {
                                       
                                })( 
                                 <TreeSelect
                                    showSearch
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    allowClear
                                    multiple
                                    treeData={treeData}
                                  >

                                 </TreeSelect>
                                )}
                                </FormItem>
                                <div className={styles.uiCatLayout}>
                                    <div className={styles.uiCatList}>
                                        <div className={styles.uiCatItem}>
                                            Ten danh muc
                                            <Icon type='close' className={styles.iconClose} onClick={this.handleRemoveCategory.bind(this,'abc')} />
                                        </div>   
                                    </div>
                                </div>
                            </UICard>
                        </div>
                        <div className={styles.uiLayoutItem}>
                            <UICard title="Loại sản phẩm">
                                <Row>
                                     <Col md={24}>
                                        <FormItem  {...this.formLayout}>
                                            {getFieldDecorator('type', {

                                            })(<Input />)}
                                        </FormItem>
                                     </Col> 
                                </Row>
                            </UICard>
                        </div>
                                               
                    </div>
                </Col>
            </Row>
            <Row>
                <div className={styles.uiSubmitLayout}>
                    
                            <FormItem>
                                <Button type="primary" htmlType="submit" loading={loading}>Thêm mới</Button>
                            </FormItem>
                
                </div> 
            </Row>                                   
        </div>                                       
        </div>
        </Form> 
      </PageHeaderWrapper>
    );
  }
}

export default ProductOption;
