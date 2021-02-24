import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Table, Icon, Tooltip, Modal, Tabs, message } from 'antd';
import http from '@/utils/http'
import moment from 'moment'
import icon1 from '@/project-rs/assets/images/icon/icon-ajxx.png';

import FormSearch from './FormSearch'
import CaseDetail from './CaseDetail'
import EnclosureManage from './EnclosureManage'

const { TabPane } = Tabs
class index extends Component {
    constructor(props){
        super(props)
        this.state = {
            type: '1',
            searchData: {},
            currentPage: 1,
            pageSize: 10,
            isLoading: false,
            listObj: {},

            visible: false,
            caseId: '',
            enclosureVisible: false,
            reportNo: '',
            caseState: ''
        }
    }
    componentDidMount(){
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 120
        })
        this.getList(1)
    }
    render(){
        return (
            <div className="content">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/home">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>业务操作</Breadcrumb.Item>
                    <Breadcrumb.Item>影像件管理</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                    <div className="card-title">
                        <p className="title">
                            <img src={ icon1 } alt=""/><span>影像件管理</span>
                        </p>
                    </div>
                    <div className="card-body">
                        <FormSearch query={ this.querySearch } />
                        <Tabs type="card" activeKey={ this.state.type } onChange={ this.changeTab }>
                            <TabPane tab="未处理" key="1"></TabPane>
                            <TabPane tab="已处理" key="2"></TabPane>
                        </Tabs>
                        { this.renderList() }
                    </div>
                </div>
                <Modal
                    className="modal-detail"
                    title="案件详情"
                    width="80%"
                    centered
                    visible={ this.state.visible }
                    onCancel={ this.closeDetail }
                    footer={ null }
                >
                    <div className="modal-detail-content" style={{ maxHeight: this.state.conHeight }}>
                        <CaseDetail id={ this.state.caseId } />
                    </div>
                </Modal>
                <Modal
                    className="modal-detail"
                    title="附件管理"
                    width="1000px"
                    centered
                    visible={ this.state.enclosureVisible }
                    onCancel={ this.closeEnclosure }
                    footer={ null }
                >
                    <div className="modal-detail-content" style={{ height: this.state.conHeight }}>
                        <EnclosureManage id={ this.state.caseId } reportNo={ this.state.reportNo } onClose={ this.closeEnclosure } caseState={ this.state.caseState } />
                    </div>
                </Modal>
            </div>
        )
    }
    changeTab = v => {
        this.setState({
            type: v,
            listObj: {},
            currentPage: 1
        }, () => {
            this.getList(1)
        })
    }
    renderList(){
        const coulmns = [
            { title: '个人保单号', dataIndex: 'policyNo', align: 'center'},
            { title: '报案号', dataIndex: 'reportNo', align: 'center' },
            { title: '被保险人姓名', dataIndex: 'insuredName', align: 'center' },
            { title: '报案人姓名', dataIndex: 'applyName', align: 'center' },
            { title: '报案人电话', dataIndex: 'applyTelephone', align: 'center' },
            { title: '报案时间', dataIndex: 'acceptDate', align: 'center',
                render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
            },
            { title: '案件状态', dataIndex: 'caseStateName', align: 'center' },
            { title: '出险日期', dataIndex: 'accidentDate', align: 'center',
                render: text => text ? moment(text).format('YYYY-MM-DD') : ''
            },
            { title: '出险地点', dataIndex: 'damageAddress', align: 'center' },
            { title: '操作', key: 'action', align: 'center', width: 80,
                render: (text, record) => (
                    this.state.type === '1' ?
                    <div className="list-actions">
                        <Tooltip title="查看详情" onClick={this.detail.bind(this, record.id)}>
                            <span><Icon type="profile" /></span>
                        </Tooltip>
                        <Tooltip title="认领" onClick={this.claim.bind(this, record)}>
                            <span><Icon type="check-circle" /></span>
                        </Tooltip>
                    </div> :
                    <div className="list-actions">
                        <Tooltip title="查看详情" onClick={this.detail.bind(this, record.id)}>
                            <span><Icon type="profile" /></span>
                        </Tooltip>
                        <Tooltip title="附件管理" onClick={this.showEnclosure.bind(this, record)}>
                            <span><Icon type="paper-clip" /></span>
                        </Tooltip>
                        <Tooltip title="放弃" onClick={this.giveup.bind(this, record)}>
                            <span><Icon type="stop" /></span>
                        </Tooltip>
                    </div>
                )
            }
        ]
        let pagination = {
            total: this.state.listObj.totalElements,
            current: this.state.currentPage,
            showTotal: total => `共 ${total} 项`,
            pageSize: this.state.pageSize,
            onChange: current => {
                this.getList(current)
            }
        }
        const props = {
            rowKey: 'id',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.listObj.content,
            loading: this.state.isLoading,
            pagination: pagination
        }
        return(
            <Table bordered className="list-table" {...props} />
        )
    }
    querySearch = data => {
        if(data === 'add'){
            this.add()
            return
        }
        this.setState({
            searchData: data
        }, () => {
            this.getList(1)
        })
    }
    
    getList = current => {
        this.setState({
            currentPage: current,
            isLoading: true
        })
        let data = this.state.searchData
        data.currentPage = current
        data.pageSize = this.state.pageSize
        data.permissionFlag = '1'
        data.productCode = 'HJ-BWYL-T' //产品编码  表示军yue保

        let url = this.state.type === '1' ? '/rs/api/claim/queryCaseInfo/findCaseByConditionImageManagerForNoDeal' : '/rs/api/claim/queryCaseInfo/findCaseByConditionImageManagerForDealed'
        
        http.post(url, data).then(res => {
            this.setState({
                listObj: res,
                isLoading: false
            })
        })
    }
    detail = id => {
        this.setState({
            visible: true,
            caseId: id
        })
    }
    closeDetail = () => {
        this.setState({
            visible: false,
            caseId: ''
        })
    }
    showEnclosure = record => {
        this.setState({
            enclosureVisible: true,
            caseId: record.id,
            reportNo: record.reportNo,
            caseState: record.caseState
        })
    }
    closeEnclosure = () => {
        this.setState({
            enclosureVisible: false,
            caseId: '',
            reportNo: '',
            caseState: ''
        })
    }
    claim = record => {
        Modal.confirm({
            title: '提示',
            content: '确定认领吗？',
            onOk: () => {
                http.post('/rs/api/claim/imagemanager/receiveCaseTask', { id: record.id }, { isLoading: true }).then(res =>{
                    message.success('认领成功！')
                    this.getList(1)
                })
            }
        })
    }
    giveup = record => {
        Modal.confirm({
            title: '提示',
            content: '确定放弃吗？',
            onOk: () => {
                http.post('/rs/api/claim/imagemanager/giveUpCaseTask', { id: record.id }, { isLoading: true }).then(res =>{
                    message.success('放弃成功！')
                    this.getList(1)
                })
            }
        })
    }
}
export default index