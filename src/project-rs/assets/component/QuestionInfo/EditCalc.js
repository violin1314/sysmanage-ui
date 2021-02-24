import React, { Component } from 'react';
import { Form, Tooltip, Icon, InputNumber, message } from 'antd';

import http from '@/utils/http';

//1011001 团体补充医疗-门急诊医疗费用
//1011002 团体补充医疗-住院医疗费用
const OTHERCODES = ['1011001', '1011002']

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
            insuranceCode: ''
        }
    }
    componentDidMount() {
        this.setState({
            record: this.props.item,
            dutys: this.props.dutys,
            insuranceCode: sessionStorage.getItem('questionInsuranceCode')
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        this.setState({
            record: nextProps.item,
            dutys: nextProps.dutys,
            insuranceCode: sessionStorage.getItem('questionInsuranceCode')
        })
    }

    render() {
        return (
            <tr>
                <td>{this.state.record.payDutyName}</td>
                <td>{this.state.record.complianceFee}</td>
                <td>{this.state.record.franchiseTotal}</td>
                {
                    OTHERCODES.indexOf(this.state.insuranceCode) !== -1 ?
                    <td>{this.state.record.punishmentPayProportion}</td> :
                    <React.Fragment>
                        <td>{this.state.record.onePayProportion}</td>
                        <td>{this.state.record.punishmentPayProportion}</td>
                    </React.Fragment>
                }
                <td>{this.state.record.limitMoney}</td>
                <td>{this.state.record.insurancePay}</td>
                <td>{this.state.record.franchisePay}</td>
                <td>
                    <Form.Item>
                        <InputNumber value={ this.state.record.personDeductMoney } size="small" onChange={ this.changeInput.bind(this, 'personDeductMoney') } min={0} step={0.01} formatter={limitDecimals} parser={limitDecimals} style={{ width: 80 }} />
                    </Form.Item>
                </td>
                <td>{this.state.record.otherDeductMoney}</td>
                <td>{this.state.record.comFormula}</td>
                <td align="center">
                    <div className="list-actions">
                        <Tooltip title="理算" onClick={this.calc}>
                            <span><Icon type="calculator" /></span>
                        </Tooltip>
                    </div>
                </td>
            </tr>
        )
    }
    changeInput = (key, value) => {
        let record = Object.assign({}, this.state.record)
        record[key] = value
        record.comFormula = ''
        record.isCalc = 0
        this.setState({
            record
        })
        this.props.onCalc(record)
    }
    calc = () => {
        if(this.state.record.personDeductMoney === null || this.state.record.personDeductMoney === 0){
            message.error('请输入扣款金额')
            return
        }
        delete this.state.record.isCalc
        let data = {
            policyFeeInfoEntityList: [ this.state.record ]
        }
        http.post('/rs/api/claim/question/calcClaimMoneyForAddPosition', data, { isLoading: true }).then(res => {
            let record = res[0]
            this.setState({
                record
            })
            record.isCalc = 1
            this.props.onCalc(record)
        })
    }
}
EditCalc = Form.create()(EditCalc)
export default EditCalc;