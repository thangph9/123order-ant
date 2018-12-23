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
    onSearch=(e)=>{
        this.setState({
            title: e
        });
    }
    handleFilterDate = (e)=>{
        this.setState({
            createat: e
        });
        this.handleFilter(e);
    }
    componentWillReceiveProps(nextProps){
      if(nextProps.blog!==this.props.blog){
        //Perform some operation
          this.setState({
              data: nextProps.blog.data.list
          })
      }
    }
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
    render(){
        
        const {
              loading,
              form: { getFieldDecorator,getFieldValue },
              blog: {data}
            } = this.props;
        let list=this.state.data;
        const ListContent = ({ data: { createby, expired , percent, status } }) => (
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
        </PageHeaderWrapper>
        )
    }
}
export default ListBlog;
