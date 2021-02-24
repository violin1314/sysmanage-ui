import React, { Component } from 'react';
import {Descriptions, Row, Col, Divider} from 'antd';
import moment from 'moment'

class BankInfo extends Component {
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
            <div>
                {
                    this.state.detail.bankAccountNo
                        ?
                        <Descriptions size="small" column={1} style={{ padding: '0 20px' }}>
                            <Descriptions.Item label="银行编码">{this.state.detail.bankCode}</Descriptions.Item>
                            <Descriptions.Item label="银行名称">{this.state.detail.bankName}</Descriptions.Item>
                            <Descriptions.Item label="银行账户">{this.state.detail.bankAccountNo}</Descriptions.Item>
                        </Descriptions>

                        :
                        <div style={{ textAlign: 'center', padding: 30, color: '#999' }}>暂无数据</div>
                }
                <Divider />
            </div>
        )
    }
}
export default BankInfo;
