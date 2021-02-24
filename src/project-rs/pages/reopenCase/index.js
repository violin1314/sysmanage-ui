import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Table, Icon, Tooltip, Tabs, Modal } from 'antd'
import moment from 'moment'
import http from '@/utils/http'
import icon from '@/project-rs/assets/images/icon/icon-dfsxxcx.png';

import FormSearch from './FormSearch'
import Reopen from './Reopen'
import Logoff from './Logoff'

import InsurancePolicyDetail from '@/project-rs/assets/component/InsurancePolicyDetail'
import AcceptInfo from '@/project-rs/assets/component/CaseInfo/acceptInfo'
import Attachments from '@/project-rs/assets/component/CaseInfo/attachments'
import FirstAudit from '@/project-rs/assets/component/CaseInfo/firstAudit'
import HistoryInvestigate from '@/project-rs/assets/component/CaseInfo/historyInvestigate'
import HistorySecondAudit from '@/project-rs/assets/component/CaseInfo/historySecondAudit'
import HistoryFinalAudit from '@/project-rs/assets/component/CaseInfo/historyFinalAudit'
import PolicyFee from '@/project-rs/assets/component/CaseInfo/policyFee'
import FeeList from '@/project-rs/assets/component/CaseInfo/feeList'
import CasePayeeInfo from '@/project-rs/assets/component/CaseInfo/casePayeeInfo'
import VisitInfo from '@/project-rs/assets/component/CaseInfo/visitInfo'

//1011001 团体补充医疗-门急诊医疗费用
//1011002 团体补充医疗-住院医疗费用
const OTHERCODES = ['1011001', '1011002']

class index extends Component {
    constructor(props){
        super(props)
        this.state = {
            conHeight: '',
            caseNum: 0,
            searchData: {},
            currentPage: 1,
            pageSize: 10,
            isLoading: false,
            listObj: {},

            selectedKeys: [],
            curPolicyId: '',
            caseList: [],
            caseLoading: false,

            visible: false,
            curCaseId: '',
            curId: '',
            curCase: {},
            applyType: '',
            offVisible: false,

            detailVisible: false,
            insuranceCode: '',
            tabKey: '0',
            caseDetail: {},
            policyId: ''
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
                    <Breadcrumb.Item>重开赔案</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                    <div className="card-title">
                        <div className="title">
                            <img src={ icon } alt="" />
                            <span>案件信息查询</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <FormSearch query={ this.querySearch } />
                        { this.renderList() }
                    </div>
                </div>
                <div className="card">
                    <div className="card-title">
                        <div className="title">
                            <img src={ icon } alt="" />
                            <span>重开赔案信息</span>
                        </div>
                    </div>
                    <div className="card-body">
                        { this.renderCaseList() }
                    </div>
                </div>
                <Reopen
                    visible={ this.state.visible }
                    caseId={ this.state.curCaseId }
                    id={ this.state.curId }
                    onClose={ this.close }
                />
                <Logoff
                    visible={ this.state.offVisible }
                    caseId={ this.state.curCase.id }
                    onClose={ this.closeOff }
                />
                { this.renderDetailModal() }
            </div>
        )
    }
    renderList(){
        const coulmns = [
            { title: '个人保单号', dataIndex: 'policyNo', align: 'center'},
            { title: '报案号', dataIndex: 'reportNo', align: 'center'},
            { title: '被保险人姓名', dataIndex: 'insuredName', align: 'center', width: '10%' },
            { title: '报案人姓名', dataIndex: 'applyName', align: 'center', width: '8%' },
            { title: '报案人电话', dataIndex: 'applyTelephone', align: 'center', width: '9%' },
            { title: '报案时间', dataIndex: 'acceptDate', align: 'center', width: '8%',
                render: text => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
            },
            { title: '案件状态', dataIndex: 'caseStateName', align: 'center', width: '8%' },
            { title: '有效标志', dataIndex: 'cancelFlagName', align: 'center', width: '8%' },
            { title: '出险日期', dataIndex: 'accidentDate', align: 'center', width: '8%',
                render: text => text ? moment(text).format('YYYY-MM-DD') : ''
            },
            { title: '操作', key: 'action', align: 'center', width: 80,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="案件详情" onClick={this.showCasedetail.bind(this, record)}>
                            <span><Icon type="profile" /></span>
                        </Tooltip>
                        <Tooltip title="申请重开赔案" onClick={this.reopen.bind(this, record, '1')}>
                            <span id="$button_reopen_case"><Icon type="audit" /></span>
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
        const props = {
            rowKey: 'id',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.listObj.content,
            loading: this.state.isLoading,
            pagination: pagination,
            rowSelection: {
                type: 'radio',
                selectedRowKeys: this.state.selectedKeys,
                onChange: (keys, rows) => {
                    this.setState({
                        selectedKeys: keys,
                        curPolicyId: keys[0]
                    }, () => {
                        this.getCaseInfo()
                    })
                }
            }
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
        data.caseStateList = ['40']
        data.permissionFlag = '1'

        http.post('/rs/api/claim/queryCaseInfo/findCaseByCondition', data).then(res => {
            this.setState({
                listObj: res,
                isLoading: false,
                curPolicyId: res.content.length > 0 ? res.content[0].id : '',
                selectedKeys: res.content.length > 0 ? [res.content[0].id] : []
            }, () => {
                this.getCaseInfo()
            })
        })
    }
    
    reopen = (item, type) => {
        let curCaseId = type === '1' ? item.id : item.indemnityCaseId
        let curId = type === '1' ? '' : item.id
        this.setState({
            visible: true,
            curCaseId,
            curId,
            applyType: type
        })
    }
    close = flag => {
        this.setState({
            visible: false,
            curCaseId: '',
            curId: ''
        })
        if(flag === 'suc'){
            if(this.state.applyType === '1'){
                this.getList(1)
            }else if(this.state.applyType === '2'){
                this.getCaseInfo()
            }
        }
    }

    getCaseInfo = () => {
        this.setState({
            caseLoading: true
        })
        http.post('/rs/api/claim/renewcaseinfo/findRenewCaseInfoByCaseInfoId', { id: this.state.curPolicyId }).then(res => {
            this.setState({
                caseList: res,
                caseLoading: false
            })
        })
    }
    renderCaseList(){
        const coulmns = [
            { title: '申请人', dataIndex: 'renewApplyOper', align: 'center' },
            { title: '申请时间', dataIndex: 'renewApplyDate', align: 'center',
                render: text => text ? moment(text).format('YYYY-MM-DD') : ''
            },
            { title: '审核人', dataIndex: 'renewCheckOper', align: 'center' },
            { title: '审核时间', dataIndex: 'renewCheckDate', align: 'center',
                render: text => text ? moment(text).format('YYYY-MM-DD') : ''
            },
            { title: '申请原因', dataIndex: 'renewApplyReason', align: 'center' },
            { title: '审核不通过原因', dataIndex: 'renewNoCheckReason', align: 'center' },
            { title: '操作', key: 'action', align: 'center', width: 80,
                render: (text, record) => (
                    <div className="list-actions">
                        <Tooltip title="申请" onClick={this.reopen.bind(this, record, '2')}>
                            <span><Icon type="form" /></span>
                        </Tooltip>
                        <Tooltip title="注销" onClick={this.logoff.bind(this, record)}>
                            <span><Icon type="poweroff" /></span>
                        </Tooltip>
                    </div>
                )
            }
        ]
        const props = {
            rowKey: 'id',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.caseList,
            loading: this.state.caseLoading
        }
        return(
            <Table bordered className="list-table" {...props} />
        )
    }
    logoff = item => {
        this.setState({
            offVisible: true,
            curCase: item
        })
    }
    closeOff = flag => {
        this.setState({
            offVisible: false,
            curCase: {}
        })
        if(flag === 'suc'){
            this.getCaseInfo()
        }
    }

    renderDetailModal(){
        const TabPane = Tabs.TabPane;
        return (
            <Modal
                className="modal-detail"
                title="案件详情"
                width="90%"
                centered
                visible={ this.state.detailVisible }
                onCancel={ this.closeCaseDetail }
                footer={ null }
            >
                <div className="modal-detail-content" id="detail" style={{ height: this.state.conHeight }}>
                    <Tabs activeKey={ this.state.tabKey } onChange={ this.tabChange } >
                        <TabPane tab="保单信息" key="0">
                            <InsurancePolicyDetail id={ this.state.policyId } />
                        </TabPane>
                        <TabPane tab="就诊信息" key="10">
                            <VisitInfo detail={ this.state.caseDetail.visitInfo ? this.state.caseDetail.visitInfo : {} } />
                        </TabPane>
                        <TabPane tab="理赔受理信息" key="1">
                            <AcceptInfo detail={ this.state.caseDetail.caseInfo ? this.state.caseDetail.caseInfo : {} } />
                        </TabPane>
                        <TabPane tab="影像信息" key="2">
                            <Attachments list={ this.state.caseDetail.caseAttachmentDs ? this.state.caseDetail.caseAttachmentDs : [] } />
                        </TabPane>
                        <TabPane tab="系统初审信息" key="3">
                            <FirstAudit detail={ this.state.caseDetail.caseSysFirstAuditInfoDs ? this.state.caseDetail.caseSysFirstAuditInfoDs : [] } />
                        </TabPane>
                        <TabPane tab="既往稽核" key="4">
                            <HistoryInvestigate list={ this.state.caseDetail.caseInvestigationInfoDs ? this.state.caseDetail.caseInvestigationInfoDs : [] } />
                        </TabPane>
                        <TabPane tab="既往复审" key="5">
                            <HistorySecondAudit list={ this.state.caseDetail.caseArtificialSecondAuditInfoDs ? this.state.caseDetail.caseArtificialSecondAuditInfoDs : [] } />
                        </TabPane>
                        <TabPane tab="既往系统终审" key="6">
                            <HistoryFinalAudit list={ this.state.caseDetail.caseFinalAuditingInfoEntityDs ? this.state.caseDetail.caseFinalAuditingInfoEntityDs : [] } />
                        </TabPane>
                        <TabPane tab="赔付信息" key="7">
                            <PolicyFee list={ this.state.caseDetail.policyfeeInfoDs ? this.state.caseDetail.policyfeeInfoDs : [] } />
                        </TabPane>
                        {
                            OTHERCODES.indexOf(this.state.insuranceCode) !== -1 &&
                            <TabPane tab="费用信息" key="8">
                                <FeeList list={ this.state.caseDetail.categoryDs ? this.state.caseDetail.categoryDs : [] } />
                            </TabPane>
                        }
                        <TabPane tab="案件领款人信息" key="9">
                            <CasePayeeInfo detail={ this.state.caseDetail.casePayeeInfoEntity ? this.state.caseDetail.casePayeeInfoEntity : {} } />
                        </TabPane>
                    </Tabs>
                </div>
            </Modal>
        )
    }
    tabChange = key => {
        this.setState({
            tabKey: key
        })
    }
    showCasedetail = record => {
        this.setState({
            detailVisible: true,
            policyId: record.policyId,
            tabKey: '0',
            caseDetail: {}
        })
        let data = {
            id: record.id,
            policyId: record.policyId,
            queryAttachmentFlag: true,
            queryFinalAuditFlag: true,
            queryInvestFlag: true,
            querySecondAuditFlag: true,
            querySysFirstAuditFlag: true,
            queryPolicyFeeFlag: true,
            queryFeeFlag: true,
            queryVisitFlag: true,
            queryCasePayeeFlag: true
        }

        http.post('/rs/api/claim/queryCaseInfo/findCaseInfoById', data, { isLoading: true }).then(res => {
            this.setState({
                caseDetail: res,
                insuranceCode: res.caseInfo.insuranceCode
            })
        })
    }
    closeCaseDetail = () => {
        this.setState({
            detailVisible: false,
            policyId: '',
            caseDetail: {}
        })
    }
}
export default index