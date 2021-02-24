import React, { Component } from 'react';
import { Form, Tooltip, Icon, InputNumber, message } from 'antd';

import http from '@/utils/http';
const limitDecimals = value => {
    const reg = /^(\d-)*(\d+)\.(\d\d).*$/;
    if(typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
    } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
    } else {
        return ''
    }
}
class EditCalc extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dutys: [],
            record: {},
            key: 0,
            comStr: ''
        }
    }
    componentDidMount() {
        this.setState({
            record: this.props.item,
            dutys: this.props.dutys,
            key: this.props.key,
            comStr: this.props.comStr
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        this.setState({
            record: nextProps.item,
            dutys: nextProps.dutys,
            key: nextProps.key,
            comStr: nextProps.comStr
        })
    }

    render() {
        return (
            <tr>
                <td>
                    { this.state.record.payDutyName }
                </td>
                <td>
                    <InputNumber value={ this.state.record.complianceFee } size="small" onChange={ this.changeInput.bind(this, 'complianceFee') } step={0.01} formatter={limitDecimals} parser={limitDecimals} style={{ width: 80 }} />
                </td>
                <td>
                    <InputNumber value={ this.state.record.franchiseTotal } size="small" disabled={ this.state.record.dutyCode !== '102700101'} onChange={ this.changeInput.bind(this, 'franchiseTotal') } step={0.01} formatter={limitDecimals} parser={limitDecimals} style={{ width: 80 }} />
                </td>
                <td>{this.state.record.onePayProportion}</td>
                <td>
                    <InputNumber min={0} max={1} value={ this.state.record.punishmentPayProportion } size="small" onChange={ this.changeInput.bind(this, 'punishmentPayProportion') } step={0.01} formatter={limitDecimals} parser={limitDecimals} style={{ width: 80 }} />
                </td>
                <td>{this.state.record.limitMoney}</td>
                <td>{this.state.record.insurancePay}</td>
                <td>{this.state.record.franchise}</td>
                <td>{this.state.record.comFormula}</td>
                <td align="center">
                    <div className="list-actions">
                        <Tooltip title="理算" onClick={this.calc}>
                            <span><Icon type="calculator" /></span>
                        </Tooltip>
                        <Tooltip title="删除" onClick={this.del}>
                            <span><Icon type="delete" /></span>
                        </Tooltip>
                    </div>
                </td>
            </tr>
        )
    }
    changeInput = (key, value) => {
        let record = Object.assign({}, this.state.record)
        record[key] = value
        this.setState({
            record
        })
        this.props.onCalc(record, record.key)
    }
    calc = () => {
        if(this.state.record.dutyCode === null || this.state.record.complianceFee === null || this.state.record.franchiseTotal === null || this.state.record.onePayProportion === null || this.state.record.punishmentPayProportion === null){
            message.error('请填写完整理算因子')
            return
        }
        let data = {
            policyFeeDTOList: [ this.state.record ],
            comStr: this.state.comStr
        }
        http.post('/rs/api/claim/caseinfo/calcClaimMoney', data, { isLoading: true }).then(res => {
            this.setState({
                record: res[0]
            })
            this.props.onCalc(res[0], res[0].key)
        })
    }
    del = () => {
        this.props.onDel(this.state.record)
    }
    cancel = () => {
        this.props.form.resetFields()
        this.props.onQuery('cancel')
    }
}
EditCalc = Form.create()(EditCalc)
export default EditCalc;