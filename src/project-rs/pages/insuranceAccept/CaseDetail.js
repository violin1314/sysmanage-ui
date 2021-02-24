import React, { Component } from 'react'
import { Descriptions, Spin } from 'antd';

import http from '@/utils/http'
import moment from 'moment'

class CaseDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detail: {},
            isLoading: false
        }
    }
    componentDidMount() {
        this.getDetail(this.props.id)
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(!nextProps.id){
            return
        }
        this.getDetail(nextProps.id)
    }
    render() {
        return (
            <Spin spinning={ this.state.isLoading }>
                <Descriptions bordered size="small" style={{ padding: 20 }}>
                    <Descriptions.Item label="报案人编码">
                        { this.state.detail.reportAcceptOper }
                    </Descriptions.Item>
                    <Descriptions.Item label="报案时间">
                        { this.state.detail.acceptDate ? moment(this.state.detail.acceptDate).format('YYYY-MM-DD') : '' }
                    </Descriptions.Item>
                    <Descriptions.Item label="报案号">
                        { this.state.detail.reportNo }
                    </Descriptions.Item>
                    <Descriptions.Item label="报案方式">
                        { this.state.detail.reporterChannelName }
                    </Descriptions.Item>
                    <Descriptions.Item label="报案注销人编码">
                        { this.state.detail.reportCancelOper }
                    </Descriptions.Item>
                    <Descriptions.Item label="报案注销时间">
                        { this.state.detail.reportCancelDate ? moment(this.state.detail.reportCancelDate).format('YYYY-MM-DD') : '' }
                    </Descriptions.Item>
                    <Descriptions.Item label="报案人姓名">
                        { this.state.detail.applyName }
                    </Descriptions.Item>
                    <Descriptions.Item label="报案人联系电话">
                        { this.state.detail.applyTelephone }
                    </Descriptions.Item>
                    <Descriptions.Item label="报案人与被保险人关系">
                        { this.state.detail.applyRelationshipName }
                    </Descriptions.Item>
                    <Descriptions.Item label="联系人姓名">
                        { this.state.detail.contactName }
                    </Descriptions.Item>
                    <Descriptions.Item label="联系人电话">
                        { this.state.detail.contactTel }
                    </Descriptions.Item>
                    <Descriptions.Item label="出险日期">
                        { this.state.detail.accidentDate ? moment(this.state.detail.accidentDate).format('YYYY-MM-DD') : '' }
                    </Descriptions.Item>
                    <Descriptions.Item label="出险地点">
                        { this.state.detail.damageAddress }
                    </Descriptions.Item>
                    <Descriptions.Item label="出险原因">
                        { this.state.detail.accidentReasonName }
                    </Descriptions.Item>
                    <Descriptions.Item label="报案注销原因">
                        { this.state.detail.reportCancelReasonName }
                    </Descriptions.Item>
                    <Descriptions.Item label="案件状态">
                        { this.state.detail.caseStateName }
                    </Descriptions.Item>
                    <Descriptions.Item label="报案疾病名称">
                        { this.state.detail.reportDiseaseName }
                    </Descriptions.Item>
                    <Descriptions.Item label="报案医院名称">
                        { this.state.detail.reportHospitalName }
                    </Descriptions.Item>
                    <Descriptions.Item label="立案日期">
                        { this.state.detail.reporterDate ? moment(this.state.detail.reporterDate).format('YYYY-MM-DD') : '' }
                    </Descriptions.Item>
                    <Descriptions.Item label="立案员编码">
                        { this.state.detail.caseAcceptOper }
                    </Descriptions.Item>
                    <Descriptions.Item label="结案日期">
                        { this.state.detail.caseCloseDate ? moment(this.state.detail.caseCloseDate).format('YYYY-MM-DD') : '' }
                    </Descriptions.Item>
                    <Descriptions.Item label="结案人员编码">
                        { this.state.detail.caseCloseOper }
                    </Descriptions.Item>
                    <Descriptions.Item label="医疗费总额汇总">
                        { this.state.detail.balanceMoney }
                    </Descriptions.Item>
                    <Descriptions.Item label="赔案号">
                        { this.state.detail.indemnityCaseNo }
                    </Descriptions.Item>
                    <Descriptions.Item label="经其他途径报销金额">
                        { this.state.detail.otherPayMoney }
                    </Descriptions.Item>
                </Descriptions>
            </Spin>
        )
    }
    getDetail = id => {
        this.setState({
            detail: {},
            isLoading: true
        })
        http.post('/rs/api/claim/reportCase/detail', {id: id}).then(res => {
            this.setState({
                detail: res,
                isLoading: false
            })
        })
    }
}
export default CaseDetail