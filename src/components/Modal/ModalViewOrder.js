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
import styles from './style.less';
class ModalViewOrder extends React.Component{
    constructor(props){
        super(props)
    }
    state={
        
    }
    componentDidMount(){
        
    }
    renderComment=()=>{
        return (
            <div>Xin Chao Comment moi</div>
        )
    }
    render(){
        const {selectedRow,modalVisible,handleModalVisible, renderUpdateStatusForm } = this.props;
        return(
        <Modal 
          title={selectedRow.sname}
          visible={modalVisible}
          onOk={()=>{handleModalVisible()}}
          onCancel={()=>{handleModalVisible()}}
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
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}><Alert message={`${selectedRow._sstatus}`} showIcon={false} banner/></Col>
            
          </Row>
            <Row> 
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}><b>Ghi chú</b></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>{selectedRow.scomment}</Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 3, offset: 0 }}><b>Ghi chú</b></Col>
            <Col xs={{ span: 12, offset: 0 }} lg={{ span: 9, offset: 0 }}>{this.renderComment()}</Col>
          </Row>
          </div>
        </Modal>
        )
    }
}
export default ModalViewOrder;