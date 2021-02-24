import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Table, Icon, Timeline, Spin, Tooltip, Modal } from 'antd';
import http from '@/utils/http'

import icon1 from '@/project-rs/assets/images/icon/icon-bdxx.png';

import FormSearch from './FormSearch'
import InsurancePolicyDetail from '@/project-rs/assets/component/InsurancePolicyDetail'

class index extends Component {
    constructor(props){
        super(props)
        this.state = {
            searchData: {},
            currentPage: 1,
            pageSize: 10,
            isLoading: false,
            listObj: {},

            changeRecordList: [],
            expandedRowKeys: [],
            expandLoading: false,

            visible: false,
            detailId: '',
            conHeight: ''
        }
    }
    componentDidMount(){
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 100
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
                    <Breadcrumb.Item>保全信息查询</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                    <div className="card-title">
                        <p className="title">
                            <img src={ icon1 } alt=""/><span>保单信息</span>
                        </p>
                    </div>
                    <div className="card-body">
                        <FormSearch query={ this.querySearch } />
                        { this.renderList() }
                    </div>
                </div>
                
                <Modal
                    className="modal-detail"
                    title="保单详情"
                    width="80%"
                    centered
                    visible={ this.state.visible }
                    onCancel={ this.closeDetail }
                    footer={ null }
                >
                    <div className="modal-detail-content" style={{ height: this.state.conHeight }}>
                        <InsurancePolicyDetail id={ this.state.detailId } />
                    </div>
                </Modal>
            </div>
        )
    }
    renderList(){
        const coulmns = [
            { title: '个人保单号', dataIndex: 'policyNo', align: 'center'},
            { title: '被保险人姓名', dataIndex: 'insuredName', align: 'center' },
            { title: '被保险人身份证号', dataIndex: 'idCode', align: 'center' },
            { title: '生效日期', dataIndex: 'startDate', align: 'center' },
            { title: '终止日期', dataIndex: 'endDate', align: 'center' },
            { title: '总人数', dataIndex: 'totalNumber', align: 'center' },
            { title: '保费', dataIndex: 'currentPremium', align: 'center' },
            { title: '保单状态', dataIndex: 'insurancePolicyStateName', align: 'center' },
            { title: '操作', key: 'action', align: 'center', width: 60,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="查看详情" onClick={this.detail.bind(this, record.id)}>
                            <span><Icon type="profile" /></span>
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
            onChange: current=> {
                this.getList(current)
            }
        }
        const logs = this.state.changeRecordList.map(d => 
            <Timeline.Item key={d.id}>
                [{d.changeDate}]   [{d.typeName}]   变更项:[{d.name}]   变更前[{d.beforeChangeContent}]→变更后[{d.afterChangeContent}]
            </Timeline.Item>
        )
        const props = {
            rowKey: 'id',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.listObj.content,
            loading: this.state.isLoading,
            pagination: pagination,
            expandedRowKeys: this.state.expandedRowKeys,
            expandedRowRender: () =>
                this.state.expandLoading ?
                <div style={{ height: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin /></div> :
                <Timeline>{ logs }</Timeline>
            ,
            onExpand: this.onExpand
        }
        return(
            <Table bordered className="list-table" {...props} />
        )
    }
    querySearch = data => {
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

        http.post('/rs/api/claim/basicPolicy/findPolicyByCondition', data).then(res => {
            this.setState({
                listObj: res,
                isLoading: false
            })
        })
    }
    onExpand = (expanded, row) => {
        this.setState({
            expandedRowKeys: expanded ? [ row.id ] : [],
            changeRecordList: []
        })
        if(expanded){
            this.getRecordList(row.id)
        }
    }
    getRecordList = id => {
        this.setState({
            expandLoading: true
        })
        let data = { id: id }
        http.post('/rs/api/claim/policyChange/findPolicyChangeRecordByCondition', data).then(res => {
            this.setState({
                changeRecordList: res.content,
                expandLoading: false
            })
        })
    }
    detail = id => {
        this.setState({
            visible: true,
            detailId: id
        })
    }
    closeDetail = () => {
        if(document.querySelector('.modal-detail-content')){
            document.querySelector('.modal-detail-content').scrollTop = 0
        }
        this.setState({
            visible: false,
            detailId: ''
        })
    }
}
export default index