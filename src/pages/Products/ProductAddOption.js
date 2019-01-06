import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Link} from 'react-router-dom';
import {
  Form, Input, Icon, Button,Row,Col,Card,InputNumber,Avatar
} from 'antd';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
let id = 0;

import styles from './ProductOption.less';
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
                
                var dataSource=nextProps.dataSource;
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
                this.props.refs({images});
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
                                    <div className={styles.imgNav}><Icon type="delete" onClick={()=>{this.removeImage(item)}} /></div>
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


@connect(({ loading,product }) => ({
    product
}))
@Form.create()
class ProductAddOption extends React.Component {
  state={
          productDetail:{},
          options:[],
          variants: [],
          images: [],
          productid: '',    
          defaultOption: {}, 
          optid:'',      
  }
  handleCallback =(e)=>{
      const {form} = this.props;
      this.setState({
          images: e.images
      })
  }
  handleDrop =(e)=>{
      console.log(e);
  }
  handleSubmit=(e)=>{
      const {dispatch , form} = this.props;
      const {variants} = this.state;
     e.preventDefault();
     form.validateFieldsAndScroll((err, values) => {
      if (!err) {
          var attrs={};
           variants.map(e=>{
               attrs[e.variantid]=values[e.variantid];
           });
          values.attrs=attrs;
          values.images=this.state.images;
          values.productid=this.state.productid;
          if(values.optid){
              dispatch({
                  type: "product/updateOption",
                  payload: values
              })
          }else{
              dispatch({
                  type: "product/addOption",
                  payload: values
              })
          }
      }
    }); 
  }
  handleEdit =(value)=>{
      const {dispatch,match ,history,location} = this.props;
      this.setState({
          defaultOption: value,
          images: value.images,
      })
      var pathname=location.pathname;
      var query="?variant="+value.optid;
      history.push(pathname+query);
  }
  handleRestFormOption=(e)=>{
      console.log('reset');
      this.setState({
          defaultOption: {}, 
          images: [],
          optid: ''
      })
  }
  componentWillMount(){
       const {dispatch,match,location} = this.props;
      
       this.setState({
           productid: match.params.productid,
           optid: location.query.variant
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
      //console.log(this.props);
  }
  componentWillReceiveProps(nextProps){
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
      var variants=(Array.isArray(product.variants)) ? product.variants : [];
      var options=(Array.isArray(product.options)) ? product.options : [];
      var defaultOption=options.filter(k=> this.state.optid == k.optid);
      var option=(Array.isArray(defaultOption) && defaultOption.length > 0 ) ?  defaultOption[0] : [];
      var images=option.images ?  option.images : []        
      this.setState({
          productDetail: product.detail,
          options,
          variants ,
          defaultOption:option,
          images
      });
  }   
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { form } =this.props;
    const { options,variants,productDetail,defaultOption } = this.state;  
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
        sm: { span: 24, offset: 0 },
      },
    };
    const optionExtra=this.state.defaultOption.optid ?  (
        <Link to={`/products/v2/option/`+this.state.productid} onClick={()=>this.handleRestFormOption()} > Add Option </Link>
    ) : null;
    const listItem=variants.map(e=>(
        <Row key={e.variantid}>
            <Col>
                <Form.Item label={e.name} {...formItemLayout}>
                  {getFieldDecorator(e.variantid, {
                      initialValue: (defaultOption.attrs) ?  defaultOption.attrs[e.variantid] : '',    
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [{
                        required: true,
                        whitespace: true,
                        message: "",
                      }],
                    })(
                      <Input style={{ width: '80%', marginRight: 8 }} />
                    )}
                </Form.Item>                
            </Col>
        </Row>
    ));  
    const listOptions=options.map(e=>{
        var variant=Object.values(e.attrs);
        var selected=(e.optid==this.state.defaultOption.optid) ? styles.active : '';
        return   (
                    <li key={e.optid} style={{display: 'block',width: '100%',borderBottom: '1px solid silver',float:'left',padding : '0.3rem',cursor:'pointer'}} onClick={()=>{this.handleEdit(e)}} className={selected}>
                        <div>
                            <Col xs={5}>
                                <div style={{paddingTop: '4px',textAlign:'center'}}>        
                                  <Avatar shape="square" size={64}  size="large" icon="user" />
                                </div>  
                            </Col>
                            <Col xs={19}>
                                    { variant.map((k,index)=>{
                                        var ik=(index==variant.length -1) ? null : '-'
                                            return (<span key={k}><b>{k}</b> {ik} </span>)
                                        })
                                    }
                                    
                            </Col>
                        </div>
                    </li>
                ) 
    })  
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
            <Col md={8} xs={24}>
                <Card title="Product">
                    <div>
                        <Col xs={5}>
                            <div>
                                <Avatar shape="square" size={128}  size="large" icon="user" />
                            </div>
                            
                        </Col>
                        <Col xs={19}>
                            <span><h3>{productDetail.name}</h3></span>
                            <span><i>{options.length} variants </i></span>
                            <Link to={`/products/v2/edit/`+this.state.productid}>Back Product</Link>
                        </Col>
                    </div>
                </Card>
                <Card title="Variants">
                    <ul style={{marginLeft:'-1.5rem',marginRight: '-1.5rem'}}>
                        {listOptions}
                    </ul>
                </Card>
            </Col>
            <Col md={16} xs={24}>
                <Card title="Option" extra={optionExtra}>
                    {listItem}
                </Card>
                <Card title="Price">
                    <Form.Item label="Giá" {...formItemLayout}>
                      {getFieldDecorator('price', {
                            initialValue: defaultOption.price
                        })(
                          <InputNumber style={{ width: '80%', marginRight: 8 }} />
                        )}
                    </Form.Item> 
                    <Form.Item label="Số lượng" {...formItemLayout}>
                      {getFieldDecorator('amount', {
                         initialValue: defaultOption.amount
                        })(
                          <InputNumber style={{ width: '80%', marginRight: 8 }} />
                        )}
                    </Form.Item> 
                    <Form.Item  {...formItemLayout}>
                      {getFieldDecorator('optid', {
                          initialValue: defaultOption.optid,
                        })(
                          <Input type="hidden" />
                        )}
                    </Form.Item> 
                </Card>
                <Card title="Hình Ảnh">
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
            </Col>
        </Row>
        { this.state.defaultOption.optid ? (
            <Form.Item {...formItemLayoutWithOutLabel}>
                <Button type="primary" htmlType="submit">Lưu lại</Button>
            </Form.Item>
        ) : (
            <Form.Item {...formItemLayoutWithOutLabel}>
                <Button type="primary" htmlType="submit">Thêm mới</Button>
            </Form.Item>
        )
        
        }
        
      </Form>
    );
  }
}
export default  ProductAddOption;