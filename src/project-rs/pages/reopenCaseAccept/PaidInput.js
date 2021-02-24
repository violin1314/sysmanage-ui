import React, { Component } from 'react';
import { InputNumber, Input } from 'antd';

class PaidInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            record: {}
        }
    }
    componentDidMount() {
        this.setState({
            record: this.props.item
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        this.setState({
            record: nextProps.item
        })
    }

    render() {
        const codes = ['102700101', '102900101', '101100101'];
        return (
            <tr>
                <td>
                    <Input value={ this.state.record.payDutyName } size="small" onChange={ this.changeInput.bind(this, 'payDutyName') } />
                </td>
                <td>
                    {
                        codes.indexOf(this.state.record.payDutyCode) !== -1 ?
                        <InputNumber value={ this.state.record.franchisePay } size="small" onChange={ this.changeInputNumber.bind(this, 'franchisePay') } step={0.01} style={{ width: '100%' }} /> :
                        <span>{ this.state.record.franchisePay }</span>
                    }
                </td>
                <td>
                    <InputNumber value={ this.state.record.insurancePay } size="small" onChange={ this.changeInputNumber.bind(this, 'insurancePay') } step={0.01} style={{ width: '100%' }} />
                </td>
                <td>
                    <Input.TextArea autoSize value={ this.state.record.comFormula } size="small" onChange={ this.changeInput.bind(this, 'comFormula') } />
                </td>
            </tr>
        )
    }
    changeInputNumber = (key, value) => {
        let record = Object.assign({}, this.state.record)
        record[key] = Number(value).toFixed(2)
    
        this.setState({
            record
        })
        this.props.onChange(record)
    }
    changeInput = (key, e) => {
        let value = e.target.value;
        let record = Object.assign({}, this.state.record)
        record[key] = value
    
        this.setState({
            record
        })
        this.props.onChange(record)
    }
}
export default PaidInput;