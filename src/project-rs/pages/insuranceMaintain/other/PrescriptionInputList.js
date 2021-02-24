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

            billNoList: []
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
        this.setState({
            relevanceType: '01',
            list: nextProps.list,
            moneyTotal: nextProps.moneyTotal,
            partSelfAmnt: nextProps.partSelfAmnt,
            selfAmnt: nextProps.selfAmnt,
            billNoList: nextProps.billNoList
        })
    }

    render() {
        return (
            <div>
                <table className="data-table">
                    <tbody>
                        <tr>
                            <td colSpan={ this.state.relevanceType === '01' ? '10' : '8' }>
                                <strong style={{ padding: '4px 6px' }}>处方信息</strong>
                            </td>
                        </tr>
                        <tr>
                            <th width="170">发票号</th>
                            <th>项目名称</th>
                            <th width="120">单价</th>
                            <th width="100">数量</th>
                            <th width="100">金额</th>
                            {/* <th width="180">费用类别</th> */}
                            <th width="120">收费项目等级</th>
                            {
                                this.state.relevanceType === '01' && <th width="120">自理比例</th>
                            }
                            <th width="120">乙类自理</th>
                            <th width="120">自费</th>
                            {
                                this.state.relevanceType === '01' && <th width="70" align="center">操作</th>
                            }
                        </tr>
                        {
                            this.state.list.length === 0 ?
                            <tr>
                                <td colSpan={ this.state.relevanceType === '01' ? '10' : '8' }>
                                    <p style={{ padding: 8, textAlign: 'center', color: '#bfbfbf' }}>暂无数据</p>
                                </td>
                            </tr> :
                            this.state.list.map(item => (
                                <PrescriptionInput
                                    relevanceType={ this.state.relevanceType }
                                    item={ item }
                                    key={ item.key }
                                    onDel={ this.onDel }
                                    grades={ this.state.grades }
                                    // types={ this.state.types }
                                    onChange={ this.onItemChange }
                                    onEnter={ this.add }
                                    billNoList={ this.state.billNoList }
                                />
                            ))
                        }
                        {
                            this.state.relevanceType === '01' &&
                            <tr>
                                <td colSpan={ this.state.relevanceType === '01' ? '10' : '8' } style={{ textAlign: 'right' }}>
                                    <span style={{ marginRight: 30 }}>金额统计：{ this.state.moneyTotal } 元</span>
                                    <span style={{ marginRight: 30 }}>乙类自理金额统计：{ this.state.partSelfAmnt } 元</span>
                                    <span style={{ marginRight: 30 }}>自费金额统计：{ this.state.selfAmnt } 元</span>
                                    <Button type="primary" size="small" onClick={ this.add } id="$prescriptionAdd">新增处方</Button>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        )
    }
    add = () => {
        if(!sessionStorage.getItem('insuredCityCode')){
            message.error('请选择参保所在地市')
            return
        }
        let list = this.state.list.slice()
        list.push({
            key: new Date().getTime(),
            projectCode: '',
            projectName: '',
            price: '',
            num: '',
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
    }
    onDel = delItem => {
        let list = this.state.list.slice()

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
}
export default PrescriptionInputList;