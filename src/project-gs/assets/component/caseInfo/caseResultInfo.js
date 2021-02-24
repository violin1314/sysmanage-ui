import React, { Component } from 'react';
import { Descriptions, Row, Col } from 'antd';
import moment from 'moment'

class CaseResultInfo extends Component {
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
                    this.state.detail.claimNo
                        ?
                        <Descriptions size="small" column={1} style={{ padding: '0 20px' }}>
                            <Descriptions.Item label="个人服务号">{this.state.detail.claimNo}</Descriptions.Item>
                            <Descriptions.Item label="案件理赔状态">{this.caseStateName(this.state.detail.caseState)}</Descriptions.Item>
                            <Descriptions.Item label="实际赔付金额">{this.state.detail.insurancePay}</Descriptions.Item>
                            <Descriptions.Item label="结算方式">直赔</Descriptions.Item>
                        </Descriptions>
                        :
                        <div style={{ textAlign: 'center', padding: 30, color: '#999' }}>暂无数据</div>
                }
            </div>
        )
    }

    caseStateName = (caseState)=>{
        var name = "";
        if(caseState && caseState=="01"){
            name ="录入完成,待影像件";
        }
        if(caseState && caseState=="02"){
            name ="影像件完成";
        }
        if(caseState && caseState=="03"){
            name ="已推送国寿";
        }
        if(caseState && caseState=="04"){
            name ="结案";
        }
        return name;
    }
}
export default CaseResultInfo;