import React, { Component } from 'react';
import { Descriptions } from 'antd';

class CasePayeeInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: {}
        }
    }
    componentDidMount() {
        this.setState({
            detail: this.props.detail ? this.props.detail : {}
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            detail: nextProps.detail ? nextProps.detail : {}
        })
    }
    render() {
        return (
            <Descriptions style={{ padding: 20 }}>
                <Descriptions.Item label="领款人类型">
                    {this.state.detail.payeeTypeName}
                </Descriptions.Item>
                <Descriptions.Item label="领款人姓名">
                    {this.state.detail.payeeName}
                </Descriptions.Item>
                <Descriptions.Item label="银行账号">
                    {this.state.detail.bankAccountNo}
                </Descriptions.Item>
                <Descriptions.Item label="账户类型">
                    {this.state.detail.accountTypeName}
                </Descriptions.Item>
                <Descriptions.Item label="领款人证件号">
                    {this.state.detail.payeeIdcard}
                </Descriptions.Item>
                <Descriptions.Item label="领款人联系电话">
                    {this.state.detail.payeePhone}
                </Descriptions.Item>
                <Descriptions.Item label="开户行">
                    {this.state.detail.bankName}
                </Descriptions.Item>
            </Descriptions>
        )
    }
}
export default CasePayeeInfo;