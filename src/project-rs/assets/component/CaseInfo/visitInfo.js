import React, { Component } from 'react';
import { Descriptions } from 'antd';
import moment from 'moment'

class VisitInfo extends Component {
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
            <Descriptions size="small" style={{ padding: '0 20px' }}>
                <Descriptions.Item label="入院日期">{ this.state.detail.inHosDate ? moment(this.state.detail.inHosDate).format('YYYY-MM-DD') : '' }</Descriptions.Item>
                <Descriptions.Item label="出院日期">{ this.state.detail.outHosDate ? moment(this.state.detail.outHosDate).format('YYYY-MM-DD') : '' }</Descriptions.Item>
                <Descriptions.Item label="医疗大类">{ this.state.detail.medTypeName }</Descriptions.Item>
                <Descriptions.Item label="医院名称">{ this.state.detail.medicalOrganizationName }</Descriptions.Item>
                <Descriptions.Item label="医院等级">{ this.state.detail.hospitalLevel }</Descriptions.Item>
                <Descriptions.Item label="出院主诊断">{ this.state.detail.outhosDiagnose }</Descriptions.Item>
                <Descriptions.Item label="入院科室">{ this.state.detail.inhosDepartment }</Descriptions.Item>
                <Descriptions.Item label="医疗总费用">{ this.state.detail.medicalTotalMoney }</Descriptions.Item>
                <Descriptions.Item label="乙类自理">{ this.state.detail.partSelfAmnt }</Descriptions.Item>
                <Descriptions.Item label="自费">{ this.state.detail.selfAmnt }</Descriptions.Item>
                <Descriptions.Item label="社保支付金额">{ this.state.detail.siCost }</Descriptions.Item>
                <Descriptions.Item label="经其他报销金额">{ this.state.detail.otherPayMoney }</Descriptions.Item>
                <Descriptions.Item label="是否自费住院">{ this.state.detail.isSelfVisit === '1' && '是' }{ this.state.detail.isSelfVisit === '0' && '否' }</Descriptions.Item>
                <Descriptions.Item label="自费住院社保支计算公式">{ this.state.detail.selfComFormula }</Descriptions.Item>
            </Descriptions>
        )
    }
}
export default VisitInfo;