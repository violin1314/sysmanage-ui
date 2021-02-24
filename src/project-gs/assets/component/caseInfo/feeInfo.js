import React, { Component } from 'react';
import { Descriptions, Row, Col } from 'antd';
import moment from 'moment'

class FeeInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            feeInfo: {}
        }
    }
    componentDidMount() {
        this.setState({
            feeInfo: this.props.detail && this.props.detail.length > 0 ? this.props.detail[0] : {}
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            feeInfo: nextProps.detail && nextProps.detail.length > 0 ? nextProps.detail[0] : {}
        })
    }
    render() {
        return (
            <div>
                {
                    this.state.feeInfo.billNo
                        ?
                        <Descriptions size="small" column={2} style={{ padding: '0 20px' }}>
                            <Descriptions.Item label="发票号">{this.state.feeInfo.billNo}</Descriptions.Item>
                            <Descriptions.Item label="丙类金额">{this.state.feeInfo.ownExpenseFee}</Descriptions.Item>
                            <Descriptions.Item label="结算日期">{this.state.feeInfo.payDt}</Descriptions.Item>
                            <Descriptions.Item label="社保起付线">{this.state.feeInfo.qfStandardOneself}</Descriptions.Item>
                            <Descriptions.Item label="医疗类别">{this.state.feeInfo.personnelCategoryName}</Descriptions.Item>
                            <Descriptions.Item label="大病赔付金额">{this.state.feeInfo.cisPayAmnt}</Descriptions.Item>
                            <Descriptions.Item label="医疗机构">{this.state.feeInfo.payee}</Descriptions.Item>
                            <Descriptions.Item label="费用总额">{this.state.feeInfo.totalPayment}</Descriptions.Item>
                            <Descriptions.Item label="现金支付">{this.state.feeInfo.cashPayment}</Descriptions.Item>
                            <Descriptions.Item label="账户支付">{this.state.feeInfo.miPrivateAccountPayment}</Descriptions.Item>
                            <Descriptions.Item label="统筹支付">{this.state.feeInfo.miSocialPoolingPayment}</Descriptions.Item>
                            <Descriptions.Item label="社保补偿金额">{this.state.feeInfo.socialPayAmnt}</Descriptions.Item>
                            <Descriptions.Item label="社保范围内金额">{this.state.feeInfo.socialInAmnt}</Descriptions.Item>
                            <Descriptions.Item label="乙类自费金额">{this.state.feeInfo.classbOneself}</Descriptions.Item>
                        </Descriptions>
                        :
                        <div style={{ textAlign: 'center', padding: 30, color: '#999' }}>暂无数据</div>
                }
            </div>
        )
    }
}
export default FeeInfo;