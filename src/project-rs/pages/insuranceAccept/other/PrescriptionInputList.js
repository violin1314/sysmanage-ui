import React, { Component } from 'react';
import { Button, message } from 'antd';

import PrescriptionInput from './PrescriptionInput'
import utils from '@/utils/index'

class PrescriptionInputList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            relevanceType: '',
            grades: [],
            types: [],
            list: [],
            isLoading: false,
            calcedList: [],
            moneyData: {},
            moneyTotal: 0,
            partSelfAmnt: 0,
            selfAmnt: 0,

            billNoList: [],

            curIndex: 0
        }
    }
    componentDidMount() {
        this.setState({
            relevanceType: '01',
            list: this.props.list,
            billNoList: this.props.billNoList
        })
        utils.getCodeList(['fee_project_grade', 'item_type_yb'], res => {
            this.setState({
                grades: res[0].value,
                // types: res[1].value
            })
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        let partSelfAmnt = 0
        let selfAmnt = 0
        let moneyTotal = 0
        nextProps.list.forEach(item => {
            partSelfAmnt += Number(item.partSelfAmnt)
            selfAmnt += Number(item.selfAmnt)
            moneyTotal += Number(item.money)
        })
        this.setState({
            relevanceType: '01',
            list: nextProps.list,
            moneyTotal: moneyTotal.toFixed(2),
            partSelfAmnt: partSelfAmnt.toFixed(2),
            selfAmnt: selfAmnt.toFixed(2),
            billNoList: nextProps.billNoList
        })
    }

    render() {
        return (
            <div>
                {
                    !this.props.isOther &&
                    <table className="data-table small-data-table">
                        <tbody>
                            <tr>
                                <td>
                                    <strong style={{ padding: '4px 6px' }}>处方信息</strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                }
                <div style={{ overflowY: 'scroll' }}>
                    <table className="data-table small-data-table">
                        <tbody>
                            <tr>
                                <th width="140">发票号</th>
                                <th width="100">OCR名称</th>
                                <th>项目名称</th>
                                <th width="80">单价</th>
                                <th width="60">数量</th>
                                <th width="80">金额</th>
                                {/* <th width="180">费用类别</th> */}
                                <th width="100">收费项目等级</th>
                                {
                                    this.state.relevanceType === '01' && <th width="80">自理比例</th>
                                }
                                <th width="80">乙类自理</th>
                                <th width="80">自费</th>
                                {
                                    this.state.relevanceType === '01' && <th width="50" align="center"></th>
                                }
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="dataTable" style={{ maxHeight: 160, overflow: 'scroll' }}>
                    <table className="data-table small-data-table">
                        <tbody>
                        {
                            this.state.list.length === 0 ?
                            <tr>
                                <td colSpan={ this.state.relevanceType === '01' ? '10' : '8' }>
                                    <p style={{ padding: 8, textAlign: 'center', color: '#bfbfbf' }}>暂无数据</p>
                                </td>
                            </tr> :
                            this.state.list.map((item, index) => (
                                <PrescriptionInput
                                    relevanceType={ this.state.relevanceType }
                                    item={ item }
                                    key={ item.key }
                                    index={ index }
                                    onDel={ this.onDel }
                                    grades={ this.state.grades }
                                    // types={ this.state.types }
                                    onChange={ this.onItemChange }
                                    onEnter={ this.add }
                                    billNoList={ this.state.billNoList }
                                    curIndex={ this.state.curIndex }
                                    onAdd={ this.onAdd }
                                />
                            ))
                        }
                        </tbody>
                    </table>
                </div>
                {
                    this.state.relevanceType === '01' &&
                    <table className="data-table small-data-table">
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'right' }}>
                                    <span style={{ marginRight: 30 }}>金额统计：{ this.state.moneyTotal } 元</span>
                                    <span style={{ marginRight: 30 }}>乙类自理金额统计：{ this.state.partSelfAmnt } 元</span>
                                    <span style={{ marginRight: 30 }}>自费金额统计：{ this.state.selfAmnt } 元</span>
                                    <Button type="primary" size="small" onClick={ this.add } id="$prescriptionAdd">增加</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                }
            </div>
        )
    }
    add = () => {
        if(!sessionStorage.getItem('insuredCityCode')){
            message.error('请选择参保所在地市')
            return
        }
        let list = JSON.parse(JSON.stringify(this.state.list))
        list.push({
            key: new Date().getTime(),
            ocrDentifyData: '',
            projectCode: '',
            projectName: '',
            price: '',
            num: 1,
            money: 0,
            itemTypeYb: '',
            feeProjectGrade: '',
            partSelfAmnt: 0,
            selfAmnt: 0,
            ylRatio: 0,
            isValid: '0'
        })
        this.setState({
            list
        })
        this.props.onChange(list)

        setTimeout(() => {
            let dataTable = document.querySelector('#dataTable')
            dataTable.scrollTop = dataTable.scrollHeight
        }, 100)
    }
    onDel = delItem => {
        let list = JSON.parse(JSON.stringify(this.state.list))        

        list = list.filter(item => item.key !== delItem.key)
        this.setState({
            list
        })
        this.props.onChange(list)
    }
    onItemChange = changeItem => {
        if(changeItem.projectCode && changeItem.price && changeItem.num && changeItem.billNo ){
            changeItem.isValid = '1'
        }else{
            changeItem.isValid = '0'
        }
        let list = this.state.list
        let index = 0
        list.forEach((item, idx) => {
            if(Number(item.key) === Number(changeItem.key)){
                index = idx
            }
        })
        list[index] = changeItem
        this.setState({
            list
        })
        if(changeItem.isValid === '0'){
            return
        }
        this.props.onChange(list)
    }

    onAdd = index => {
        let list = JSON.parse(JSON.stringify(this.state.list))
        let a1 = list.slice(0, index + 1)
        let a2 = list.slice(index + 1, list.length)

        let item = {
            key: new Date().getTime(),
            ocrDentifyData: '',
            projectCode: '',
            projectName: '',
            price: '',
            num: 1,
            money: 0,
            itemTypeYb: '',
            feeProjectGrade: '',
            partSelfAmnt: 0,
            selfAmnt: 0,
            ylRatio: 0,
            isValid: '0'
        }
        a1.push(item)
        let newList = a1.concat(a2)
        this.setState({
            list: newList
        })
        this.props.onChange(newList)
    }
}
export default PrescriptionInputList;