import React, { Component } from 'react';
import { Form, Tooltip, Icon, InputNumber, Select, message, Input } from 'antd';

import ItemSelect from '../ItemSelect';

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

const Zheng = value => {
    const reg = /^\+?[1-9][0-9]*$/;
    if(reg.test(value)){
        return value
    }else{
        return ''
    }
}

class PrescriptionInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            relevanceType: '',

            grades: [],
            billNoList: [],

            record: {},
            key: 0,
            isLoading: false,
            itemList: []
        }
    }
    componentDidMount() {
        this.setState({
            relevanceType: '01',
            record: this.props.item,
            grades: this.props.grades,
            billNoList: this.props.billNoList,
            key: this.props.key
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        this.setState({
            relevanceType: '01',
            record: nextProps.item,
            grades: nextProps.grades,
            billNoList: nextProps.billNoList,
            key: nextProps.key
        })
    }

    render() {
        return (
            this.state.relevanceType === '01' ?
            <tr>
                <td>
                    <Select placeholder="发票号" size="small" value={ this.state.record.billNo } onChange={ this.changeBillNo } style={{ minWidth: 150 }}>
                    {
                        this.state.billNoList.map((item, index) => (
                            <Select.Option value={ item } key={ index }>{ item }</Select.Option>
                        ))
                    }
                    </Select>
                </td>
                <td>
                    <ItemSelect
		                id="prescriptionItem"
                        value={ this.state.record.projectName }
                        onChange={ this.changeItem }
                        label="项目"
                        size="small"
                        valueName="projectName"
                        url="/rs/api/claim/querySiCatalog/findSiCatalogByContion"
                    />
                </td>
                <td>
                    <InputNumber id="$priceInput" value={ this.state.record.price } size="small" onChange={ this.changeInput.bind(this, 'price') } min={0} formatter={limitDecimals} parser={limitDecimals} style={{ width: 100 }} />
                </td>
                <td>
                    <InputNumber id="$numInput" value={ this.state.record.num } size="small" onChange={ this.changeInput.bind(this, 'num') } min={0} formatter={Zheng} parser={Zheng} style={{ width: 80 }} />
                </td>
                <td>
                    { this.state.record.money }
                </td>
                {/* <td>
                    <Select
                        placeholder="请选择费用类别"
                        size="small"
                        value={ this.state.record.itemTypeYb }
                        onChange={ this.changeType }
                        style={{ width: '100%' }}
                    >
                    {
                        this.state.types.map(item => (
                            <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                        ))
                    }
                    </Select>
                </td> */}
                <td>
                    <Select
                        placeholder="请选择收费项目等级"
                        size="small"
                        value={ this.state.record.feeProjectGrade }
                        onChange={ this.changeGrade }
                        style={{ width: '100%' }}
                    >
                    {
                        this.state.grades.map(item => (
                            <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                        ))
                    }
                    </Select>
                </td>
                <td>
                    <InputNumber value={ this.state.record.ylRatio } size="small" onChange={ this.changeInput.bind(this, 'ylRatio') } min={0} max={1} formatter={limitDecimals} parser={limitDecimals} style={{ width: 80 }} />
                </td>
                <td>
                    <InputNumber defaultValue={ 0 } value={ this.state.record.partSelfAmnt } size="small" onChange={ this.changeInput.bind(this, 'partSelfAmnt') } min={0} formatter={limitDecimals} parser={limitDecimals} style={{ width: 80 }} />
                </td>
                <td>
                    <Input value={ this.state.record.selfAmnt } size="small" onChange={ this.changeInput.bind(this, 'selfAmnt') } style={{ width: 80 }} onPressEnter={ this.clickEnter } />
                </td>
                <td align="center">
                    <div className="list-actions">
                        <Tooltip title="删除" onClick={this.del}>
                            <span><Icon type="delete" /></span>
                        </Tooltip>
                    </div>
                </td>
            </tr> :
            <tr>
                <td>{ this.state.record.billNo }</td>
                <td>{ this.state.record.projectName }</td>
                <td>{ this.state.record.price }</td>
                <td>{ this.state.record.num }</td>
                <td>{ this.state.record.money }</td>
                {/* <td>{ this.state.record.itemTypeYb }</td> */}
                <td>
                    <Select
                        placeholder="请选择收费项目等级"
                        size="small"
                        value={ this.state.record.feeProjectGrade }
                        onChange={ this.changeGrade }
                        style={{ width: '100%' }}
                    >
                    {
                        this.state.grades.map(item => (
                            <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                        ))
                    }
                    </Select>
                </td>
                <td>
                    <InputNumber defaultValue={ 0 } value={ this.state.record.partSelfAmnt } size="small" onChange={ this.changeInput.bind(this, 'partSelfAmnt') } min={0} formatter={limitDecimals} parser={limitDecimals} style={{ width: 80 }} />
                </td>
                <td>
                    <Input value={ this.state.record.selfAmnt } size="small" onChange={ this.changeInput.bind(this, 'selfAmnt') } style={{ width: 80 }} />
                </td>
            </tr>
        )
    }
    changeBillNo = v => {
        let record = Object.assign({}, this.state.record);
        record['billNo'] = v;
        this.setState({
            record
        })
        this.props.onChange(record, record.key)
    }
    changeItem = item => {
        let record = Object.assign({}, this.state.record)
        record['projectCode'] = item.projectCode
        record['projectName'] = item.projectName
        record['feeProjectGrade'] = item.feeProjectGrade
        record['ylRatio'] = item.ylRatio
        record['partSelfAmnt'] = 0

        if(record.price && record.num){
            if(record.feeProjectGrade === '1'){
                record.partSelfAmnt = 0
                record.selfAmnt = 0
            }else if(record.feeProjectGrade === '2'){
                let ylRatio = record.ylRatio ? Number(record.ylRatio) : 0.1;
                record.partSelfAmnt = Number((record.price * record.num * ylRatio).toFixed(2))
                record.selfAmnt = 0
            }else if(record.feeProjectGrade === '3'){
                record.partSelfAmnt = 0
                record.selfAmnt = Number((record.price * record.num).toFixed(2))
            }
        }
        
        this.setState({
            record
        })
        this.props.onChange(record, record.key)
    }
    // changeType = v => {
    //     let record = Object.assign({}, this.state.record)
    //     record['itemTypeYb'] = v
    //     this.setState({
    //         record
    //     })
    //     this.props.onChange(record, record.key)
    // }
    changeGrade = v => {
        let record = Object.assign({}, this.state.record)
        record['feeProjectGrade'] = v

        if(record.price && record.num){
            if(record.feeProjectGrade === '1'){
                record.partSelfAmnt = 0
                record.selfAmnt = 0
            }else if(record.feeProjectGrade === '2'){
                let ylRatio = record.ylRatio ? Number(record.ylRatio) : 0.1;
                record.partSelfAmnt = Number((record.price * record.num * ylRatio).toFixed(2))
                record.selfAmnt = 0
            }else if(record.feeProjectGrade === '3'){
                record.partSelfAmnt = 0
                record.selfAmnt = Number((record.price * record.num).toFixed(2))
            }
        }
        if(record.feeProjectGrade === '1' || record.feeProjectGrade === '3'){
            record.ylRatio = 0
        }

        this.setState({
            record
        })
        this.props.onChange(record, record.key)
    }
    changeInput = (key, value) => {
        if(key === 'selfAmnt'){
            let reg = /^(\d-)*(\d+)\.(\d\d).*$/
            value = !isNaN(Number(value.target.value)) ? value.target.value.replace(reg, '$1$2.$3') : ''
        }
        let record = Object.assign({}, this.state.record)
        record[key] = value
        record.money = 0
        if(record.price && record.num){
            record.money = Number((record.price * record.num).toFixed(2))
        }
        if(key === 'price' || key === 'num' || key === 'ylRatio'){
            if(record.price && record.num){
                if(record.feeProjectGrade === '1'){
                    record.partSelfAmnt = 0
                    record.selfAmnt = 0
                }else if(record.feeProjectGrade === '2'){
                    let ylRatio = record.ylRatio ? Number(record.ylRatio) : 0.1;
                    record.partSelfAmnt = Number((record.price * record.num * ylRatio).toFixed(2))
                    record.selfAmnt = 0
                }else if(record.feeProjectGrade === '3'){
                    record.partSelfAmnt = 0
                    record.selfAmnt = Number((record.price * record.num).toFixed(2))
                }
            }
        }
        if(Number(record.partSelfAmnt) + Number(record.selfAmnt) > record.money) {
            message.error('乙类自理加上自费金额不能大于处方金额')
            return
        }
        this.setState({
            record
        })
        this.props.onChange(record, record.key)
    }
    del = () => {
        this.props.onDel(this.state.record)
    }
    clickEnter = () => {
        this.props.onEnter()
    }
}
PrescriptionInput = Form.create()(PrescriptionInput)
export default PrescriptionInput;