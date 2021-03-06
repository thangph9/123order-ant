import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Alert,
  Calendar,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  Popconfirm,    
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table    
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
var currencyFormatter = require('currency-formatter');
import styles from './style.less';
const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
/*UPDATE,ADD COMMENT */
const CreateFormComment = Form.create()(props => {
    const {  form, handleSaveComment,row ,loading } = props;
    const handleSave = (e) => {
        e.preventDefault();
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          form.resetFields();
          handleSaveComment(fieldsValue);
        });
      };
     const {  getFieldDecorator } = form
     const formLayout={
              labelCol: {
                xs: { span: 24 },
                sm: { span: 9 },
              },
              wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 24 },
              },
        }
     let comment='';
     let sbill_code='';
     if(row){
         comment=row.comment;
         sbill_code=row.sbill_code;
     }
      return (
        <Form onSubmit={handleSave} layout="inline">
            <Row gutter={{ md: 24, lg: 24, xl: 48 }}>
              <Col md={24} sm={24}>
                <FormItem {...formLayout}>
                  {getFieldDecorator('scomment',{
                    rules: [
                          {
                            required: true,
                            message: ' ',
                          },
                    ],
                    initialValue:comment,
          })(<TextArea placeholder="" style={{ minHeight: 32 }} rows={4} />)}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('sbill_code',{
                    initialValue:sbill_code,
                    })(<Input type="hidden" />)}
                </FormItem>
              </Col>
            <Col md={24} sm={24}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit" loading ={loading} >
                        Gửi
                      </Button>
                    </span>
                  </Col> 
            </Row> 
          </Form> 
        ) 
});
class CommentList extends PureComponent{
    state={
        editable:false,
    }
    componentDidMount(){
    }
    handleEditComment=(e)=>{
        const { handleEditComment,form } = this.props;
        
        //form.resetFields();
        //handleEditComment(e);
    }
    
    render(){
        
        const { data,handleEditComment,currentUser } =this.props;
        let editable=(data.username == currentUser.username) ? true : false;
        return (
            <div>
                <Row>
                    <Col xs={{ span: 12, offset: 0 }} lg={{ span: 5, offset: 0 }}>{data.username}</Col>
                    <Col xs={{ span: 12, offset: 0 }} lg={{ span: 16, offset: 0 }}>
                        <span><b>{data.comment}</b></span><br/>
                        <span><i>{moment(data.createat).format('DD-MM-YYYY h:mm:ss')}</i></span>
                    </Col>
                        
        {editable &&
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}><Button type="button" onClick={()=>handleEditComment(data)}>Edit</Button></Col>
        }
                </Row>
            </div>
        )
    }
}
/* eslint react/no-multi-comp:0 */
@connect(({ rule, loading,order,comment,user }) => ({
  rule,
  loading: loading.models.order,
  order,
  comment,
  user,   
}))
@Form.create()
class ConfirmDelivery extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    visibleFullScreenTable: false,
    expandForm: false,
    selectedRows: [],
    selectedRow:{},
    formValues: {},
    stepFormValues: {},
    editComment: false,  
    data:{
        list:[],
        pagination:{},
    },
    visible: false,  
    statusText:{
      pending  :'Chờ',
      paid      :'Đã đặt',
      back      :'Back cọc',
      tranfer   :'Chuyển cọc',
      cancel    :'Cancel',
    },
    changeStatus: false,  
  };  
   
  
  columns = [
    {
        title: 'Mã Bill',
        dataIndex: 'sbill_code',
        width: 100,
        fixed: 'left'
    },   
    {
        title: 'Ngày',
        dataIndex: 'ddate_paid',
        width: 150,
        fixed: 'left',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
        title: 'Tên SP',
        dataIndex: 'snameproduct',
        key:'snameproduct',
        width: 150,
        render: (text, record) => (
             <span>{(text) ? (text.substring(0,10)+"...") : "..."}</span>
        ),
    }, 
    
    {
        title: 'Code SP',
        dataIndex: 'scode',
        width: 150,    
        key:'scode',
    },
    
     
    {
        title: 'Size',
        dataIndex: 'ssize',
        key:'ssize',
        width: 150,
    },
    
    
    {
        title: 'Màu',
        dataIndex: 'scolor',
        key: 'scolor',
        width: 150,
        render: (text, record) => (
             <span>{(text) ? text.substring(0,10)+" ..." : ''}</span>
        ),
    },
    {
        title: 'Link SP',
        dataIndex: 'slinkproduct',
        key:'slinkproduct',
        render: (text, record) => (
             <a href={text} target="_blank">Link sản phẩm</a>
      ),
        width: 150,
    },  
    {
        title: 'SL',
        dataIndex: 'iquality',
        key: 'iquality',
        width: 150,
    },
    {
        title: 'Giá WEB',
        dataIndex: '_webprice',
        key: '_webprice',
        width: 150,
    }, 
    {
        title: 'Sale',
        dataIndex: '_sale',
        key: '_sale',
        width: 150,
    },
      {
        title: 'Ship Web',
        dataIndex: '_shipweb',
        key: '_shipweb',
        width: 150,
    },
    {
        title: 'Tỷ giá báo khách',
        dataIndex: '_exchangerate',
        key: '_exchangerate',
        width: 150,
    },
    {
        title: '% dịch vụ',
        dataIndex: '_servicerate',
        key: '_servicerate',
        width: 150,
    },
    {
        title: 'Giá báo khách',
        dataIndex: '_price',
        key: '_price' ,
        width: 150,
    },
      {
        title: 'Đặt cọc',
        dataIndex: '_deposit',
        key: '_deposit',
        width: 150,
    },
    {
        title: 'Cần thu',
        dataIndex: '_realpayprice',
        key: '_realpayprice',
        width: 150,
    },
    {
        title: 'Vận chuyển thực tế',
        dataIndex: '_deliveryprice',
        key: '_deliveryprice',
        width: 150,
    },
    {
        title: 'Vận chuyển báo khách',
        dataIndex: '_delivery',
        key: '_delivery',
        width: 150,
    },
    {
        title: 'Người lên đơn',
        dataIndex: 'semployee',
        key: 'semployee',
        width: 150,
    },
    {
        title: 'Trạng thái',
        dataIndex: 'sstatus',
        key: 'sstatus',
        width: 150,
        render: (text, record) => {
           return (<span>{this.state.statusText[text]}</span>)  
        },
    },
    {
        title: 'Tình trạng',
        dataIndex: '_status',
        key: '_status',
        width: 150,
        render: (text, record) => (
             <span>{(text) ? text.substring(0,15) : ''}</span>
        ),
    },
    {
        title: 'Ghi chú',
        dataIndex: 'scomment',
        key: 'scomment',
        width: 150,
        render: (text, record) => (
             <span>{(text) ? text.substring(0,10)+" ..." : ''}</span>
        ),
    },
      /*
    {
      title: ' ', 
      width: 50,
      fixed: 'right',
      render: (text, record) => (
        <Fragment>
          <Popconfirm title="Sure to delete?" onConfirm={()=>this.handleDelete(record.sbill_code)}>
          <a href="javascript:;">x</a>
        </Popconfirm>
        </Fragment>
        
      ),
    },*/
  ];
  listStatus=[
        <Option value="pending" key="1">Chờ</Option>  ,
        <Option value="paid" key="2">Đã đặt</Option>  ,
        <Option value="cancel" key="3">Cancel</Option>  ,
        <Option value="back" key="4">Back cọc</Option>  ,
        <Option value="tranfer" key="5">Chuyển cọc</Option> , 
    ]
   listStatusObj={
        paid: "Đã đặt hàng",
        processing: "Đang xử lý",
        confirm : "Đã xác nhận",
        tranfer : "Đang chuyển hàng",
        arrived : "Đã về",
        completed: "Đã hoàn thành",
    }
    listSstatusObj={
      pending   :'Chờ',
      paid      :'Đã mua',
      cancel    :'Cancel',
      back      :'Back cọc',
      tranfer   :'Chuyển cọc'   
    }
  componentDidMount() {  
    
    const { dispatch } = this.props;  
    let from=moment().format('YYYY/MM/DD');
    let to=moment().format('YYYY/MM/DD');
    let status='delivery';
    const values={
        from,
        to,
        status
    } 
    dispatch({
        type: 'order/fetch',
        payload:values,
    })    
  }
  componentWillUpdate(){
      //console.log(this.props);
  }
  handleDelete=(row)=>{
      const { dispatch } = this.props;
      dispatch({ 
        type: 'order/deleteRow',
        payload:row,  
    }) 
    
  }
  handleUpdateStatus=(e)=>{ 
      // 
      //value.sstatus=e;
      e.preventDefault();
       const { dispatch, form } = this.props;
          form.validateFields((err, fieldsValue) => {
          if (err) return; 
          this.setState({
              changeStatus: false,
          })
          let submit="update_status_delivery";
          dispatch({
                type: 'order/saveOrder',
                payload:{...fieldsValue,submit},  
            }
          )      
        });
      
      //this.handleSave(value);
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
 
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
      status: "delivery"
    };
    if (sorter.field) {
      params.sorter = sorter.field+"_"+sorter.order;
    }
    
    dispatch({
      type: 'order/fetch', 
      payload: params,
    });
  };
  handleSave=(row)=>{
      const { dispatch } = this.props;
      
      dispatch({
          type:'order/editCeil',
          payload:{
              ...row
          }
      });
      
      
  }
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    }); 
    dispatch({
      type: 'rule/fetch',
      payload: {},
    });
  };
  
  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
    
  };
  handleRowSelect = row =>{
      const {dispatch} = this.props;
      this.setState({
          visible: true,
          selectedRow:row,
        });
       dispatch({
          type: 'comment/fetch',
          payload: {
              sbill_code:row.sbill_code,
              username  :row.semployee,
          }
      })
  }
  handleHeaderRow = (e)=>{
      this.setState({
          visibleFullScreenTable: true,
        });
  }
  handleChangeStatus = e =>{
      const { dispatch, form } = this.props;
      form.validateFields((err, fieldsValue) => {
      if (err) return; 
      const values = {
        ...fieldsValue,
      };
 
      this.setState({
        formValues: values,
      });
    });
  }
  handleSearch = e => {
    e.preventDefault();
    const { from,to } =this.state;  
    const { dispatch, form } = this.props;
    const status="delivery";
    form.validateFields((err, fieldsValue) => {
        console.log(fieldsValue);
      if (err) return; 
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        from,
        to,
        status
      };
 
      this.setState({
        formValues: values,
      });
              
      dispatch({
        type: 'order/fetch',
        payload: values,
      });
    });
  };


  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  }; 
  onChangeStatus=e=>{
     this.setState({
          changeStatus: true,
      });
  }
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };
  handleOk = (e) => {
    const {form} = this.props;
    const {changeStatus} = this.state;  
    if(changeStatus){
        this.setState({
            changeStatus: false,
        });
        
    }
    this.setState({ 
      visible: false,
      editComment: false,
    });
  }
  handleCancel = (e) => {
    const { changeStatus } = this.state;  
    this.setState({
      visible: false,
      changeStatus: !!changeStatus,
      editComment: false,
    });
  }
   
  handleFullScreenTableOk= (e)=>{
    this.setState({
        visibleFullScreenTable: false,
    });
  } 
  handleFullScreenTableCancel= (e)=>{
    this.setState({
        visibleFullScreenTable: false,
    });
  }
  onPanelChange= ()=>{
      
  }
  handleConfirm =(e)=>{
      const { dispatch } = this.props;
      let old_data=e;
      let submit='update_status_delivery';
      let status='';
      if(e.status=='arrived'){
          status='confirm';
      }else{
          status='arrived';
      } 
      let old_status=old_data['_status'];
      old_data['_old_status']=old_status;
      
      old_data['_status']=this.listStatusObj[status];
      dispatch({
                type: 'order/saveOrder',
                payload:{
                    ...old_data,
                    status,
                    submit
                },  
            } 
        )
  }
  onChangeRangPicker =(e)=>{  
      const { formValues } = this.state;
      const { dispatch, form } = this.props;
      if(e.length>0){
          
          let from=e[0].format('YYYY/MM/DD');
          let to=e[1].format('YYYY/MM/DD');
          this.setState({
              from:from,
              to:to,
              
          })
          let values={
              ...formValues,
              from,
              to,
              status:"delivery"
          }
          dispatch({
            type: 'order/fetch',
            payload: values,
          });
      }
       
  }  
  renderUpdateStatusForm(selectedRow){
      
    
    const {    
      form: { getFieldDecorator },
      form,    
    } = this.props; 
    const {changeStatus} = this.state;
    const {sstatus} = selectedRow;
    let list=[
        <Option value="pending" key="1">Chờ</Option>  ,
        <Option value="paid" key="2">Đã đặt</Option>  ,
        <Option value="cancel" key="3">Cancel</Option>  ,
        <Option value="back" key="4">Back cọc</Option>  ,
        <Option value="tranfer" key="5">Chuyển cọc</Option> , 
    ];
    const confirm=[];  
    switch(sstatus){
        case 'back':
            list=[
                <Option value="back" key="1">Back cọc</Option>,
            ]
            break;
        case 'tranfer':
            list=[
                <Option value="tranfer" key="1">Chuyển cọc</Option> , 
            ]
            break;
        
    }
    return(<Form onSubmit={this.handleUpdateStatus} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={9} sm={24}>
                <FormItem>
                  {getFieldDecorator('sstatus',{
                      initialValue:selectedRow.sstatus,
                      onChange:this.onChangeStatus
                  })(
                    <Select className={styles.label} >
                        {list}
                    </Select>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('sbill_code',{
                      initialValue:selectedRow.sbill_code,
                  })(
                    <Input type="hidden" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('ddate',{
                      initialValue:selectedRow.ddate,
                  })(
                    <Input type="hidden" />
                  )}
                </FormItem>
            </Col> 
            <Col md={15} sm={24}>
                { (changeStatus) ? (
                    <span className={styles.label}>
                      <Button type="primary" htmlType="submit" >
                        Cập nhật
                      </Button>
                    </span>
                     ) : (
                        <span className={styles.label}>
                          <Button type="primary" htmlType="button"  disabled >
                            Cập nhật
                          </Button>
                        </span>
                     )
                }
            </Col>
        </Row>     
    </Form> );     
  }
  renderSimpleForm() {
    
    const {    
      form: { getFieldDecorator },
    } = this.props;
    const status='pending'  
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
            <FormItem label="Tên SP">
              {getFieldDecorator('snameproduct')(<Input placeholder="" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="Code">
              {getFieldDecorator('scode')(
                <Input placeholder="" />
              )}
          </FormItem>
          </Col> 
          
          <Col md={6} sm={24}>
            <FormItem label="Size">
              {getFieldDecorator('ssize')(
                <Input placeholder="" />
              )}
            </FormItem>
          </Col>   
          <Col md={6} sm={24}>
            <FormItem label="Color">
              {getFieldDecorator('scolor')(
                <Input placeholder="" />
              )}
            </FormItem>
          </Col> 
        
        </Row>
        <Row>
            <Col md={4} sm={24}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">
                    Tìm kiếm
                  </Button>
                </span>
             </Col> 
        </Row>
      </Form>
    );
  }
  /* COMMENT CODE */      
  handleEditComment = e =>{
    this.setState({
      editComment: true,
      commentEdit: e
    })   
  }      
  handleSaveComment =(values)=>{
      const {dispatch} = this.props;  
      this.setState({
            editComment: false,
            commentEdit:{}
      })
      dispatch({
        type: 'comment/save',
        payload: values,
      });
  }
  loadComment = data =>{
      const {dispatch} = this.props;  
  }
  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
                <Calendar fullscreen={false} onPanelChange={this.onPanelChange} />
          </Col>
          <Col md={9} sm={24}>
                <Calendar fullscreen={false} onPanelChange={this.onPanelChange} />
          </Col>
          <Col md={6} sm={24}>
                
          </Col>
        </Row>
    );
  }
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  render() {
      
    const {
      order: { data,update },
      comment: {comment},
      loading,
      user: {currentUser},
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,selectedRow,statusText,changeStatus,editComment,commentEdit } = this.state; 
    
    let confirm=[];
    let row=(update && update.sbill_code==selectedRow.sbill_code) ? update : selectedRow
    if(row.sstatus=='paid'){
        
        if(row.sstatus=='paid' && row.status=='confirm' ) {
            confirm=[<Button type="primary" style={{"margin": "3px"}} key="paid" onClick={()=>this.handleConfirm(row)} loading={loading}>Xác nhận hàng về</Button>]
        }else if(row.status=='arrived'){
            confirm=[<Button type="button" style={{"margin": "3px"}} key="cancel" onClick={()=>this.handleConfirm(row)} loading={loading}>Huỷ xác nhận</Button>]
        }else{
            confirm='';
        }            
    }else{
        confirm='';
    }
                 
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = { 
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    /*COMMENT RENDER*/                 
    let rowData={};
    if(editComment){
        rowData=  commentEdit  ;      
    }else{
        rowData = {
            sbill_code: selectedRow.sbill_code,
            username: selectedRow.semployee
        }            
    } 
    let CommentForm=<CreateFormComment key={(rowData) ?  rowData.sbill_code : 0 }  handleSaveComment={this.handleSaveComment} row={rowData} loading={loading}  />;
    let commentList=[]
    if(comment){
        commentList=(comment.list) ? comment.list : [];
    }        
    let commentUI=[];    
            
    commentList.map((e,i)=>{
        commentUI.push(<CommentList data={e} key={i}  handleEditComment={this.handleEditComment} currentUser={currentUser}/>);
    })  
    return (
      <PageHeaderWrapper title="Danh sách đơn đặt hàng">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowKey="sbill_code"
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              onRowSelect={this.handleRowSelect}
              onHeaderRow={this.handleHeaderRow}
              onChangeRangPicker={this.onChangeRangPicker}
            />
          </div>
        </Card>
        <Modal
          visible={this.state.visibleFullScreenTable}
          onOk={this.handleFullScreenTableOk}
          onCancel={this.handleFullScreenTableCancel}
          width="100%"
          style={{ top: 10 }}
          zIndex="1000"
        > 
        <div className={styles.tableListForm}>{this.renderForm()}</div>      
        <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowKey="sbill_code"
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              onRowSelect={this.handleRowSelect}
              onHeaderRow={this.handleHeaderRow}
              onChangeRangPicker={this.onChangeRangPicker}
            />
        </Modal>      
        <Modal 
          title={selectedRow.sname}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="80%"
          style={{ top: 20 }}
          zIndex="1001"     
        >
        <div className="gutter-example">
          <Row style={{"border":"1px solid silver"}}>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Mã bill</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.sbill_code} showIcon={false} banner /> </Col>
          </Row>
          <Row style={{"border":"1px solid silver"}}>   
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Tên</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.sname} showIcon={false} banner /> </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Số điện thoại</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.sphone} showIcon={false} banner /> </Col>
          </Row>
          <Row style={{"border":"1px solid silver"}}>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Địa chỉ</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.saddress} showIcon={false} banner /></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Email</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.semail} showIcon={false} banner /></Col>
          </Row>     
          <Row style={{"border":"1px solid silver"}}>     
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>LinkSP</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={<a href={selectedRow.slinkproduct} target="_blank">Link SP</a>} showIcon={false} banner /></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Mã SP</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.scode} showIcon={false} banner/></Col>  
          </Row> 
          <Row style={{"border":"1px solid silver"}}>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Tên SP</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.snameproduct} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Màu</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.scolor} showIcon={false} banner/></Col>
          </Row>    
           <Row style={{"border":"1px solid silver"}}>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Size</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.ssize} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Số lượng</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.iquality} showIcon={false} banner/></Col>
          </Row> 
           <Row style={{"border":"1px solid silver"}}>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Giá Web</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._webprice} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Sale</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._sale} showIcon={false} banner/></Col>
          </Row>  
            <Row style={{"border":"1px solid silver"}}>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Ship Web</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._shipweb} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Phụ thu</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._surcharge} showIcon={false} banner/></Col>
          </Row>
          <Row style={{"border":"1px solid silver"}}>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Tỷ giá</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._exchangerate} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Vận chuyển</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._deliveryprice} showIcon={false} banner/></Col>
          </Row>   
         <Row style={{"border":"1px solid silver"}}> 
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>% dịch vu</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._servicerate} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Giá</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._price} showIcon={false} banner/></Col>
          </Row> 
            <Row style={{"border":"1px solid silver"}}>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Đặt cọc</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._deposit} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Cần thu</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={`${selectedRow._realpayprice}`} showIcon={false} banner/>
            </Col>
          </Row>
            <Row style={{"border":"1px solid silver"}}>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}><span className={styles.label}>Trạng thái</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}><Alert message={`${selectedRow._sstatus}`} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}> </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                    {confirm}
            </Col>
            
          </Row>
            <Row style={{"border":"1px solid silver"}}>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}><span className={styles.label}><b>Ghi chú</b></span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>{CommentForm}</Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 12, offset: 0 }}>{commentUI}</Col>
          </Row>
          </div>
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ConfirmDelivery;
