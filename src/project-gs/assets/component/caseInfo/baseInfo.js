import React, { Component } from 'react';
import { Descriptions, Row, Col,Divider } from 'antd';
import moment from 'moment'

class BaseInfo extends Component {
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
                <Row>
                    <Col span={24}>
                        <Descriptions size="small" column={1} style={{ padding: '0 20px' }}>
                            <Descriptions.Item label="出险人">{this.state.detail.insuredName}</Descriptions.Item>
                            <Descriptions.Item label="证件类型">{this.state.detail.idTypeName}</Descriptions.Item>
                            <Descriptions.Item label="证件号码">{this.state.detail.idCode}</Descriptions.Item>
                            <Descriptions.Item label="证件有效期">{this.state.detail.idExpiryDate}</Descriptions.Item>
                            <Descriptions.Item label="职业">{this.state.detail.jobName}</Descriptions.Item>
                            <Descriptions.Item label="居住地">{this.state.detail.address}</Descriptions.Item>
                                {
                                /*<Descriptions.Item label="性别">{this.state.detail.sex}</Descriptions.Item>
                                <Descriptions.Item label="出生日期">{this.state.detail.birthday}</Descriptions.Item>
                                <Descriptions.Item label="国籍">{this.state.detail.citizenship}</Descriptions.Item>*/
                                }
                            <Descriptions.Item label="联系手机">{this.state.detail.telephone}</Descriptions.Item>
                        </Descriptions>
                        <Divider />
                    </Col>
                    {
                        this.state.detail.protectorInfo &&
                        <Col span={24}>
                            <Descriptions size="small" column={1} style={{ padding: '0 20px' }}>
                                <Descriptions.Item label="监护人">{this.state.detail.protectorInfo.protectorName}</Descriptions.Item>
                                <Descriptions.Item label="证件类型">{this.state.detail.protectorInfo.idTypeName}</Descriptions.Item>
                                <Descriptions.Item label="证件号码">{this.state.detail.protectorInfo.idCode}</Descriptions.Item>
                                <Descriptions.Item label="证件有效期">{this.state.detail.protectorInfo.idExpiryDate}</Descriptions.Item>
                                <Descriptions.Item label="职业">{this.state.detail.protectorInfo.jobName}</Descriptions.Item>
                                <Descriptions.Item label="居住地">{this.state.detail.protectorInfo.address}</Descriptions.Item>
                                <Descriptions.Item label="联系手机">{this.state.detail.protectorInfo.telephone}</Descriptions.Item>
                            </Descriptions>
                            <Divider />
                        </Col>
                    }
                </Row>
            </div>
        )
    }
}
export default BaseInfo;
