import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { change_alias } from '@/utils/utils';
import { formatMessage, FormattedMessage } from 'umi/locale';
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
  InputNumber
    
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
          };
 componentDidMount(){
 }
render() {
    const {
      loading, 
    } = this.props;
    const {
      form: { getFieldDecorator,getFieldValue },
    } = this.props;
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

export default ProductOption;
