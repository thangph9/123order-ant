import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { change_alias,encodeVI,populateFromArray } from '@/utils/utils';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Link } from 'react-router-dom';
import moment from 'moment';


import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
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
  Tabs,    
  Divider,
  Tooltip,
  Popconfirm
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DynamicFieldSet from '@/components/DynamicFieldSet';
import EditVariant from '@/components/DynamicFieldSet/EditVariant';
import AddVariant from '@/components/DynamicFieldSet/AddVariant';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import styles from './ProductOption.less';
var currencyFormatter = require('currency-formatter');
var nj = require('numjs');
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const {RangePicker} = DatePicker;
const CheckableTag = Tag.CheckableTag;
const TabPane = Tabs.TabPane;
const async     = require("async");
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
        const {children, title ,footer,extra} = this.props;
        const { className } = this.state;
        
        return (
                    <div className={styles.uiItem}>
                    <div className={className} >
                    
                        <div className={styles.uiCardHeader}>
                            {title &&
                                <div className={styles.cardTitle}>{title}</div>
                            }    
                            {extra && 
                                <div className={styles.cardExtra}>{extra}</div>
                            }
                        </div>
                    
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
    placeholder.className = styles.dragged;
@connect(({ loading,image}) => ({
    loading: loading.models.image,
    image
}))
class ListImageUpload extends PureComponent{
        state={...this.props,
               file: File | null,
               dragging: false,
               images: [],
               imageList: [],
              };
        componentWillReceiveProps(nextProps){
            if(nextProps.dataSource!==this.props.dataSource){
                var dataSource=nextProps.dataSource.dataSource;
                var dragging=nextProps.dragging;
                this.setState({dataSource});
            }
            if(nextProps.image !==this.props.image ){
                var images=[];
                if(Array.isArray(nextProps.image.images)){
                    nextProps.image.images.map((e,index)=>{
                        if(e.response.status=='ok' && e.response.file.isValid ){
                            images[index]=e.response.file.imageid;
                        }
                    })
                }
                this.props.refs({dataSource:images});
                this.setState({dataSource: images});
            }
        }
        
        dragStart(e) {
            this.dragged = e.currentTarget;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.dragged);
            this.setState({
                dragging:true
            })
          }
        dragEnd(e){
            try{
                this.dragged.parentNode.removeChild(placeholder);
            }catch(e){
                
            }
                
                // update state              
                var data = this.state.dataSource;
                var from = Number(this.dragged.dataset.id);
                var to = Number(this.over.dataset.id);
                if(from < to) to--;
                data.splice(to, 0, data.splice(from, 1)[0]);
                this.props.refs({dataSource:data,dragging:false});
                this.setState({dragging:false})
          }
          dragOver(e) {
            e.preventDefault();
            if(e.target.className === styles.dragged) return;
            this.over = e.target;
            e.target.parentNode.insertBefore(placeholder, e.target);
          }
        dropFile(accepted,rejected){
            var { images }=this.state;
            const {dispatch}  =this.props;
            images.push(accepted);
            this.setState({
                images
            });
            if(this.props.onDrop){
                this.props.onDrop(accepted,rejected);
            }
            if(Array.isArray(accepted)){
                
                accepted.map(e=>{
                    dispatch({
                        type: 'image/upload',
                        payload:e
                    }); 
                });
            }else if(accepted){
                
                dispatch({
                        type: 'image/upload',
                        payload: accepted
                    });
            }
            
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
        handleMouseEnterImage(e){
            this.setState({
                [e]:true
            })
        }
        handleMouseLeave(e){
          
            this.setState({
                [e]:false
            })
        }
        removeImage=(e)=>{
            var dataSource=this.state.dataSource;
            var newData=dataSource.filter(k=> k != e);
            this.props.refs({dataSource: newData})
            this.setState({dataSource: newData})
        }
        render(){
            var source=Array.isArray(this.state.dataSource) ? this.state.dataSource : [];
            
            var listItems = source.map((item, i) => {
                return (<li   className={styles.imgItem}
                              data-id={i}
                              key={i}
                              draggable='true'
                              onMouseEnter={()=>{this.handleMouseEnterImage(item)}}
                              onMouseLeave={()=>{this.handleMouseLeave(item)}}
                              onDragEnd={this.dragEnd.bind(this)}
                              onDragStart={this.dragStart.bind(this)}><div className={styles.imgLayout}><img src={"/image/"+item} style={{width:'100%'}} /></div>
                              {this.state[item] &&
                                    <div className={styles.imgNav}><Icon type="delete" onClick={()=>{this.removeImage(item)}} />
                                    
                                    </div>
                              }
                              </li>
                          )
                         });
        return (
            <Dropzone onDrop={this.dropFile.bind(this)}>
            {({getRootProps, getInputProps, isDragActive}) => {
              return (
                <div style={{minHeight: '150px',display:'inline-block',float:'left'}}
                  {...getRootProps({
                  onClick: evt => evt.preventDefault()
                  })}
                  className={classNames('dropzone', {'dropzone--isActive': isDragActive})}
                >
                  <input {...getInputProps()} />
                  {
                    isDragActive ?
                      <div>
                            <p className="ant-upload-drag-icon">
                              <Icon type="inbox" />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                      </div> : 
                        <div> {
                                source.length > 0 ? <ol onDragOver={this.dragOver.bind(this)}>{listItems}</ol> :
                                <div>
                                    <p className="ant-upload-drag-icon">
                                      <Icon type="inbox" />
                                    </p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                                </div>
                               }
                        </div>
                    
                      
                  }
                </div>
              )
            }}
          </Dropzone>  
         )
    }
}
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input `,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}              
class A extends PureComponent {
    state={
        dataSources:[],
        columns: [],
        tags: [],
        fileList:[],
        selectedValue: [],
        selectedTags: [],
        showAddImage: false,
        previewVisible: false,
        dataFilter:undefined,
        previewImage: [],
        rowSelection : {
          onChange: (selectedRowKeys, selectedRows) => {
              this.setState({selectedRowKeys: selectedRowKeys}) ;
          },
          onSelect: (record, selected, selectedRows) => {
             console.log(record, selected, selectedRows);
             
          },
          onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
          }, 
             
        },
        selectedRowKeys: [], 
    }
    
    componentWillMount(){
        const { source, match  } = this.props;
        this.setState({dataSources: source,productid:match.params.productid});
    }
    handleChange(tag, checked,value) {
        const { selectedTags,selectedValue,dataSources, dataFilter} = this.state;
        
        var nextSelectedTags = [];
        var nextSelectedValue= [];
        var listKey=[];
        
        if(checked){
            nextSelectedTags=[...selectedTags, tag];
            nextSelectedValue=[...selectedValue,value];
        }else{
            nextSelectedTags=selectedTags.filter(t => t !== tag);
            nextSelectedValue=selectedValue.filter(t=> t._id==value._id)
        } 
        this.setState({selectedValue:nextSelectedValue, selectedTags: nextSelectedTags,addImage: true,dataFilter: variants,tag: tag});
      }
    handleDeleteRows(row){
        const { dataSources } = this.state;
        const { dispatch,match } = this.props;
        
        var result=dataSources.filter(e=> {
            return row.key !== e.key
        });
        this.setState({ dataSources:result });
        try{
           
            row.productid=match.params.productid;
            dispatch({
                type: 'product/deleteOption',
                payload: row,
            })
        }catch(e){
            
        }
        
    }
    handleAddPrice=(e,record)=>{
        console.log(record)
    }
    handleAddAmount=(e,record)=>{
        console.log(record)
    }
    //
    showModalAddImage=()=>{
        this.setState({
            showAddImage: true
        })
    }
    onOkShowModalImage=()=>{
        const { dataSources ,selectedRowKeys, fileList} = this.state;
        var newDataSources=dataSources;
        var listImage=[];
        var listRaw=[];
        
        try{
            fileList.map(e=>{
                listImage.push(e.response.file.imageid)
                
             })
        }catch(e){
        }
        selectedRowKeys.map(k=>{
            newDataSources.filter(e=>{  
                
             if(e.key==k){
                    console.log(e,listImage);
                    e.images=listImage;
                    e.imageRaw=fileList;
                    return true;
                }
            });
        })
        setTimeout(function(){
            
        },100)
        this.setState({
                showAddImage: false,
                dataSources:newDataSources,
                fileList: []
            });
        //console.log(selectedRowKeys);
        
        
    }
    onCancelShowImage=()=>{
        this.setState({
            showAddImage: false
        })
    }
    handleCallback=(e)=>{
        this.setState({
            listImage: e
        })
    }
    handleChangeAddOptionImage = ({ fileList }) =>{
        
        this.setState({ fileList })
    } 
    handlePreviewImageOption = (record)=>{
        
        if(record.images && record.images.length > 0){
            
            this.setState({
                previewVisible: true,
                previewImage: record.images,
                recordKey: record.key
            })
        }
        
    }
    onOkPreviewModalImage=()=>{
        this.setState({
            previewVisible: false,
            previewImage: [],
        });
    }
    onCancelPreviewShowImage = ()=>{
        this.setState({
            previewVisible: false,
            previewImage: [],
        });
    }
    handleChangeAddOptionImagePrev=({fileList})=>{
        this.setState({
            previewImage: fileList
        })
    }
    componentWillReceiveProps(nextProps){
       
        if(nextProps.variants !== this.props.variants){
                var variants=nextProps.variants;
                
                try{
                    var _columns=[];
                    var _tags=[];   
                    variants.map((e,index)=>{
                            
                        _columns.push({
                                  title: e.name,
                                  dataIndex: e.variantid,
                                  key: e.variantid,
                                  onFilter: (value, record) => record[e.variantid].indexOf(value) === 0,
                                });
                        _tags.push({
                                _id: e.variantid,
                                name:e.name,
                                values: e.value,
                                orderby: e.orderby,
                            })

                        });
                    
               _columns.push({
                            title: 'Giá',
                            dataIndex: 'price',
                            key: 'price',
                            render: (text,record)=> (<InputNumber defaultValue={record.price}  onChange={(price)=>{
                                record.price=price;
                            }}/>)
                        });
                _columns.push({
                            title: 'Số lượng',
                            dataIndex: 'amount',
                            key: 'amount',
                            render: (text,record)=> (<InputNumber defaultValue={record.amount} onChange={(amount)=>{
                                record.amount=amount;
                            }}/>)
                        })       
                _columns.push({
                    title: '',
                    dataIndex: 'action',
                    key: 'action',
                    render: (text,record)=> {
                        var image="";
                        if(record.images){
                            image=(<Icon type="eye" onClick={()=>{this.handlePreviewImageOption(record)}}/>);
                        }
                        console.log(record);
                        return (
                            <div>
                            <Popconfirm
                                title="Sure to cancel?"
                                onConfirm={() => this.handleDeleteRows(record)}
                              >
                                <Icon type="delete"/>
                              </Popconfirm>
                              <Link to={`/products/v2/option/`+this.state.productid+`?variant=`+record.key} >
                                <Icon type="edit"/>
                              </Link>
                            {image}
                            </div>  
                        )
                    }
                    });
               
                this.setState({
                    columns: _columns,
                    tags: _tags,
                });
                if(nextProps.defaultSource !== this.props.defaultSource){
                    var defaultSource=nextProps.defaultSource;
                    var dataSources=[];
                    defaultSource.map((e,index)=>{
                        var row={
                            key: e.optid,
                            ...e.attrs,
                            price: e.price,
                            images:e.images,
                            amount: e.amount,
                        }
                        dataSources[index]=row
                    });
                    this.setState({
                        dataSources
                    })
                }
                }catch(e){
                    console.log(e);
                }
                
            }
        }
    
    render(){
        const {form: { getFieldDecorator,getFieldValue }} = this.props;
        const { changePrice, selectedRowKeys,dataSources,fileList,columns,selectedTags,rowSelection,tags ,listImage} =this.state;
        var rowSelect=rowSelection;
       
        rowSelect.selectedRowKeys=this.state.selectedRowKeys;
        var tag=[];
        this.state.tags.map((e,index)=>{
            var item=(<Row key={index} >
                        <Col md={24} xs={24}>{e.name} : {e.values.map(tag=> (<CheckableTag
            key={tag}
            checked={selectedTags.indexOf(tag) > -1}
            onChange={checked => {
                            var value={[e._id]: tag,_id: e._id};
                            this.handleChange(tag, checked,value)}
                     }
          >
            {tag}
          </CheckableTag>))}</Col>
                      </Row>);
            tag.push(item)          
        })
         const uploadButton = (
          <div>
            <Icon type="plus" />
            <div className="ant-upload-text">Upload</div>
          </div>
        );
        
        return (
            <Row>
                {tag}
                {this.state.selectedRowKeys.length > 0 &&
                        <Row>
                            <Button onClick={this.showModalAddImage}>Add Image</Button>
                        </Row>   
                    }
                <Table 
                    dataSource={dataSources} rowSelection={rowSelect}  columns={columns} />
                    <FormItem  {...this.formLayout}>
                        {getFieldDecorator('options', {
                            initialValue: dataSources
                        })(<Input type="hidden" />)}
                    </FormItem>
                    <FormItem  {...this.formLayout}>
                        {getFieldDecorator('variants', {
                            initialValue: this.state.tags
                        })(<Input type="hidden" />)}
                    </FormItem>
                  <Modal title="Add Image"
                      visible={this.state.showAddImage}
                      onOk={this.onOkShowModalImage}
                      onCancel={this.onCancelShowImage}
                      >
                      <Upload
                          action="/api/image/upload"
                          listType="picture-card"
                          multiple
                          fileList={fileList}
                          onChange={this.handleChangeAddOptionImage}
                        >
                          {fileList.length >= 10 ? null : uploadButton}
                        </Upload>      
                  </Modal>  
                  <Modal title="Preview"
                      visible={this.state.previewVisible}
                      onOk={this.onOkPreviewModalImage}
                      onCancel={this.onCancelPreviewShowImage}
                      >
                      <ul className={styles.previewImage}>
                        {this.state.previewImage.map(e=>{
                            return(<li key={e}> 
                                    <img src={`/image/`+e} style={{width:'100px'}}/>
                                </li>)    
                            })
                        }
                      </ul>      
                  </Modal>  
                         
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
class ProductEdit extends PureComponent {
  state = { 
        currency: 'USD',
        imageUrl:'',
        variantVisible: false,
        editVariantVisible: false,
        previewVisible: false,
        previewImage: '',
        fileList: [],
        imgHover: false,
        variants: [],
        images: [],
        editorDesc: EditorState.createEmpty(),
        editorMaterial: EditorState.createEmpty(),
        editorSize: EditorState.createEmpty(),
        editorDetail: EditorState.createEmpty(),
        options: [],
        images: [],
        hasImage: false,
        productDetail: {},
        CategoriesOptions: [],
        productid: '',
      
    };
handleSubmit=(e)=>{
    const {dispatch , form} = this.props;
     e.preventDefault();
     form.validateFieldsAndScroll((err, values) => {
      if (!err) {
           values.lname=encodeVI(values.name);
           if(Array.isArray(values.images)){
               values.thumbnail=values.images[0];
           }
           dispatch({
              type: 'product/update',
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
showAddVariant = () => {
    this.setState({
      variantVisible: true,
    });
  }
handleCancelVariant = (e) => {
    console.log(e);
    this.setState({
      variantVisible: false,
    });
  }
handleOkVariant = (e) => {
    this.setState({
      variantVisible: false,
    });
  }
handleVariantSubmit =(values)=>{
    this.setState({variants: values});
}

showEditVariant =()=>{
    this.setState({
      editVariantVisible: true,
    });
}
handleOkEditVariant =(e)=>{
    this.setState({
      editVariantVisible: false,
    });
}
handleCancelEditVariant =(e)=>{
    this.setState({
      editVariantVisible: false,
    });
}
handleEditVariantSubmit =(values)=>{
    this.setState({variants: values});
}

changeCurrency=(e)=>{
    this.setState({
        currency: e
    })
}
handleCallback = (e)=>{
    const {form} = this.props;
    form.setFieldsValue({
        images: e,
    });
    if(e){
        this.setState({
            colors: e
        })
    }
    
}
handleDrop=(accepted,rejected)=>{
}
handleChangeCategory=(e)=>{
    console.log(e);
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

onEditorStateChange = (editorDesc) => {
    this.setState({
      editorDesc,
    });
  };
onEditorMaterialChange = (editorMaterial) => {
    this.setState({
      editorMaterial,
    });
  };
onEditorSizeChange = (editorSize) => {
    this.setState({
      editorSize,
    });
  };
onEditorDetailChange = (editorDetail) => {
    this.setState({
      editorDetail,
    });
  };



uploadFileButton =(
    <Button type="button">Thêm hình ảnh</Button>
)
callback =(e)=>{
    console.log(e);
}
uiCardImgExtra=(
    <div>
        <span>Ảnh đại diện</span>
        <span>Ảnh</span>
    </div>
);
componentDidMount(){
     const {dispatch,match} = this.props;
     this.setState({productid: match.params.productid})
     dispatch({
        type: 'order/fetchRaito',
        payload:{},
    })
     dispatch({
        type: 'category/lver2',
        payload:{},
    })
     dispatch({
        type: 'product/getBy',
        payload:match.params.productid,
    })
     dispatch({
        type: 'product/optionsBy',
        payload:match.params.productid,
    })
     dispatch({
        type: 'product/variantsBy',
        payload:match.params.productid,
    })
     
}
componentWillReceiveProps(nextProps){
  if(nextProps.category!==this.props.category){
    //Perform some operation
    //var treeData=nextProps.category.treeMap;
    //this.setState({treeData});
      try{
          var category=nextProps.category.data.list;
          this.setState({CategoriesOptions: category})
      }catch(e){
          
      }
  }
  if(nextProps.product!==this.props.product) {
      var product=nextProps.product;
      try{
          let desc = ContentState.createFromBlockArray(htmlToDraft(detail.descriptions.desc));
          product.detail.defaultDesc= EditorState.createWithContent(desc);
          let desc_detail = ContentState.createFromBlockArray(htmlToDraft(detail.descriptions.desc_detail));
         
          product.detail.defaultDescDetail= EditorState.createWithContent(desc_detail);
          let material = ContentState.createFromBlockArray(htmlToDraft(detail.descriptions.material));
          product.detail.defaultMaterial= EditorState.createWithContent(material);
          
          let size_desc = ContentState.createFromBlockArray(htmlToDraft(detail.descriptions.size_desc));
          product.detail.defaultSize= EditorState.createWithContent(size_desc);
          
      }catch(e){
          
      }
      var images=(product.detail.images) ? product.detail.images : [];
      var variants=(Array.isArray(product.variants)) ? product.variants : [];
      var options=(Array.isArray(product.options)) ? product.options : [];
      
      this.setState({
          productDetail: product.detail,
          options,
          variants ,
          images
      });
  }   
  if(nextProps.order!==this.props.order) {
      let ls=[];
      let listRaito=[];  
      try{  
        
        var order=  nextProps.order;
        if(order.currency){
            order.currency.raito.forEach(function(e){
                ls.push(<SelectOption value={e.currency} key={e.currency}>{e.currency}</SelectOption>);
                listRaito[[e.currency]]=e.raito;
            });
            }
        }catch(e){

        }
        this.setState({
            listRaito,ls
        })    
  }
  
}
render() {
    const {
      loading, 
      product: { data },
    } = this.props;
    const {
      form: { getFieldDecorator,getFieldValue },form
    } = this.props;
    const {currency,fileList, thumbnail,sizeData,image,treeData,listRaito,ls,productDetail,variants,options,CategoriesOptions}=this.state;
    const imageUrl = this.state.imageUrl;
    let htmlDescription=draftToHtml(convertToRaw(this.state.editorDesc.getCurrentContent()))
    let htmlMaterials=draftToHtml(convertToRaw(this.state.editorMaterial.getCurrentContent()))
    let htmlSizeDesc=draftToHtml(convertToRaw(this.state.editorSize.getCurrentContent()))
    let htmlDetail=draftToHtml(convertToRaw(this.state.editorDetail.getCurrentContent()))
    var selectOption=[];
    if(CategoriesOptions && CategoriesOptions.length > 0){
      CategoriesOptions.map((e,index)=>{
          selectOption[index]=(<SelectOption key={index} value={e.id}>{e.title}</SelectOption>)
      })
    }
    var optionExtra=(
    <div>
        <a href="javascript: void(0)" onClick={this.showAddVariant}>Add Variants</a> |
        <a href="javascript: void(0)" onClick={this.showEditVariant}>Edit Variants</a> |
        <Link to={`/products/v2/option/`+this.state.productid} >Add Option</Link>
    </div>
    )
    return (  
      <PageHeaderWrapper> 
        <Form onSubmit={this.handleSubmit} className="login-form">
        <div className={styles.container}>
        <div>
            <Row>
                <Col md={17} className={styles.box} >
                    <div className={styles.boxBorder}>
                        <div className={styles.uiLayoutItem}>
                             <UICard> 
                                <FormItem label="Tên: "  {...this.formLayout}>
                                    {getFieldDecorator('name', {
                                        rules:[{required: true, message: 'Nhập tên sản phẩm!'}],
                                        initialValue:  productDetail.name 
                                    })(<Input />)}
                                       
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator('productid', {
                                        initialValue:  productDetail.productid 
                                    })(<Input type="hidden"/>)}
                                       
                                </FormItem>       
                                 <Tabs onChange={this.callback}>
                                    <TabPane tab="Mô tả" key="1">
                                       <FormItem>
                                              <div style={{backgroundColor:'white'}}>
                                                  <Editor
                                                      editorState={productDetail.defaultDesc }
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
                                    </TabPane>
                                    <TabPane tab="Chất liệu & Cách sử dụng" key="2">
                                        <FormItem>
                                              <div style={{backgroundColor:'white'}}>
                                                  <Editor
                                                      editorState={productDetail.defaultMaterial }
                                                      wrapperClassName={styles['demo-wrapper']}
                                                      editorClassName={styles['demo-editor']}
                                                     toolbar={{
                                                        fontSize:{ className: styles['editor-custom-font-size'] },
                                                        fontFamily:{ className: styles['editor-custom-font-family']}
                                                    }}
                                                      onEditorStateChange={this.onEditorMaterialChange}
                                                    />
                                                  <FormItem  {...this.formLayout}>
                                                    {getFieldDecorator('materials_use', {
                                                        initialValue: htmlMaterials
                                                    })(
                                                      <TextArea
                                                        disabled 
                                                        style={{'display': 'none'}}
                                                    />
                                                    )}
                                                  </FormItem>
                                              </div>
                                         </FormItem>
                                    </TabPane>
                                    <TabPane tab="Chi tiết kích cỡ" key="3">
                                        <FormItem>
                                              <div style={{backgroundColor:'white'}}>
                                                  <Editor
                                                      editorState={productDetail.defaultSize}
                                                      wrapperClassName={styles['demo-wrapper']}
                                                      editorClassName={styles['demo-editor']}
                                                     toolbar={{
                                                        fontSize:{ className: styles['editor-custom-font-size'] },
                                                        fontFamily:{ className: styles['editor-custom-font-family']}
                                                    }}
                                                      onEditorStateChange={this.onEditorSizeChange}
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
                                        
                                    </TabPane>
                                    <TabPane tab="Mô tả chi tiết" key="4">
                                        <FormItem>
                                              <div style={{backgroundColor:'white'}}>
                                                  <Editor
                                                      editorState={productDetail.defaultDescDetail }
                                                      wrapperClassName={styles['demo-wrapper']}
                                                      editorClassName={styles['demo-editor']}
                                                     toolbar={{
                                                        fontSize:{ className: styles['editor-custom-font-size'] },
                                                        fontFamily:{ className: styles['editor-custom-font-family']}
                                                    }}
                                                      onEditorStateChange={this.onEditorDetailChange}
                                                    />
                                                  <FormItem  {...this.formLayout}>
                                                    {getFieldDecorator('desc_detail', {
                                                            initialValue: htmlDetail
                                                    })(
                                                      <TextArea
                                                        disabled 
                                                        style={{'display': 'none'}}
                                                    />
                                                    )}
                                                  </FormItem>
                                              </div>
                                         </FormItem></TabPane>
                                  </Tabs>       
                                
                            </UICard>
                        </div>
                        <div className={styles.uiLayoutItem}>
                                       
                            <Card title="Hình ảnh" extra={this.uiCardImgExtra}>
                                <Row>
                                    <Col md={24}>
                                        <ListImageUpload 
                                            onDrop={this.handleDrop}
                                            refs={this.handleCallback}
                                            dataSource={ this.state.images }
                                            
                                            />	             
                                    </Col>   
                                </Row>        
                            </Card>           
                        </div> 
                        <div className={styles.uiLayoutItem}>
                            <UICard title="Giá">
                                <Row>
                                    <Col xs={24} md={24}>
                                         <FormItem label="Loại tiền: " {...this.formLayoutSelect}>
                                            {getFieldDecorator('currency', {
                                                initialValue: productDetail.currency
                                            }) (<Select
                                                    onChange={this.changeCurrency}
                                                >
                                                    {ls}
                                                </Select>)}
                                        </FormItem>
                                    </Col>
                                </Row>                
                                <Row>
                                    <Col xs={12} md={12}>
                                       <FormItem label="Giá gốc"  {...this.formLayout}>
                                            {getFieldDecorator('price', {
                                                initialValue: productDetail.price
                                            })(<InputNumber className={styles.inputNumber} />)}
                                        </FormItem>        
                                    </Col>
                                    <Col xs={12} md={12} >
                                       <FormItem label="Sale"  {...this.formLayout}>
                                            {getFieldDecorator('sale', {
                                               initialValue: (productDetail.sale) ? productDetail.sale.saleOff : null
                                            })(<InputNumber className={styles.inputNumber}/>)}
                                        </FormItem>        
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12} md={12}>
                                       <FormItem label="Giá đã sale"  {...this.formLayout}>
                                            {getFieldDecorator('sale_price', {
                                               initialValue: (productDetail.sale) ? productDetail.sale.salePrice : null
                                            })(<InputNumber className={styles.inputNumber}/>)}
                                        </FormItem>        
                                    </Col>
                                    <Col xs={12} md={12} >
                                        <FormItem label="Số lượng"  {...this.formLayout}>
                                            {getFieldDecorator('amount', {
                                                initialValue: productDetail.amount
                                            })(<InputNumber  />)}
                                        </FormItem>
                                     </Col> 
                                </Row>
                                
                            </UICard>     
                        </div> 
                        <div className={styles.uiLayoutItem}>
                            <Card title="Lựa chọn" extra={optionExtra}>
                                <A variants={this.state.variants} {...this.props} defaultSource={this.state.options}/>               
                            </Card>  
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
                                       initialValue: productDetail.nodeid
                                })( 
                                <Select
                                  mode="multiple"
                                  onChange={this.handleChangeCategory}
                                  style={{ width: '100%' }}
                                >
                                  {selectOption}
                                </Select>                
                                 
                                )}
                                </FormItem>
                                { 1==2 &&
                                <div className={styles.uiCatLayout}>
                                    <div className={styles.uiCatList}>
                                        <div className={styles.uiCatItem}>
                                            Ten danh muc
                                            <Icon type='close' className={styles.iconClose} onClick={this.handleRemoveCategory.bind(this,'abc')} />
                                        </div>   
                                    </div>
                                </div> 
                                }
                            </UICard>
                        </div>
                        <div className={styles.uiLayoutItem}>
                            <Card title="Thông tin">
                                <Row>
                                     <Col md={24}>
                                        <FormItem label="Loại sản phẩm"  {...this.formLayout}>
                                            {getFieldDecorator('type', {
                                                 initialValue: productDetail.type
                                            })(<Input />)}
                                        </FormItem>
                                     </Col> 
                                </Row>
                                <Row>
                                     <Col md={24}>
                                        <FormItem label="Thương hiệu"  {...this.formLayout}>
                                            {getFieldDecorator('brand', {
                                                initialValue: productDetail.brand
                                            })(<Input />)}
                                        </FormItem>
                                     </Col> 
                                </Row>
                                <Row>
                                     <Col md={24}>
                                        <FormItem label="Người bán"  {...this.formLayout}>
                                            {getFieldDecorator('seller', {
                                                initialValue: productDetail.seller
                                            })(<Input />)}
                                        </FormItem>
                                     </Col> 
                                </Row>
                                <Row>
                                     <Col md={24}>
                                        <FormItem label="NSX"  {...this.formLayout}>
                                            {getFieldDecorator('manufacturer', {
                                                initialValue: productDetail.manufacturer
                                            })(<Input />)}
                                        </FormItem>
                                     </Col> 
                                </Row> 
                                <Row>
                                     <Col md={24}>
                                        <FormItem label="Kiểu kích cỡ"  {...this.formLayout}>
                                            {getFieldDecorator('size_type', {
                                                initialValue: productDetail.size_type
                                            })(<Input />)}
                                        </FormItem>
                                     </Col> 
                                </Row>                
                            </Card>
                        </div> 
                        <div className={styles.uiLayoutItem}>
                           <Card className={styles.uiCardBgColor} title='Tags'>
                                <FormItem  {...this.formLayout}>
                                    {getFieldDecorator('tag', {
                                        initialValue: productDetail.tag
                                     })(<Input />)}
                                </FormItem>
                            </Card>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>                                 
                <div className={styles.uiLayoutItem}>
                    <UICard className={styles.uiCardBgColor}>                               
                        <Row>
                            <Col md={24}>
                                <FormItem>
                                    <Button type="primary" htmlType="submit" loading={loading}>Thêm mới</Button>
                                </FormItem>
                            </Col> 
                        </Row>
                    </UICard>    
                </div>                              
            </Row>                                   
        </div>                                       
        </div>
        </Form>
                                               
        <Modal
              title="Variants"
              visible={this.state.variantVisible}
              onOk={this.handleOkVariant}
              onCancel={this.handleCancelVariant}
            >
            <AddVariant defaultSource={this.state.variants}  variantSubmit={this.handleVariantSubmit}/>
        </Modal>   
        <Modal
              title="Edit"
              visible={this.state.editVariantVisible}
              onOk={this.handleOkEditVariant}
              onCancel={this.handleCancelEditVariant}
            >
            <EditVariant defaultSource={this.state.variants}  variantSubmit={this.handleEditVariantSubmit}/>
        </Modal>                                
      </PageHeaderWrapper>
    );
  }
}

export default ProductEdit;
