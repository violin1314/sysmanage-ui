import React, { Component } from 'react';
import { Button, Spin, message } from 'antd';

import utils from '@/utils/index'
import http from '@/utils/http'
import EditCalc from './EditCalc'

class CalcMoney extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dutys: [],
            list: [],
            isLoading: false,
            calcedList: [],
            moneyData: {}
        }
    }
    componentDidMount() {
        this.setState({
            caseId: this.props.caseId,
            policyId: this.props.policyId,
            moneyData: JSON.parse(sessionStorage.moneyData)
        }, () => {
            this.getList()
        })
        utils.getCodeList(['ensure_duty_code'], res => {
            this.setState({
                dutys: res[0].value
            })
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.visible) {
            this.setState({
                caseId: nextProps.caseId,
                policyId: nextProps.policyId,
                moneyData: JSON.parse(sessionStorage.moneyData)
            }, () => {
                this.getList()
            })
        }
    }

    render() {
        let comStr = '';
        if(sessionStorage.getItem('insuranceCode') === '1027001'){
            comStr = `合规费用 = 总费用 - 社保支出 - 其他报销金额 - 乙类自理金额 - 自费金额 = ${this.state.moneyData.medicalTotalMoney} - ${this.state.moneyData.siCost} - ${this.state.moneyData.otherPayMoney} - ${this.state.moneyData.partSelfAmnt} - ${this.state.moneyData.selfAmnt} = ${(this.state.moneyData.medicalTotalMoney - this.state.moneyData.siCost - this.state.moneyData.otherPayMoney - this.state.moneyData.partSelfAmnt - this.state.moneyData.selfAmnt).toFixed(2) }`
        }else if(sessionStorage.getItem('insuranceCode').indexOf('HMBao_2101_2020') !== -1){
            comStr = `合规费用 = 总费用 - 社保支出 - 其他报销金额 - 乙类自理金额 - 自费金额 = ${this.state.moneyData.medicalTotalMoney} - ${this.state.moneyData.siCost} - ${this.state.moneyData.otherPayMoney} - ${this.state.moneyData.partSelfAmnt} - ${this.state.moneyData.selfAmnt} = ${(this.state.moneyData.medicalTotalMoney - this.state.moneyData.siCost - this.state.moneyData.otherPayMoney - this.state.moneyData.partSelfAmnt - this.state.moneyData.selfAmnt).toFixed(2) }（限团体补充医疗-住院医疗费用）`
        }else{
            comStr = `合规费用 = 总费用 - 社保支出 - 其他报销金额 = ${this.state.moneyData.medicalTotalMoney} - ${this.state.moneyData.siCost} - ${this.state.moneyData.otherPayMoney}} = ${(this.state.moneyData.medicalTotalMoney - this.state.moneyData.siCost - this.state.moneyData.otherPayMoney).toFixed(2) }`
        };
        return (
            <Spin spinning={ this.state.isLoading }>
            <div style={{ minHeight: 260 }}>
                <div style={{ marginBottom: 20, color: '#f00' }}>
                    { comStr }
                </div>
                <table className="data-table">
                    <tbody>
                        <tr>
                            <th>责任</th>
                            <th>合规费用A</th>
                            <th>剩余免赔额/次免赔额B</th>
                            <th>赔付比例C</th>
                            <th>罚则比例F</th>
                            <th width="80">限额G</th>
                            <th width="90">理赔金额K</th>
                            <th width="100">免赔额抵扣</th>
                            <th>计算公式</th>
                            <th width="60" align="center">操作</th>
                        </tr>
                        {
                            this.state.list.map(item => (
                                <EditCalc comStr={comStr} dutys={ this.state.dutys } item={ item } key={ item.key } onDel={ this.onDel } onCalc={ this.onCalc } />
                            ))
                        }
                    </tbody>
                </table>
                <div style={{ marginTop: 30, textAlign: 'center' }}>
                    <Button type="primary" onClick={ this.onSubmit }>确定</Button>
                    <Button onClick={ this.cancel } style={{ marginLeft: 20 }}>返回</Button>
                </div>
            </div>
            </Spin>
        )
    }
    getList = () => {
        let data = {
            policyId: this.state.policyId,
            caseInfoId: this.state.caseId
        }
        this.setState({
            isLoading: true,
            list: []
        })
        http.post('/rs/api/claim/policyPlan/findPolicyPlanByID', data).then(res => {
            res.forEach((item, index) => {
                item['key'] = index
            })
            setTimeout(() => {
                this.setState({
                    list: res,
                    isLoading: false
                })
            }, 100)
        })
    }
    onDel = delItem => {
        let list = this.state.list.slice()

        list = list.filter(item => item.key !== delItem.key)
        this.setState({
            list
        })
    }
    onCalc = calcItem => {
        let list = this.state.list
        let index = 0
        list.forEach((item, idx) => {
            if(Number(item.key) === Number(calcItem.key)){
                index = idx
            }
        })
        list[index] = calcItem
        this.setState({
            list
        })
    }
    onSubmit = () => {
        let isCalcAll = true
        this.state.list.forEach(item => {
            if(item.comFormula === null){
                isCalcAll = false
            }
        })
        if(!isCalcAll){
            message.error('请理算全部责任')
            return
        }
        this.props.onQuery(this.state.list)
    }
    cancel = () => {
        this.props.onCancel()
    }
}
export default CalcMoney;