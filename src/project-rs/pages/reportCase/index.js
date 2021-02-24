import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Table, Icon, Tooltip, Modal } from 'antd';
import http from '@/utils/http'
import moment from 'moment'
import icon1 from '@/project-rs/assets/images/icon/icon-ajxx.png';

import FormSearch from './FormSearch'
import CaseAdd from './CaseAdd'
import CaseDetail from './CaseDetail'
import CaseProgress from './CaseProgress'

class index extends Component {
    constructor(props){
        super(props)
        this.state = {
            searchData: {},
            currentPage: 1,
            pageSize: 10,
            isLoading: false,
            listObj: {},

            visible: false,
            caseId: '',
            progressVisible: false,

            addVisible: false
        }
    }
    componentDidMount(){
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 150
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
                    <Breadcrumb.Item>报案</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                    <div className="card-title">
                        <p className="title">
                            <img src={ icon1 } alt=""/><span>报案信息</span>
                        </p>
                    </div>
                    <div className="card-body">
                        <FormSearch query={ this.querySearch } />
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
                    title="案件流程"
                    width="600px"
                    centered
                    visible={ this.state.progressVisible }
                    onCancel={ this.closeProgress }
                    footer={ null }
                >
                    <div className="modal-detail-content" style={{ maxHeight: this.state.conHeight }}>
                        <CaseProgress id={ this.state.caseId } />
                    </div>
                </Modal>
                <Modal
                    className="modal-detail"
                    title="录入报案"
                    width="80%"
                    centered
                    visible={ this.state.addVisible }
                    onCancel={ this.closeAdd }
                    footer={ null }
                >
                    <div className="modal-detail-content" style={{ height: this.state.conHeight }}>
                        <CaseAdd visible={ this.state.addVisible } result={ this.closeAdd } />
                    </div>
                </Modal>
            </div>
        )
    }
    renderList(){
        const coulmns = [
            { title: '个人保单号', dataIndex: 'policyNo', align: 'center'},
            { title: '被保险人姓名', dataIndex: 'insuredName', align: 'center' },
            { title: '报案人姓名', dataIndex: 'applyName', align: 'center' },
            { title: '报案人电话', dataIndex: 'applyTelephone', align: 'center' },
            { title: '报案时间', dataIndex: 'acceptDate', align: 'center',
                render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
            },
            { title: '案件状态', dataIndex: 'caseStateName', align: 'center' },
            { title: '有效标志', dataIndex: 'cancelFlagName', align: 'center' },
            { title: '出险日期', dataIndex: 'accidentDate', align: 'center',
                render: text => text ? moment(text).format('YYYY-MM-DD') : ''
            },
            { title: '操作', key: 'action', align: 'center', width: 60,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="查看详情" onClick={this.detail.bind(this, record.id)}>
                            <span><Icon type="profile" /></span>
                        </Tooltip>
                        <Tooltip title="查看流程图" onClick={this.progress.bind(this, record.id)}>
                            <span><Icon type="pull-request" /></span>
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

        http.post('/rs/api/claim/reportCase/list', data).then(res => {
            this.setState({
                listObj: res,
                isLoading: false
            })
        })
    }
    add = () => {
        this.setState({
            addVisible: true
        })
    }
    closeAdd = flag => {
        this.setState({
            addVisible: false
        })
        if(flag === 'suc'){
            this.getList(1)
        }
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
    progress = id => {
        this.setState({
            progressVisible: true,
            caseId: id
        })
    }
    closeProgress = () => {
        this.setState({
            progressVisible: false,
            caseId: ''
        })
    }
}
export default index