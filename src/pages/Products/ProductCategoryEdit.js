import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { change_alias,encodeVI } from '@/utils/utils';
import { formatMessage, FormattedMessage } from 'umi/locale';
import  FieldSet  from './FieldSet';
import moment from 'moment';
var currencyFormatter = require('currency-formatter');
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
  Table,    
  InputNumber,
  Tag,
  Divider,
  Tooltip
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './ProductOption.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const {RangePicker} = DatePicker;
const { Search, TextArea } = Input;
const TreeNode = TreeSelect.TreeNode;

class EditVariant extends PureComponent{
    
    render(){
        const { data } = this.props;    
        return (
            <div>
                Edit SP
            </div>
        )
    }
}

class A extends PureComponent {
    state={
        dataSource:[],
        columns: [],
        removeValue: [],
        selectedRowKeys: [],
        visible: false,
    }
    componentDidMount(){
        const { source } = this.props;
        this.setState({
            dataSources: source
        })
    }
    handleDelete=(val)=>{
        const { dataSources } = this.state;
        
        if(val.key){
           var dataSource=dataSources.filter(e=>{
                return (e.key!=val.key);
            });
            this.setState({dataSources: dataSource,editSource: true})
        }
    }
    handleChangePrice=(value)=>{
        this.setState({
            price:value,
        })
    }
    changePrice =(e)=>{
        const { price } = this.state;
        if(price!=undefined){
            e.price=price;
            this.setState({
                changePrice: e,
            })
        }
        
    }
    handleChangeAmount=(value)=>{
        this.setState({
            amount:value,
        })
    }
    changeAmount =(e)=>{
        const { amount } = this.state;
        if(amount !=undefined){
            e.amount=amount;
            this.setState({
                changeAmount: e,
            })
        }
        
    }
    handleEdit=(e)=>{
        this.setState({visible: true})
    }
    onSelection =(e)=>{
        console.log("SELECT ROW",e);
    }
    onSelectChange = (selectedRowKeys) => {
        console.log(selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    handleChangeTable=(record)=>{
        console.log(record);
    }
    showModal = () => {
        this.setState({
          visible: true,
        });
      }

      handleOk = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
      }

      handleCancel = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
      }
    render(){
        const { data: { sizes,colors,styles } }=this.props;
        const {form: { getFieldDecorator,getFieldValue }} = this.props;
        const { removeValue,changeAmount,changePrice, selectedRowKeys,dataSources,editSource } =this.state;
        
        const rowSelection = {
          selectedRowKeys,
          onChange: this.onSelectChange,
          hideDefaultSelections: true,
          onSelection: this.onSelection,    
        };
        var render=false;
        var columns=[];
        
        if(sizes && sizes.length > 0){
            render=true;
            var filter=[];
            sizes.map(val=>{
               var e= Object.values(val)[0];
               var itemFilter={
                   text: e,
                   value: e,
               }
               filter.push(itemFilter);
            });
            columns.push({
              title: 'Kích cỡ',
              dataIndex: 'size',
              key: 'size', 
              filters:filter,    
              onFilter: (value, record) =>{ 
                  if(record.size.toString()===value){
                            return true ;    
                    }
                  else return false;
                }, 
            });
        }
        if(colors && colors.length > 0){
            var filter=[];
            colors.map(val=>{
               var e= Object.values(val)[0];
               var itemFilter={
                   text: e,
                   value: e,
               }
               filter.push(itemFilter);
                    
            });
            columns.push({
              title: 'Màu sắc',
              dataIndex: 'color',
              key: 'color', 
             filters:filter,    
              onFilter: (value, record) =>{ 
                  if(record.color.toString()===value){
                            return true ;    
                    }
                  else return false;
                }, 
            });
            render=true;
        }
        if(styles && styles.length > 0){
            render=true;
            let styleItems=[];
            columns.push({
              title: 'Kiểu dáng',
              dataIndex: 'style',
              key: 'style',
            });
        }
        if(render){
            columns.push({
              title: 'Giá',
              dataIndex: 'price',
              key: 'price',
              render:(text, record) => (
                    <span>
                      <InputNumber key={`price-${record.key}`} defaultValue={(record.price) ? (record.price) : (0)} onChange={this.handleChangePrice} onBlur={()=>{this.changePrice(record)}} />
                    </span>
                )     
            });
            columns.push({
              title: 'Số lượng',
              dataIndex: 'amount',
              key: 'amount',
              render:(text, record) => (
                    <span>
                      <InputNumber key={`amount-${record.key}`} defaultValue={(record.amount) ? (record.amount) : (0)}  onChange={this.handleChangeAmount} onBlur={()=>{this.changeAmount(record)}} />
                    </span>
                )    
            });
            columns.push({
              title: ' ',
              key: 'action',
              render:(text, record) => (
                    <span>
                      <Link to={`/products/edit/${record.itemid}/${record.sku}`} alt="Thay đổi" 
                        ><Icon type="edit" /></Link>
                      <Divider type="vertical" />
                      <a href="javascript:void(0);" alt="Xoá"  onClick={()=>{this.handleDelete(record)}}><Icon type="close-circle" /></a>
                    </span>
                )   
            });
        }
        var dataSource=(editSource) ? dataSources : this.props.source;
   
        <div>
            <FormItem>
                        {getFieldDecorator('variants', {
                            initialValue:  dataSource,
                        })(<Input />)}
            </FormItem>
        </div>
        return (
        <div>
            <Row>
                <FormItem>
                        <Button>{ `(${selectedRowKeys.length}) Thêm Ảnh` }   </Button>
                        <Button>{ `(${selectedRowKeys.length}) In Stock` }   </Button>
                        
                        <Button>{ `(${selectedRowKeys.length}) Thêm màu` }   </Button>
                        <Button>{ `(${selectedRowKeys.length}) Thêm size` }   </Button>
                </FormItem>
            </Row>
            
            <Row>
                <Table 
                    rowSelection={rowSelection} 
                    dataSource={dataSource} columns={columns} />
            </Row>
            <Modal
              title="Basic Modal"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
                <EditVariant  data='' />   
            </Modal>    
        </div>
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
class ProductCategoryEdit extends PureComponent {
  state = { 
        colors: [],
        colorVisible: false,
        colorValue: '',
        sizes:[],
        sizeVisible: false,
        sizeValue:'',
      
        styles: [],
        styleVisible: false,
        styleValue: '',
        currency: 'USD',
        imageUrl:'',
        previewVisible: false,
        previewImage: '',
        fileList: [],
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

changeCurrency=(e)=>{
    this.setState({
        currency: e
    })
}
componentWillMount(){
    const {dispatch} = this.props;
    dispatch({
        type: 'product/getPOD',
        payload:{},
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
    });
}
//===Color
showColor = () => {
    this.setState({ colorVisible: true }, () => this.input.focus());
}
handleColorChange = (e) => {
    this.setState({ colorValue: e.target.value });
}
handleColorClose = (removedTag) => {
    const tags = this.state.colors.filter(tag => tag !== removedTag);
    this.setState({ colors:tags });
}
handleColorConfirm = () => {
    
    const state = this.state;
    const inputValue = state.colorValue;
    let tags = state.colors;
   
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      colors: tags,
      colorVisible: false,
      colorValue: '',
    
    });
  }
saveColorRef = input => this.input = input
renderColor(){
    const {  colorVisible, colorValue } = this.state;
    const { product:{ data } } =this.props;
    var colors  = (data && data.attrs && data.attrs.colors) ? Object.values(data.attrs.colors) : [];
    return (
        <div>
        {   
                colors.map((val, index) => {
                  var tag=Object.values(val)[0];
                  const isLongTag = tag.length > 20;
                
                  const tagElem = (
                    <Tag key={tag} closable={index+1} afterClose={() => this.handleColorClose(tag)}>
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </Tag>
                  );
                  return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {colorVisible && (
                  <Input
                    ref={this.saveColorRef}
                    type="text"
                    style={{ width: 78 }}
                    value={colorValue}
                    onChange={this.handleColorChange}
                    onBlur={this.handleColorConfirm}
                    onPressEnter={this.handleColorConfirm}
                  />
                )}
                {!colorVisible && (
                  <Tag
                    onClick={this.showColor}
                    style={{ background: '#fff', borderStyle: 'dashed' }}
                  >
                    <Icon type="plus" /> Thêm
                  </Tag>
                )} 
        </div>
        )
}

renderSizes(){
    const { sizeVisible, sizeValue } = this.state;
    const { product:{ data } } =this.props;
    var sizes  = (data && data.attrs && data.attrs.sizes) ? Object.values(data.attrs.sizes) : [];
    return (
        <div>
        {sizes.map((val, index) => {
                  var tag=Object.values(val)[0];
                  const isLongTag = tag.length > 20;
                  const tagElem = (
                    <Tag key={tag} closable={index+1} afterClose={() => this.handleSizeClose(tag)}>
                      {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                    </Tag>
                  );
                  return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                })}
                {sizeVisible && (
                  <Input
                    ref={this.saveSizeRef}
                    type="text"
                    style={{ width: 78 }}
                    value={sizeValue}
                    onChange={this.handleSizeChange}
                    onBlur={this.handleSizeConfirm}
                    onPressEnter={this.handleSizeConfirm}
                  />
                      
                )}
                {!sizeVisible && (
                  <Tag
                    onClick={this.showSize}
                    style={{ background: '#fff', borderStyle: 'dashed' }}
                  >
                    <Icon type="plus" /> Thêm
                  </Tag>
                )} 
        </div>
        )
}

formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
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
    //console.log(data);
    const {currency,fileList, thumbnail}=this.state;
    const sizeData=[
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
    ]
    var sizes  = (data && data.attrs && data.attrs.sizes) ? Object.values(data.attrs.sizes) : [];
    var colors = (data && data.attrs && data.attrs.colors) ? Object.values(data.attrs.colors) : [];
    var styles = (data && data.attrs && data.attrs.styles) ? Object.values(data.attrs.styles) : [];
    var totalItems=(data && data.variants) ? data.variants : [];
    const options={
        sizes,
        colors,
        styles
    }
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
    
    if(fileList && fileList.length > 0){
        fileList.map((e,i)=>{
            if(e.response && e.response.status=='ok' && e.response.file.isValid) image.push(e.response.file.imageid)
        }) 
    }else{
    }
    
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
    let name=data.name;
    let nodeid=data.nodeid;
    let price=data.price;
    let sale= data.sale;
    let sale_price=data.sale_price;
    let amount=data.amount;
    let size_style=data.size_style;

    let initFile=[];
    let defaultFileList=[];

    console.log(data.attr);

    if(data.attr && data.attr.images){
            data.attr.images.map((e,i)=>{
                initFile.push({
                    uid: e,
                    url: `/api/product/image/${e}`
                })
            })
            defaultFileList=initFile;
    }
    
    let initFileList=(fileList) ? fileList : initFile;

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
                             >
                            {ls}
                        </Select>)}
                    </FormItem> 
                </Col>
            </Row>
            <Row>
                 <Col md={12}>
                    <FormItem label="Tên"  {...this.formLayout}>
                        {getFieldDecorator('name', {
                            initialValue : name,
                            onChange: this.handleTitle ,
                        })(<Input />)}
                    </FormItem>
                 </Col> 
                 <Col md={12}>
                   <FormItem label="Danh mục" {...this.formLayout}>
                    {getFieldDecorator('nodeid', {
                      initialValue: nodeid
                    })( 
                     <TreeSelect
                        showSearch
                        style={{ width: 265 }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        allowClear
                        multiple
                        treeData={treeData}
                      >

                     </TreeSelect>
                    )}
                </FormItem>     
                 </Col> 
            </Row>
            <Row>
                           
            </Row>
            <Row>
                <Col md={12}>
                   <FormItem label="Giá gốc"  {...this.formLayout}>
                        {getFieldDecorator('price', {
                            initialValue: price
                        })(<Input />)}
                    </FormItem>        
                </Col>
                <Col md={12}>
                   <FormItem label="Sale"  {...this.formLayout}>
                        {getFieldDecorator('sale', {
                            initialValue: sale
                        })(<Input />)}
                    </FormItem>        
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                   <FormItem label="Giá đã sale"  {...this.formLayout}>
                        {getFieldDecorator('sale_price', {
                            initialValue: sale_price
                        })(<Input />)}
                    </FormItem>        
                </Col>
                <Col md={12}>
                    <FormItem label="Số lượng"  {...this.formLayout}>
                        {getFieldDecorator('amount', {
                            
                        })(<Input />)}
                    </FormItem>
                 </Col> 
            </Row>
            <Row>
                <Col md={12}>
                   <div>Màu sắc:</div>
                   <div>{ this.renderColor()} </div>      
                    <FormItem {...this.formLayout}>
                            {getFieldDecorator('colors', {
                                initialValue: colors
                            })(
                              <Input type="hidden" />
                            )}
                    </FormItem>
                </Col>  
                 
            </Row> 
            <Row>
                <Col md={12}>
                   <div>Kích cỡ:</div>
                    <div>{ this.renderSizes()} </div>   
                    <FormItem {...this.formLayout}>
                            {getFieldDecorator('sizes', {
                                initialValue: sizes
                            })(
                              <Input type="hidden" />
                            )}
                    </FormItem>
                </Col>  
                <Col md={12}>
                    <FormItem label="Loại kích cỡ" {...this.formLayout}>
                        {getFieldDecorator('size_type', {
                                initialValue: size_style
                        }) (<TreeSelect
                                showSearch
                                style={{ width: 265 }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                allowClear
                                treeData={sizeData}
                            ></TreeSelect>
                     )}
                    </FormItem> 
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                   <div>Kiểu dáng:</div>
                    <FormItem {...this.formLayout}>
                            {getFieldDecorator('styles', {
                                initialValue: this.state.styles
                            })(
                              <Input type="hidden" />
                            )}
                    </FormItem>
                </Col>
                
            </Row>
            <Row>
                <Col md={24}>
                   <A data={options} source={totalItems} form={form}/>
                </Col>
            </Row>
            <FieldSet title="Hình ảnh ">
                <Row>
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
                        <Col md={12}>
                            <FormItem label="Hình ảnh" {...this.formLayout}>
                                        <Upload
                                              defaultFileList={defaultFileList}  
                                              action="/api/upload/"
                                              listType="picture-card"
                                              fileList={fileList}
                                              onPreview={this.handlePreview}
                                              onChange={this.handleChange}
                                              onRemove={this.handleRemove}
                                              multiple
                                            >
                                           {(fileList.length > 15) ? null : uploadButton}
                                        </Upload>
                                  </FormItem>  
                        </Col>
                </Row>
            </FieldSet>
            
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
             <Col md={12}>
                        <FormItem label="Seo Link"  {...this.formLayout}>
                            {getFieldDecorator('view_seo_link', {
                              initialValue: this.state.seo_link,
                              onChange: this.handleTitle ,
                            })(
                              <Input />
                            )}
                          </FormItem>
            </Col>
            </Row>
            <FormItem>
                    <Button type="primary" htmlType="submit" loading={loading}>Thêm mới</Button>
                </FormItem>
            </Form> 
      </PageHeaderWrapper>
    );
  }
}

export default ProductCategoryEdit;
