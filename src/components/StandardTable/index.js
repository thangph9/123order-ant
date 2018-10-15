import React, { PureComponent, Fragment } from 'react';
import { Table, Alert,Row,Col ,DatePicker} from 'antd';
import styles from './index.less';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;
function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };
  handleClick = record=>{
      const { onRowSelect } = this.props;
      if(onRowSelect){
          onRowSelect(record)
      }
  }
  handleClickHeaderRow =(column)=>{
      
      const { onHeaderRow } = this.props;
      if(onHeaderRow){
          onHeaderRow(column)
      }
  }
  onChangeRangPicker =(e)=>{
      const { onChangeRangPicker } = this.props;
      if(onChangeRangPicker){
          onChangeRangPicker(e)
      }
  }
  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const {
      data: { list, pagination },
      loading,
      columns,
      rowKey,
      components
    } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <Row type="flex" justify="end">
          
                <RangePicker
                      ranges={{ 'Hôm nay': [moment(), moment()], 'Trong tháng': [moment().startOf('month'), moment().endOf('month')],'Tuần này': [moment().startOf('week'), moment().endOf('week')]}}
                      showTime
                      format="YYYY/MM/DD"
                      defaultValue={[moment(),moment()]}
                      onChange={this.onChangeRangPicker}

                />  
        </Row>
        <div>        
        <Table
          loading={loading}
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          components={components}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          scroll={{ x: 4000 }}
          onRow={(record) => {
                return {
                  onClick: () => {this.handleClick(record)}
                };
              }}
         onHeaderRow={(column) =>{
            return {
              onClick: () => {this.handleClickHeaderRow(column)},   
            };             
         }}
        />
        </div>
      </div>
    );
  }
}

export default StandardTable;
