import React, {Component} from 'react'
import { Input, Spin, Modal, Icon, Tooltip, Pagination, message, Table, Form, Select, Button } from 'antd';
import http from '@/utils/http';
import utils from '@/utils/index'

let timer;
class ItemSelect extends Component {
    constructor(props){
        super(props)
        this.state = {
            label: '',
            valueName: '',
            valueCode: '',
            url: '',
            size: '',
            itemName: undefined,

            searchValue: '',
            list: [],
            isQuery: false,
            visible: false,
            current: 1,
            totalPages: 0,

            modalSearchValue: '',
            modalList: [],
            isLoading: false,
            modalVisible: false,
            modalTotal: 0,
            modalCurrent: 1,

            pinyinCode: '',
            itemKind: '',
            itemTypeYb: '',

            itemTypeYbs: [],
            itemKinds: []
        }
    }
    componentDidMount(){
        this.setState({
            itemName: this.props.value ? this.props.value.label : undefined,
            label: this.props.label,
            valueName: this.props.valueName,
            valueCode: this.props.valueCode,
            url: this.props.url,
            size: this.props.size
        })
        if(this.props.valueName === 'projectName'){
            this.setState({
                itemName: this.props.value
            })
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        this.setState({
            itemName: nextProps.value ? nextProps.value.label : undefined,
            label: nextProps.label,
            valueName: nextProps.valueName,
            valueCode: this.props.valueCode,
            url: nextProps.url,
            size: nextProps.size
        })
        if(nextProps.valueName === 'projectName'){
            this.setState({
                itemName: nextProps.value
            })
        }
    }
    render(){
        return (
            <div className="search-fix-modal">
                <Input
                    placeholder={`请选择${ this.state.label }`}
                    readOnly
                    // onClick={ this.show }
                    size={ this.state.size ? this.state.size : 'default' }
                    value={ this.state.itemName }
                    // style={{ cursor: 'pointer'}}
                    // onChange={ this.onSearch }
                    suffix={ <Icon type="search" id={ this.props.id } onClick={ this.show } />}
                    // onFocus={ this.onFocus }
                    // onBlur={ this.onBlur }
                />
                <ul style={{ display: this.state.visible ? 'block' : 'none' }} onScrollCapture={ () => this.onScrollEvent() } ref={c => (this.container = c)}>
                    {
                        this.state.list.length === 0 && !this.state.isQuery ?
                        <span>暂无数据</span> :
                        this.state.list.map((item, index) => (
                            <li key={ index } onClick={ this.choose.bind(this, item) }>
                                { this.state.valueName === 'projectName' &&
                                    <span>
                                        { item.feeProjectGrade === '1' && '(甲类) ' }
                                        { item.feeProjectGrade === '2' && '(乙类) ' }
                                        { item.feeProjectGrade === '3' && '(丙类) ' }
                                    </span>
                                }
                                { item[this.state.valueName] }
                                { this.state.valueName === 'projectName' &&
                                    <span>
                                    { `(${item.itemTypeYbName}) (${item.ylRatio})` }
                                    </span>
                                }                 
                            </li>
                        ))
                    }
                    {
                        this.state.isQuery ? <div style={{ paddingLeft: 10 }}><Spin size="small" /></div> : ''
                    }
                </ul>

                <Modal
                    visible={ this.state.modalVisible }
                    title={ `选择${this.state.label }`}
                    width={ this.state.valueName === 'projectName' ? '90%' : '640px' }
                    centered
                    onCancel={ this.cancel }
                    footer={ false }
                >
                    {
                        this.state.valueName === 'projectName' ?
                        this.renderProjectModal() :
                        <React.Fragment>
                            <Input.Search id={ this.props.id + 'Input'} placeholder="请输入关键字" value={ this.state.modalSearchValue } enterButton onSearch={ this.modalSearch } onChange={ this.changeSearch } />
                            <Spin spinning={ this.state.isLoading }>
                                <ul className="item-list" id={ this.props.id + '_itemList' }>
                                    {
                                        this.state.modalList.length === 0 && !this.state.isLoading &&
                                        <div style={{ textAlign: 'center', padding: 30, color: '#999' }}>暂无数据</div>
                                    }
                                    {
                                        this.state.modalList.map((item, index) => (
                                            <li
                                                key={ index }
                                                className={ this.state.itemName === item[this.state.valueName] ? 'active' : ''}
                                                onClick={ this.ModalChoose.bind(this, item) }
                                            >
                                                <span>
                                                    { item[this.state.valueName] }
                                                </span>
                                                { this.state.itemName === item[this.state.valueName] && <Icon type="check" /> }
                                            </li>
                                        ))
                                    }
                                </ul>
                            </Spin>
                            {
                                this.state.modalTotal > 0 &&
                                <Pagination
                                    size="small"
                                    current={ this.state.modalCurrent }
                                    total={ this.state.modalTotal }
                                    onChange={ this.getModalList }
                                    style={{ textAlign: 'center', marginTop: 10 }}
                                />
                            }
                        </React.Fragment>
                    }
                </Modal>
            </div>
        )
    }
    onSearch = e => {
        let v = e.target.value;
        this.setState({
            itemName: v
        })
        clearTimeout(timer)
        if(!v){
            return
        }

        if(!sessionStorage.getItem('insuredCityCode')){
            message.error('请选择参保所在地市')
            return
        }

        timer = setTimeout(() => {
            this.setState({
                visible: true,
                searchValue: v,
                list: [],
                current: 1
            }, () => {
                this.getList()
            })
        }, 1000)
    }
    getList = () => {
        this.setState({
            isQuery: true
        })
        let data = {
            currentPage: this.state.current,
            pageSize: 20
        }
        data[this.state.valueName] = this.state.searchValue;
        if(this.state.valueName === 'projectName'){
            data['controlAreaCode'] = sessionStorage.getItem('insuredCityCode')
        }

        http.post(this.state.url, data).then(res => {
            let list = this.state.list
            res.content.forEach(item => {
                list.push(item)
            })
            this.setState({
                list,
                totalPages: res.totalPages,
                isQuery: false
            })
        })
    }
    onFocus = () => {
        this.setState({
            visible: this.state.list.length > 0 ? true : false
        })
    }
    onBlur = () => {
        setTimeout(() => {
            this.setState({
                visible: false
            })
        }, 100)
    }
    onScrollEvent = e => {
        let scrollTop = this.container.scrollTop
        let height = this.container.clientHeight
        let scrollHeight = this.container.scrollHeight
        if(this.state.current === this.state.totalPages || this.state.current === 2){
            return
        }
        if(scrollTop + height === scrollHeight && !this.state.isQuery){
            this.setState({
                current: this.state.current + 1
            }, () => {
                this.getList()
            })
        }
    }
    choose = item => {
        this.setState({
            itemName: item[this.state.valueName],
            list: []
        })
        console.log(item[this.state.valueName])

        if(this.state.valueName === 'projectName'){
            this.props.onChange(item)
        }else{
            this.props.onChange({
                label: item[this.state.valueName],
                key: item[this.state.valueCode]
            })
        }
    }

    // 项目类型
    renderProjectModal() {
        const coulmns = [
            { title: '项目名称', dataIndex: 'projectName', align: 'center'},
            { title: '项目种类', dataIndex: 'itemKindName', align: 'center'},
            { title: '项目等级', dataIndex: 'feeProjectGrade', align: 'center',
                render: text => (
                    <span>
                        { text === '1' && '甲类' }
                        { text === '2' && '乙类' }
                        { text === '3' && '丙类' }
                    </span>
                )
            },
            { title: '收费类别', dataIndex: 'itemTypeYbName', align: 'center'},
            { title: '自理比例', dataIndex: 'ylRatio', align: 'center' },
			{ title: '操作', dataIndex: 'action', align: 'center', width: 60,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="选择" onClick={this.ModalChoose.bind(this, record)}>
                            <span id="$choosePrescription"><Icon type="check" /></span>
                        </Tooltip>
                    </div>
                )
            }
        ]
        let pagination = {
            total: this.state.modalTotal,
            current: this.state.modalCurrent,
            showTotal: total => `共 ${total} 项`,
            pageSize: 8,
            onChange: current=> {
                this.getModalList(current)
            }
        }
        const props = {
            rowKey: 'id',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.modalList,
            loading: this.state.isLoading,
            pagination,
            onRow: record => {
                return {
                    onDoubleClick: () => {
                        this.ModalChoose(record)
                    }
                }
            }
        }
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <Form layout="inline" style={{ marginBottom: 10 }}>
                    <Form.Item label="项目名称">
                        {getFieldDecorator('projectName')(
                            <Input placeholder="请输入项目名称" autoComplete="off" onPressEnter={ this.querySearch } />
                        )}
                    </Form.Item>
                    <Form.Item label="拼音码 (模糊)">
                        {getFieldDecorator('pinyinCode')(
                            <Input placeholder="请输入拼音码" autoComplete="off" onPressEnter={ this.querySearch } />
                        )}
                    </Form.Item>
                    <Form.Item label="项目种类">
                        {getFieldDecorator('itemKind')(
                            <Select placeholder="请选择项目种类" allowClear style={{ width: 150 }}>
                            {
                                this.state.itemKinds.map(item => (
                                    <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                                ))
                            }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="收费类别">
                        {getFieldDecorator('itemTypeYb')(
                            <Select placeholder="请选择收费类别" allowClear style={{ width: 150 }}>
                            {
                                this.state.itemTypeYbs.map(item => (
                                    <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option>
                                ))
                            }
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={ this.querySearch }>查询</Button>
                        <Button onClick={ this.searchReset } style={{ marginLeft: 10 }}>重置</Button>
                    </Form.Item>
                </Form>
                <Table bordered className="list-table" {...props} />
            </div>
        )
    }

    show = () => {
        if(this.props.valueName === 'projectName'){
            if(!sessionStorage.getItem('insuredCityCode')){
                message.error('请选择参保所在地市')
                return
            }
            utils.getCodeList(['item_type_yb', 'item_kind'], res => {
                this.setState({
                    itemTypeYbs: res[0].value,
                    itemKinds: res[1].value
                })
            })
        }
        
        this.setState({
            modalVisible: true,
            modalSearchValue: '',
            modalList: [],
            modalCurrent: 1
        }, () => {
            this.getModalList(1)
        })
    }
    
    changeSearch = e => {
        this.setState({
            modalSearchValue: e.target.value 
        })
    }
    modalSearch = v => {
        if(!v){
            return
        }
        this.setState({
            modalSearchValue: v,
            modalList: [],
            modalCurrent: 1
        }, () => {
            this.getModalList(1)
        })
    }
    getModalList = current => {
        this.setState({
            isLoading: true,
            modalCurrent: current
        })
        let data = {
            currentPage: current,
            pageSize: 8
        }
        data[this.state.valueName] = this.state.modalSearchValue;

        let url = this.state.url
        if(this.state.valueName === 'projectName'){
            url = '/rs/api/claim/querySiCatalog/findSiCatalogByContionNew';
            data['controlAreaCode'] = sessionStorage.getItem('insuredCityCode')
            data['pinyinCode'] = this.state.pinyinCode
            data['itemKind'] = this.state.itemKind
            data['itemTypeYb'] = this.state.itemTypeYb
        }

        http.post(url, data).then(res => {
            this.setState({
                modalList: res.content,
                modalTotal: res.totalElements,
                isLoading: false
            })
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    ModalChoose = item => {
        this.setState({
            itemName: item[this.state.valueName],
            modalVisible: false
        })
        console.log(item[this.state.valueName])

        if(this.state.valueName === 'projectName'){
            this.props.onChange(item)
        }else{
            this.props.onChange({
                label: item[this.state.valueName],
                key: item[this.state.valueCode]
            })
        }
    }

    querySearch = e => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            this.setState({
                modalSearchValue: values.projectName,
                pinyinCode: values.pinyinCode,
                itemKind: values.itemKind,
                itemTypeYb: values.itemTypeYb
            }, () => {
                this.getModalList(1)
            })
        })
    }
    searchReset = () => {
        this.props.form.resetFields()
        this.setState({
            modalSearchValue: undefined,
            pinyinCode: undefined,
            itemKind: undefined,
            itemTypeYb: undefined
        }, () => {
            this.getModalList(1)
        })
    }
}

ItemSelect = Form.create()(ItemSelect)
export default ItemSelect;