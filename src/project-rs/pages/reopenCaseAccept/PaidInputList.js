import React, { Component } from 'react';

import PaidInput from './PaidInput'

class PaidInputList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            isLoading: false
        }
    }
    componentDidMount() {
        this.setState({
            list: this.props.list
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            list: nextProps.list
        })
    }

    render() {
        return (
            <div>
                <table className="data-table">
                    <tbody>
                        <tr>
                            <th width="30%">责任名称</th>
                            <th width="12%">免赔额抵扣</th>
                            <th width="12%">赔付金额</th>
                            <th>计算公式</th>
                        </tr>
                        {
                            this.state.list.length === 0 ?
                            <tr>
                                <td colSpan="4">
                                    <p style={{ padding: 8, textAlign: 'center', color: '#bfbfbf' }}>暂无数据</p>
                                </td>
                            </tr> :
                            this.state.list.map(item => (
                                <PaidInput
                                    item={ item }
                                    key={ item.id }
                                    onChange={ this.onItemChange }
                                />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        )
    }
    onItemChange = changeItem => {
        if(changeItem.payDutyName && changeItem.franchisePay !== null && changeItem.insurancePay !== null && changeItem.comFormula){
            changeItem.isValid = '1'
        }else{
            changeItem.isValid = '0'
        }
        let list = this.state.list
        let index = 0
        list.forEach((item, idx) => {
            if(item.id === changeItem.id){
                index = idx
            }
        })
        list[index] = changeItem
        this.setState({
            list
        })
        this.props.onChange(list)
    }
}
export default PaidInputList;