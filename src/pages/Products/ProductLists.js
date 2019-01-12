import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'dva';
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
    TreeSelect
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';

import styles from './ProductLists.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ list, loading,product,category }) => ({
  list,
  loading: loading.models.list,
  product ,
  category
}))
@Form.create()
class ProductLists extends PureComponent {
  state = { visible: false, done: false ,pageSize: 10,current: 1 };
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };
  componentWillMount() { 
    const { dispatch } = this.props;
    const { pageSize,current }= this.state;  
    dispatch({
      type: 'product/fetch',
      payload: {
        count: 5,
        pageSize,
        current,
      },
    });
      dispatch({
        type: 'category/treemap',
        payload:{},
    })
    
  }

  onChangeNodeID = (e)=>{
     
      this.setState({
          nodeid: e
      });
  }
  onSearch = (e)=>{
      const { dispatch } = this.props;
      const { nodeid } = this.state;
      let payload={q:e};
      if(nodeid){
          payload={
              q:e,
              nodeid
          }
      }
      dispatch({
          type: 'product/search',
          payload
      })
  }
  
  showModal = () => {
    this.setState({
      visible: true,
      current: undefined,
    });
  };

  showEditModal = item => {
    this.setState({
      visible: true,
      current: item,
    });
  };

  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false,
    });
  };

  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false,
    });
  };

  handleSubmit = e => { 
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { current } = this.state;
    const id = current ? current.id : '';

    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'list/submit',
        payload: { id, ...fieldsValue },
      });
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/submit',
      payload: { id },
    }); 
  };
  onShowSizeChange=(current, pageSize)=>{
     this.setState({
         pageSize: pageSize,
         current:current,
     })
  }
  
  render() {
    const {
      list: { list },
      loading,
      product: { data } ,
      category: { treeMap },    
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {},nodeid } = this.state;
    const editAndDelete = (key, currentItem) => {
      if (key === 'edit') this.showEditModal(currentItem);
      else if (key === 'delete') {
        Modal.confirm({
          title: 'Xóa tác vụ',
          content: 'Bạn có chắc chắn muốn xóa tác vụ này không？',
          okText: 'Xác nhận',
          cancelText: 'Hủy bỏ',
          onOk: () => this.deleteItem(currentItem.id),
        });
      }
    };
    const treeData = (treeMap) ? treeMap : [];
    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: 'Lưu', onOk: this.handleSubmit, onCancel: this.handleCancel };
    
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="all">
          <RadioButton value="all">Tất cả</RadioButton>
          <RadioButton value="progress">Đang tiến hành</RadioButton>
          <RadioButton value="waiting">Đang chờ</RadioButton>
        </RadioGroup> 
        
        <Search className={styles.extraContentSearch} placeholder="Tìm kiếm" onSearch={() => ({})} />
      </div>
    );
    
    const paginationProps = { 
      showSizeChanger: true,
      showQuickJumper: true,
      onShowSizeChange: this.onShowSizeChange,    
      pageSize: this.state.pageSize || 5,
      total: (data.pagination) ? data.pagination.total : 50,
    };

    const ListContent = ({ data: { createby, death_clock, percent, status } }) => (
      <div className={styles.listContent}>
        <div className={styles.listContentItem}>
          <span>Người tạo</span>
          <p>{createby}</p>
        </div>
        <div className={styles.listContentItem}>
          <span>Thời gian bắt đầu</span>
          <p>{moment((death_clock) ? death_clock.start : null).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div className={styles.listContentItem}>
          <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
        </div>
      </div>
    );
    const advancedSearch= ()=>{
        return (
        <Form onSubmit={this.handleSubmit}>
          
          <FormItem label="Thời gian bắt đầu" {...this.formLayout}>
            {getFieldDecorator('createdAt', {
              rules: [{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }],
              initialValue: current.createdAt ? moment(current.createdAt) : null,
            })(
              <DatePicker
                showTime
                placeholder="Vui lòng chọn"
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem label="Trình quản lý tác vụ" {...this.formLayout}>
            {getFieldDecorator('sale', {
              
              initialValue: 'all',
            })(
            <Select>
                <SelectOption value="All" > Tất cả </SelectOption>
                <SelectOption value="70"  > >70% </SelectOption>
                <SelectOption value="60"> >60% </SelectOption>
                <SelectOption value="50"> >50%</SelectOption>
                <SelectOption value="40"> >40% </SelectOption>
                <SelectOption value="30"> >30% </SelectOption>
                <SelectOption value="20"> >20% </SelectOption>
            </Select>
            )}
          </FormItem>
        </Form>
      );
    }
    const MoreBtn = props => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
            <Menu.Item key="edit">Edit</Menu.Item>
            <Menu.Item key="delete">Delete</Menu.Item>
            <Menu.Item key="public">Public</Menu.Item>
            <Menu.Item key="clone">Clone</Menu.Item>
          </Menu>
        }
      >
        <a>
          Lựa chọn <Icon type="down" />
        </a>
      </Dropdown>
    );

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="Hoạt động thành công"
            description="Một loạt các mô tả thông tin, ngắn gọn và không kém chấm câu."
            actions={
              <Button type="primary" onClick={this.handleDone}>
                Tôi biết
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="Tên công việc" {...this.formLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Vui lòng nhập tên tác vụ' }],
              initialValue: current.title,
            })(<Input placeholder="Vui lòng nhập" />)}
          </FormItem>
          <FormItem label="Thời gian bắt đầu" {...this.formLayout}>
            {getFieldDecorator('createdAt', {
              rules: [{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }],
              initialValue: current.createdAt ? moment(current.createdAt) : null,
            })(
              <DatePicker
                showTime
                placeholder="Vui lòng chọn"
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
          <FormItem label="Trình quản lý tác vụ" {...this.formLayout}>
            {getFieldDecorator('owner', {
              rules: [{ required: true, message: 'Vui lòng chọn chủ sở hữu công việc' }],
              initialValue: current.owner,
            })(
              <Select placeholder="Vui lòng chọn">
                <SelectOption value="付晓晓">付晓晓</SelectOption>
                <SelectOption value="周毛毛">周毛毛</SelectOption>
              </Select>
            )}
          </FormItem>
          <FormItem {...this.formLayout} label="Mô tả sản phẩm">
            {getFieldDecorator('subDescription', {
              rules: [{ message: 'Vui lòng nhập mô tả sản phẩm của ít nhất năm ký tự！', min: 5 }],
              initialValue: current.subDescription,
            })(<TextArea rows={4} placeholder="Vui lòng nhập ít nhất năm ký tự" />)}
          </FormItem>
        </Form>
      );
    };
    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="Việc cần làm của tôi" value="8 nhiệm vụ" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="Thời gian xử lý tác vụ trung bình trong tuần này" value="32 phút" bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="Số lượng công việc đã hoàn thành trong tuần này" value="24 nhiệm vụ" />
              </Col>
            </Row>
          </Card>
          <Card bordered={false}>
            <Form>
                <Row>
                    <Col md={12}>
                        <FormItem label="Danh mục" {...this.formLayout}>
                        {getFieldDecorator('category', {
                            onChange: this.onChangeNodeID,
                            initialValue: this.state.nodeid,   
                        })(<TreeSelect
                            showSearch
                            style={{ width: 195 }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            allowClear
                            treeDefaultExpandAll
                            treeData={treeData}
                          >
                        </TreeSelect>)}
                      </FormItem>
                    </Col>
                    <Col md={12}>
                        <Search className={styles.extraContentSearch} placeholder="Tìm kiếm" onSearch={this.onSearch} />
                    </Col>
                </Row>
                
                  
            </Form>
         </Card>
          <Card
            className={styles.listCard}
            bordered={false}
            title="Danh sách sản phẩm"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <Button
              type="dashed"
              style={{ width: '100%', marginBottom: 8 }}
              icon="plus"
              onClick={this.showModal}
              ref={component => {
                /* eslint-disable */
                this.addBtn = findDOMNode(component);
                /* eslint-enable */
              }}
            >
              Thêm
            </Button>
            
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={data.list}
              renderItem={item => (
                <List.Item
                  actions={[
                    <a
                      onClick={e => {
                        e.preventDefault();
                        this.showEditModal(item);
                      }}
                    >
                      Chỉnh sửa
                    </a>,
                    <MoreBtn current={item} />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={`/api/product/image/${item.thumbnail}`} shape="square" size="large" />}
                    title={<Link to={`/products/edit/${item.productid}`}>E-{item.title}</Link>}
                    description={(item.category && item.category.length > 0) && item.category.map((e,i)=>{
                            if(e){
                                if(item.category.length >1 && (item.category.length-1) > i ){
                                    return <a key={i} href="javascript:void(0)" onClick={()=>{this.onChangeNodeID(e.nodeid)}}>{e.title+" | "}</a>
                                }else return <a key={i} href="javascript:void(0)"  onClick={()=>{this.onChangeNodeID(e.nodeid)}}>{e.title}</a>;
                            }
                            
                        
                        })}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
        <Modal
          title={done ? null : `Nhiệm vụ ${current ? 'Chỉnh sửa' : 'Thêm'}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 0 0' }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default ProductLists;
