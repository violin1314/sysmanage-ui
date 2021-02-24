import React, { Component } from 'react';
import { Form, Input, Select, Button, message, InputNumber, Spin } from 'antd';

import http from '@/utils/http'
import utils from '@/utils'
import EditCalc from './EditCalc'
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
class QuestionCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            caseId: '',
            indemnityCaseNo: '',
            insuranceCode: '',
            list: [],
            ruleList: [],
            deductReasons: [],
            visitDetailInfos: [],
            isLoading: false,

            bookStr: ''
        }
    }
    componentDidMount() {
        this.setState({
            caseId: this.props.caseId,
            indemnityCaseNo: this.props.indemnityCaseNo,
            insuranceCode: sessionStorage.getItem('questionInsuranceCode'),
            ruleList: this.props.rules
        }, () => {
            this.getFeeList()
        })

        utils.getCodeList(['deduct_reason_code'], res => {
            this.setState({
                deductReasons: res[0].value
            })
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(!nextProps.indemnityCaseNo || this.props.indemnityCaseNo === nextProps.indemnityCaseNo){
            return
        }
        this.props.form.resetFields()
        this.setState({
            caseId: nextProps.caseId,
            indemnityCaseNo: nextProps.indemnityCaseNo,
            insuranceCode: sessionStorage.getItem('questionInsuranceCode'),
            ruleList: nextProps.rules,
            bookStr: '',
            list: [],
            visitDetailInfos: []
        }, () => {
            this.getFeeList()
        })
    }
    getFeeList = () => {
        this.setState({
            isLoading: true
        })
        let data = {
            indemnityCaseNo: this.state.indemnityCaseNo,
        }
        http.post('/rs/api/claim/policyFee/findPolicyFeeByCaseNo', data).then(res => {
            this.setState({
                list: res
            })
            if(res.length > 0){
                this.queryVisitDetailInfoByCaseInfoId()
            }else{
                this.setState({
                    isLoading: false
                })
            }
        })
    }
    queryVisitDetailInfoByCaseInfoId = () => {
        if(!this.state.caseId){
            return
        }
        http.post('/rs/api/claim/visitInfo/queryVisitDetailInfoByCaseInfoId', { id: this.state.caseId }).then(res => {
            this.setState({
                visitDetailInfos: res,
                isLoading: false
            })
        })
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <Spin spinning={ this.state.isLoading }>
                <table className="data-table">
                    <tbody>
                        <tr>
                            <th>责任</th>
                            <th width="88">合规费用A</th>
                            <th width="100">剩余免赔额/次免赔额B</th>
                            {
                                OTHERCODES.indexOf(this.state.insuranceCode) !== -1 ?
                                <th width="80">赔付比例</th> :
                                <React.Fragment>
                                    <th width="80">赔付比例C</th>
                                    <th width="80">罚则比例F</th>
                                </React.Fragment>
                            }
                            <th width="60">限额G</th>
                            <th width="88">理赔金额K</th>
                            <th width="92">免赔额抵扣</th>
                            <th width="98">扣款金额H</th>
                            <th width="82">其他扣款I</th>
                            <th width="280">计算公式</th>
                            <th width="50" align="center">操作</th>
                        </tr>
                        {
                            this.state.list.map(item => (
                                <EditCalc dutys={ this.state.dutys } item={ item } key={ item.id } onCalc={ this.onCalc } />
                            ))
                        }
                    </tbody>
                </table>
                {
                    this.state.visitDetailInfos.length > 0 &&
                    <table className="data-table" style={{ marginTop: 10 }}>
                        <tbody>
                            <tr>
                                <th>医院名称</th>
                                <th>入院日期</th>
                                <th>出院日期</th>
                                <th>总费用</th>
                                <th>票据号</th>
                                <th width="120">扣款金额H</th>
                            </tr>
                            {
                                this.state.visitDetailInfos.map(item => (
                                    <tr key={ item.id }>
                                        <td>{ item.medicalOrganizationName }</td>
                                        <td>{ item.inHosDate }</td>
                                        <td>{ item.outHosDate }</td>
                                        <td>{ item.medicalTotalMoney }</td>
                                        <td>{ item.billNo }</td>
                                        <td>
                                            <InputNumber
                                                value={ item.personDeductMoney }
                                                size="small"
                                                min={0}
                                                step={0.01}
                                                formatter={limitDecimals}
                                                parser={limitDecimals}
                                                style={{ width: 100 }}
                                                onChange={ this.changeMondy.bind(this, item) }
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }
                <div style={{ marginTop: 15, padding: 15, border: '1px solid #e8e8e8'}}>
                    <Button type="primary" size="small" onClick={ this.calcBook }>生成计算书</Button>
                    <div style={{ padding: 15, marginTop: 15, background: '#f1f1f1' }}>
                        { this.state.bookStr ? this.state.bookStr : <p style={{ textAlign: 'center', padding: 20, color: '#999'}}>暂无计算书</p> }
                    </div>
                </div>
                <Form layout="inline" onSubmit={ this.searchSubmit } style={{ marginTop: 40 }}>
                    <Form.Item label="疑点名称">
                        {getFieldDecorator('pointName', {
                            rules: [{ required: true, message: '请输入疑点名称' }]
                        })(
                            <Input placeholder="请输入疑点名称" />
                        )}
                    </Form.Item>
                    <Form.Item label="疑点规则">
                        {getFieldDecorator('ruleId', {
                            rules: [{ required: true, message: '请选择疑点规则' }]
                        })(
                            <Select placeholder="请选择疑点规则" style={{ width: 180 }}>
                            {
                                this.state.ruleList.map(item => (
                                    <Select.Option key={ item.ruleCode } value={ item.ruleCode }>{ item.ruleName }</Select.Option>
                                ))
                            }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="扣除原因">
                        {getFieldDecorator('deductReasonCode', {
                            rules: [{ required: true, message: '请选择扣除原因' }]
                        })(
                            <Select placeholder="请选择扣除原因" mode="multiple" style={{ width: 180 }}>
                            {
                                this.state.deductReasons.map(item => (
                                    <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                                ))
                            }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="备注">
                        {getFieldDecorator('remark')(
                            <Input placeholder="请输入备注" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">保存</Button>
                    </Form.Item>
                </Form>
                </Spin>
            </div>
        )
    }
    changeMondy = (record, value) => {
        let visitDetailInfos = JSON.parse(JSON.stringify(this.state.visitDetailInfos))
        visitDetailInfos.forEach(item => {
            if(item.id === record.id){
                item.personDeductMoney = value
            }
        })
        this.setState({
            visitDetailInfos
        })
    }
    onCalc = calcItem => {
        let list = JSON.parse(JSON.stringify(this.state.list))
        let index = 0
        list.forEach((item, idx) => {
            if(item.id === calcItem.id){
                index = idx
            }
        })
        list[index] = calcItem
        this.setState({
            list,
            bookStr: ''
        })
    }
    calcBook = () => {
        if(this.state.list.length === 0){
            message.error('请先进行理算')
            return
        }
        let isCalcAll = true
        this.state.list.forEach(item => {
            if(item.isCalc !== 1){
                isCalcAll = false
            }
        })
        if(!isCalcAll){
            message.error('请理算全部责任')
            return
        }
        
        let bookStr = ''
        let str1 = ''
        let str2 = ''
        let num = 0
        this.state.list.forEach(item => {
            str1 += `${item.payDutyName}${item.comFormula} `
            str2 += `${item.payDutyName}赔付金额+`
            num += Number(item.insurancePay)
        })
        str2 = str2.substring(0, str2.length-1)

        bookStr = `${str1}赔付金额合计=${str2}=${num}`
        this.setState({
            bookStr
        })
    }

    searchSubmit = e => {
        e.preventDefault()
        let isCalcAll = true
        this.state.list.forEach(item => {
            if(item.isCalc !== 1){
                isCalcAll = false
            }
        })
        if(!isCalcAll){
            message.error('请理算全部责任')
            return
        }

        let visitDetailInfos = JSON.parse(JSON.stringify(this.state.visitDetailInfos));
        if(visitDetailInfos.length > 0){
            let list = JSON.parse(JSON.stringify(this.state.list));
            let deductMoneyTotal = 0;
            visitDetailInfos.forEach(item => {
                deductMoneyTotal += Number(item.personDeductMoney)
            })
            let moneyTotal = 0;
            list.forEach(item => {
                moneyTotal += Number(item.personDeductMoney)
            })
            if(moneyTotal.toFixed(2) !== deductMoneyTotal.toFixed(2)){
                message.error('就诊扣款总金额与就诊明细扣款总金额不符')
                return
            }
        }

        if(this.state.bookStr === ''){
            message.error('请先生成计算书')
            return
        }

        this.props.form.validateFieldsAndScroll((err, values) => {
            if(err){
                return
            }
            let calcList = JSON.parse(JSON.stringify(this.state.list))
            calcList.forEach(item => {
                delete item.isCalc
            })

            values.deductReasonCode = values.deductReasonCode.join()
            let data = values
            data.indemnityCaseId = this.state.caseId
            data.policyFeeInfoEntityList = calcList
            data.comFormula = this.state.bookStr
            let visitDetailInfoEntityList = []
            visitDetailInfos.forEach(item => {
                visitDetailInfoEntityList.push({ id: item.id, personDeductMoney: item.personDeductMoney })
            })
            data.visitDetailInfoEntityList = visitDetailInfoEntityList

            http.post('/rs/api/claim/question/addCaseQuestionablePoint', data, { isLoading: true }).then(res => {
                message.success('疑点录入成功')
                this.props.onSuc()
            })
        })
    }
}
QuestionCreate = Form.create()(QuestionCreate)
export default QuestionCreate;