import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Ellipsis from '@/components/Ellipsis';
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
    blog
}))
@Form.create()
class ListBlog extends PureComponent {
    state={
        data: {list:[],pagination:{}},
        visible: false,
        current: '',
        done : false,
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
          type: 'blog/fetch',
          payload: {
            count: 8,
          },
        });
      }
    componentWillReceiveProps(nextProps){
      if(nextProps.blog!==this.props.blog){
        //Perform some operation
          this.setState({
              data: nextProps.blog.data.list
          })
      }
    }
    onSearch=(e)=>{
        this.setState({
            title: e
        });
    }
    handleCancel = () => {
        this.setState({
          visible: false,
        });
      };
    handleFilterDate = (e)=>{
        this.setState({
            createat: e
        });
        this.handleFilter(e);
    }
    
    showEditModal = item => {
        this.setState({
          visible: true,
          current: item,
        });
      };
     showModal = () => {
        this.setState({
          visible: true,
          current: undefined,
        });
      };
    handleFilter=(e)=>{
        try{
            const { blog:{data : {list}} } = this.props;
            if(e.length >0){
                var filter=list.filter(i=> {
                    if(i.expired && i.expired.start){
                        var start=moment(i.expired.start);
                        var end=moment(i.expired.end);
                        return start.isAfter(e[0]) || end.isBefore(e[1]);
                    }else{
                        return false;
                    }
                      
                })
                this.setState({
                    data: filter
                })
            }
        }catch(e){
            
        }
    }
    handleDone = () => {
        setTimeout(() => this.addBtn.blur(), 0);
        this.setState({
          done: false,
          visible: false,
        });
      };
   handleSubmit =(e)=>{
         const {dispatch , form} = this.props;
         e.preventDefault();
         form.validateFieldsAndScroll((err, values) => {
          if (!err) {

            console.log(values);
          }
        }); 
   }
    render(){
        
        const {
              loading,
              form: { getFieldDecorator,getFieldValue },
              blog: {data}
            } = this.props;
        const { done, current, visible } = this.state;
        let list=this.state.data;
        const ListContent = ({ data: { createby, expired , percent, status }  }) => (
          <div className={styles.listContent}>
            <div className={styles.listContentItem}>
              <span>Người tạo</span>
              <p>{createby}</p>
            </div>
            <div className={styles.listContentItem}>
              <span>Thời gian bắt đầu</span>
              <p>{moment((expired) ? expired.start : null).format('YYYY-MM-DD HH:mm')}</p>
              <span>Thời gian kết thúc</span>
              <p>{moment((expired) ? expired.end : null).format('YYYY-MM-DD HH:mm')}</p>
            </div>
            <div className={styles.listContentItem}>
              <Progress percent={percent} status={status} strokeWidth={6} style={{ width: 180 }} />
            </div>
          </div>
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
             const expired=[];
             if(current.expired){
                 expired=[moment(current.expired.start),moment(current.expired.end)];
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
                      <RangePicker
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
        const modalFooter = done
          ? { footer: null, onCancel: this.handleDone }
          : { okText: 'Lưu', onOk: this.handleSubmit, onCancel: this.handleCancel };
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
        const extraContent = (
          <div className={styles.extraContent}>
            <Search className={styles.extraContentSearch} placeholder="Tìm kiếm" onSearch={() => ({})} />
          </div>
        );
        const extraFilter=(
            <RangePicker showTime={{
                                        hideDisabledOptions: true,
                                }}
                style={{width: '100%'}}
                format="YYYY-MM-DD HH:mm:ss"
                onOk={this.handleFilterDate}
            />
        )
        return(
        <PageHeaderWrapper>
            <div className={styles.cardList}>
            <Card bordered={false} >
            <Form>
                <Row>
                    <Col md={12}>
                        <Search className={styles.extraContentSearch} placeholder="Tìm kiếm" onSearch={this.onSearch} />
                    </Col>
                </Row>
                
                  
            </Form>
         </Card>
            <Card className={styles.listCard}
            bordered={false}
            title="Danh sách bài viết"
            style={{ marginTop: 24 }}
            extra={extraFilter}
            bodyStyle={{ padding: '0 32px 40px 32px' }}>
              <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={data.pagination}
              dataSource={list}
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
                    avatar={<Avatar src={`/api/product/image/${item.image}`} shape="square" size="large" />}
                    title={<Link to={`/blogs/edit/${item.artid}`}>{item.title}</Link>}
                    description={item.short_desc}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
            </Card>
            </div>
        <Modal
              title={done ? null : `${current ? 'Chỉnh sửa' : 'Thêm'}`}
              className={styles.standardListForm}
              width={640}
              bodyStyle={done ? { padding: '72px 0' } : { padding: '1rem' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
        >
          {getModalContent()}
        </Modal>
        </PageHeaderWrapper>
        )
    }
}
export default ListBlog;
