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
import styles from './OrderList.less';
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
const status = ['关闭', '运行中', '已上线', '异常'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});
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
        console.log(form);
        //form.resetFields();
        //handleEditComment(e);
    }
    
    render(){
        
        const { data,handleEditComment,currentUser } =this.props;
        let editable=(data.username == currentUser.username) ? true : false;
        console.log(data)
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
/*ANT FORM*/
@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };

  renderContent = (currentStep, formVals) => {
    const { form } = this.props;
    if (currentStep === 1) {
      return [
        <FormItem key="target" {...this.formLayout} label="监控对象">
          {form.getFieldDecorator('target', {
            initialValue: formVals.target,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">表一</Option>
              <Option value="1">表二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="template" {...this.formLayout} label="规则模板">
          {form.getFieldDecorator('template', {
            initialValue: formVals.template,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">规则模板一</Option>
              <Option value="1">规则模板二</Option>
            </Select>
          )}
        </FormItem>,
        <FormItem key="type" {...this.formLayout} label="规则类型">
          {form.getFieldDecorator('type', {
            initialValue: formVals.type,
          })(
            <RadioGroup>
              <Radio value="0">强</Radio>
              <Radio value="1">弱</Radio>
            </RadioGroup>
          )}
        </FormItem>,
      ];
    }
    if (currentStep === 2) {
      return [
        <FormItem key="time" {...this.formLayout} label="开始时间">
          {form.getFieldDecorator('time', {
            rules: [{ required: true, message: '请选择开始时间！' }],
          })(
            <DatePicker
              style={{ width: '100%' }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择开始时间"
            />
          )}
        </FormItem>,
        <FormItem key="frequency" {...this.formLayout} label="调度周期">
          {form.getFieldDecorator('frequency', {
            initialValue: formVals.frequency,
          })(
            <Select style={{ width: '100%' }}>
              <Option value="month">月</Option>
              <Option value="week">周</Option>
            </Select>
          )}
        </FormItem>,
      ];
    }
    return [
      <FormItem key="name" {...this.formLayout} label="规则名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入规则名称！' }],
          initialValue: formVals.name,
        })(<Input placeholder="请输入" />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="规则描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
      </FormItem>,
    ];
  };

  renderFooter = currentStep => {
    const { handleUpdateModalVisible } = this.props;
    if (currentStep === 1) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
          下一步
        </Button>,
      ];
    }
    if (currentStep === 2) {
      return [
        <Button key="back" style={{ float: 'left' }} onClick={this.backward}>
          上一步
        </Button>,
        <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
          完成
        </Button>,
      ];
    }
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
        下一步
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible } = this.props;
    const { currentStep, formVals } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="规则配置"
        visible={updateModalVisible}
        footer={this.renderFooter(currentStep)}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
          <Step title="基本信息" />
          <Step title="配置规则属性" />
          <Step title="设定调度周期" />
        </Steps>
        {this.renderContent(currentStep, formVals)}
      </Modal>
    );
  }
}

/* Edit cell========== */
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  state = {
    editing: false,
    type: 'input',
    status:'',
      
  }
  
  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    const {record , dataIndex}=this.props;
    let status=record[dataIndex] ;
    this.setState({ editing,status}, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }
  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const { record, handleSave, type } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }
  changeStatus = value =>{
      this.setState({status: value});
  }
  getType = () => {
    const {type, editable} = this.props;    
    switch (type) {
         case "select":
            return <Select
                    size="large"
                    onChange={this.changeStatus}
                    style={{width:'100%'}}
                    ref={node => (this.input = node)}
                    onPressEnter={this.save}
                  >
                    <Option value="pending">Chờ</Option>
                    <Option value="paid">Đã mua</Option>
                    <Option value="cancel">Cancel</Option>
              </Select>;     

        default:
            return <Input ref={node => (this.input = node)}
                                    onPressEnter={this.save}/>;    
        }
   }
  render() {
    const { editing,status } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      type,    
      ...restProps
      
    } = this.props;
      let typeData;
      if(editable){
          if(type==='select'){
              typeData=status;
          }else{
              typeData=record[dataIndex];
          }
          
      }
    
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? 
                  (<FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: /*${title}*/ 'is required.',
                      }],
                      initialValue: typeData,
                    })(this.getType())}
                  </FormItem>)
                 : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
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
class OrderStatus extends PureComponent {
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
        dataIndex: 'ddate',
        width: 150,
        fixed: 'left',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
        title: 'Tên Khách',
        dataIndex: 'sname',
        key: 'sname',
        width: 150,
        fixed: 'left',
    },
      
    {
        title: 'Số điện thoại',
        dataIndex: 'sphone',
        key: 'sphone',
        width: 150,
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'saddress',
        key: 'saddress',
        width: 150,
    },
    {
        title: 'Email',
        dataIndex: 'semail',
        width: 250,
        key:'semail',
    },
    {
        title: 'Code SP',
        dataIndex: 'scode',
        width: 150,    
        key:'scode',
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
        title: 'Tên SP',
        dataIndex: 'snameproduct',
        key:'snameproduct',
        width: 150,
        render: (text, record) => (
             <span>{text.substring(0,10)}...</span>
        ),
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
  componentDidMount() {  
    const { dispatch } = this.props;  
    let from=moment().format('YYYY/MM/DD');
    let to=moment().format('YYYY/MM/DD');
    let status='paid';
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
          dispatch({
                type: 'order/saveOrder',
                payload:{...fieldsValue},  
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
      status: "paid"
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
          type:'order/saveOrder', 
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
      const {form,dispatch} =this.props;
      form.setFieldsValue({sstatus: row.sstatus});
      form.setFieldsValue({sbill_code: row.sbill_code});
      form.setFieldsValue({ddate: row.ddate});
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
    const status="paid";
    form.validateFields((err, fieldsValue) => {
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
    const {changeStatus,editComment} = this.state;  
    if(changeStatus){
        this.setState({
            changeStatus: false,
        });
        
    }
    this.setState({
      visible: false,
      editComment: !editComment,
    });
  } 
  handleCancel = (e) => {
    const { editComment } = this.state;  
    this.setState({
      visible: false,
      editComment: !!editComment,
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
              status:"paid"
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
                <FormItem>
                  {getFieldDecorator('status',{
                      initialValue:selectedRow.status,
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
      loading,
    } = this.props;
    const status='pending'  
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="Tên KH">
              {getFieldDecorator('name')(<Input placeholder="" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Số điện thoại">
              {getFieldDecorator('phone')(
                <Input placeholder="" />
              )}
            </FormItem>
          </Col> 
          <Col md={6} sm={24}>
            <FormItem label="Trạng thái">
              {getFieldDecorator('sstatus',{
                  initialValue:status,
                  onChange: this.handleChangeStatus
              })(
                <Select> 
                    {this.listStatus}
                </Select>
              )}
            </FormItem>
          </Col> 
        <Col md={4} sm={24}>
                <span className={styles.submitButtons}>
                  <Button type="primary" loading={loading} htmlType="submit">
                    Tìm kiếm
                  </Button>
                </span>
              </Col> 
        </Row> 
      </Form>
    );
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
/* COMMENT CODE END*/      
  render() {
      
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          type:col.type,
        }),
      };
    });
    const {
      order: { data },
      comment: {comment},
      loading,
      user: {currentUser},
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues,selectedRow,statusText,changeStatus,editComment ,commentEdit} = this.state; 
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
              components={components}
              data={data}
              rowKey="sbill_code"
              columns={columns}
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
              components={components}
              data={data}
              rowKey="sbill_code"
              columns={columns}
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
          <Row>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Mã bill</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.sbill_code} showIcon={false} banner /> </Col>
          </Row>
          <Row>   
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Tên</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.sname} showIcon={false} banner /> </Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Số điện thoại</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.sphone} showIcon={false} banner /> </Col>
          </Row>
          <Row>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Địa chỉ</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.saddress} showIcon={false} banner /></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Email</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.semail} showIcon={false} banner /></Col>
          </Row>    
          <Row>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>LinkSP</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={<a href={selectedRow.slinkproduct} target="_blank">Link SP</a>} showIcon={false} banner /></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Mã SP</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.scode} showIcon={false} banner/></Col>  
          </Row>
          <Row>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Tên SP</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.snameproduct} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Màu</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.scolor} showIcon={false} banner/></Col>
          </Row>    
           <Row>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Size</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.ssize} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Số lượng</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow.iquality} showIcon={false} banner/></Col>
          </Row> 
           <Row>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Giá Web</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._webprice} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Sale</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._sale} showIcon={false} banner/></Col>
          </Row>  
            <Row>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Ship Web</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._shipweb} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Phụ thu</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._surcharge} showIcon={false} banner/></Col>
          </Row>
          <Row>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Tỷ giá báo khách</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._exchangerate} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Vận chuyển báo khách</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._deliveryprice} showIcon={false} banner/></Col>
          </Row>
         <Row>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>% dịch vu</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._servicerate} showIcon={false} banner/></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}>
                <span className={styles.label}>Giá báo khách</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>
                <Alert message={selectedRow._price} showIcon={false} banner/></Col>
          </Row> 
            <Row>
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
            <Row>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}><span className={styles.label}>Trạng thái</span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>{this.renderUpdateStatusForm(selectedRow)}</Col>
            
          </Row>
            <Row>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}><span className={styles.label}><b>Ghi chú</b></span></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>{CommentForm}</Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 12, offset: 0 }}>{commentUI}</Col>
          </Row>
          </div>
        </Modal>
          
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default OrderStatus;
