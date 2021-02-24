import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Table, Icon, Tooltip, Modal, Tabs, Form, Select, message } from 'antd';

import moment from 'moment'
import http from '@/utils/http'
import utils from '@/utils'
import icon1 from '@/project-rs/assets/images/icon/icon-bdxx.png';

import FormSearch from './FormSearch'
import CaseDetail from './CaseDetail'
import BankInput from './BankInput'
// import EnclosureManage from './EnclosureManage'

import EnclosureManageOther from './other/EnclosureManage'

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

const { TabPane } = Tabs

//1011001 团体补充医疗-门急诊医疗费用
//1011002 团体补充医疗-住院医疗费用
const OTHERCODES = ['1011001', '1011002']

class index extends Component {
    constructor(props){
        super(props)
        this.state = {
            conHeight: '',
            disposeState: '1',

            searchData: {},
            currentPage: 1,
            pageSize: 10,
            isLoading: false,
            listObj: {},

            curInsuranceCode: '',

            visible: false,
            caseId: '',

            bankVisible: false,
            policyId: '',

            enclosureVisible: false,
            reportNo: '',

            insuranceCode: '',
            caseDetailVisible: false,
            tabKey: '0',
            caseDetail: {},

            reasonVisible: false,
            cancelReason: undefined,
            reportCancelReasons: []
        }
    }
    componentDidMount(){
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 100
        })
        this.getList(1)

        utils.getCodeList(['report_cancel_reason'], res => {
            this.setState({
                reportCancelReasons: res[0].value
            })
        })
    }
    render(){
        return (
            <div className="content">
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/home">首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>业务操作</Breadcrumb.Item>
                    <Breadcrumb.Item>案件受理</Breadcrumb.Item>
                </Breadcrumb>
                <div className="card">
                    <div className="card-title">
                        <div className="title">
                            <img src={ icon1 } alt=""/>
                            <span>保单信息</span>
                        </div>
                    </div>
                    <div className="card-body">
                        <FormSearch query={ this.querySearch } />
                        <Tabs type="card" defaultActiveKey="1" onChange={ this.changeTab }>
                            <TabPane tab="未处理" key="1"></TabPane>
                            <TabPane tab="已处理" key="3"></TabPane>
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
                    <div className="modal-detail-content" style={{ height: this.state.conHeight }}>
                        <CaseDetail id={ this.state.caseId } />
                    </div>
                </Modal>
                <Modal
                    className="modal-detail"
                    title="银行信息录入"
                    width="600px"
                    centered
                    visible={ this.state.bankVisible }
                    onCancel={ this.closeBank }
                    footer={ null }
                    style={{ position: 'absolute', left: 20, top: 20 }}
                >
                    <div className="modal-detail-content">
                        <BankInput policyId={ this.state.policyId } caseId={ this.state.caseId } disposeState={ this.state.disposeState } onClose={ this.closeBank } />
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
                        {/* {
                            OTHERCODES.indexOf(this.state.curInsuranceCode) !== -1 &&
                            <EnclosureManageOther id={ this.state.caseId } reportNo={ this.state.reportNo } onClose={ this.closeEnclosure } />
                        } */}
                        {/* {
                            this.state.curInsuranceCode !== '' && OTHERCODES.indexOf(this.state.curInsuranceCode) === -1 &&
                            <EnclosureManage id={ this.state.caseId } onClose={ this.closeEnclosure } />
                        } */}

                        <EnclosureManageOther id={ this.state.caseId } reportNo={ this.state.reportNo } onClose={ this.closeEnclosure } />
                    </div>
                </Modal>
                <Modal
                    title="注销原因"
                    width="400px"
                    visible={ this.state.reasonVisible }
                    onOk={ this.queryOff }
                    onCancel={ this.closeReason }
                >
                    <Form.Item>
                        <Select value={ this.state.cancelReason } placeholder="请选择注销原因" onChange={ this.changeReason } style={{ width: '100%' }}>
                        {
                            this.state.reportCancelReasons.map(item => (
                                <Select.Option key={ item.codeValue } value={ item.codeValue }>{ item.codeName }</Select.Option> 
                            ))
                        }
                        </Select>
                    </Form.Item>
                </Modal>
                { this.renderDetailModal() }
            </div>
        )
    }
    renderList(){
        const coulmns = [
            { title: '个人保单号', dataIndex: 'policyNo', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '案件号', dataIndex: 'reportNo', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '被保险人姓名', dataIndex: 'insuredName', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '报案人姓名', dataIndex: 'applyName', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '报案人电话', dataIndex: 'applyTelephone', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '报案时间', dataIndex: 'acceptDate', align: 'center',
                render: (text, record) => <p><span  style={{ color: record.color }}>{ text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '' }</span></p>
            },
            { title: '案件状态', dataIndex: 'caseStateName', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '有效标志', dataIndex: 'cancelFlagName', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text }</span></p>
            },
            { title: '出险日期', dataIndex: 'accidentDate', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text ? moment(text).format('YYYY-MM-DD') : '' }</span></p>
            },
            { title: '是否存在未处理的问题件', dataIndex: 'isProblemItems', align: 'center', width: 100,
                render: (text, record) => <p><span style={{ color: record.color }}>{ text === '1' && '是' }{ text === '0' && '否' }</span></p>
            },
            { title: '是否六地市', dataIndex: 'isSix', align: 'center',
                render: (text, record) => <p><span style={{ color: record.color }}>{ text === '1' && '是' }{ text === '0' && '否' }</span></p>
            },
            { title: '操作', key: 'action', align: 'center', width: 80,
                render: (text, record) => (
                    <div className="list-actions">
                        {
                            this.state.disposeState === '1' ?
                            <Tooltip title="案件详情" onClick={this.showCasedetail.bind(this, record)}>
                                <span><Icon type="file-protect" /></span>
                            </Tooltip> :
                            <Tooltip title="银行信息录入" onClick={this.bankInfo.bind(this, record)}>
                                {
                                    this.state.disposeState === '3' ?
                                    <span id="$button_BankInput"><Icon type="bank" /></span>
                                    : ''
                                }
                                {
                                    this.state.disposeState !== '3' ?
                                    <span id="$button_BankInput" style={{ color: record.isBankCode === '2' && !this.state.isLoading ? '#f00' : '' }}><Icon type="bank" /></span>
                                    : ''
                                }
                            </Tooltip>
                        }
                        <Tooltip title="附件管理" onClick={this.showEnclosure.bind(this, record)}>
                            <span id="$button_attachment"><Icon type="paper-clip" /></span>
                        </Tooltip>
                        {
                            this.state.disposeState === '1' &&
                            <Tooltip title="注销" onClick={this.logOff.bind(this, record)}>
                                <span><Icon type="stop" /></span>
                            </Tooltip>
                        }
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
            pagination: pagination
        }
        return(
            <Table bordered className="list-table" {...props} />
        )
    }
    changeTab = t => {
        this.setState({
            disposeState: t,
            isLoading: true
        }, () => {
            this.getList(1)
        })
    }
    querySearch = v => {
        this.setState({
            searchData: v
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
        data.updateClosePayFlag = '1'
        let url = ''
        if(this.state.disposeState === '1'){
            url = '/rs/api/claim/queryCaseInfo/findCaseByConditionForNoDeal'
        }else if(this.state.disposeState === '2'){
            url = '/rs/api/claim/queryCaseInfo/findCaseByConditionForDealing'
        }else if(this.state.disposeState === '3'){
            url = '/rs/api/claim/queryCaseInfo/findCaseByConditionForDealed'
        }
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
        if(document.querySelector('.modal-detail-content')){
            document.querySelector('.modal-detail-content').scrollTop = 0
        }
        this.setState({
            visible: false,
            caseId: ''
        })
    }

    receiveCaseTask = (id, callback) => {
        if(this.state.disposeState === '1'){
            let data = {
                indemnityCaseId: id,
                nodeCode: '03' // 认领
            }
            http.post('/rs/api/claim/caseinfo/receiveCaseTask', data, { isLoading: true }).then(res => {
                this.getList(1)
                callback()
            })
        }else{
            callback()
        }
    }

    bankInfo = record => {
        this.setState({
            bankVisible: true,
            policyId: record.policyId,
            caseId: record.id
        })
    }
    closeBank = flag => {
        this.setState({
            bankVisible: false,
            policyId: ''
        })
        if(flag === 'suc'){
            this.getList(1)
        }
    }
    
    showEnclosure = record => {
        this.setState({
            enclosureVisible: true,
            caseId: record.id,
            reportNo: record.reportNo,
            curInsuranceCode: record.insuranceCode
        })
    }
    closeEnclosure = () => {
        this.setState({
            enclosureVisible: false,
            caseId: '',
            reportNo: '',
            curInsuranceCode: ''
        })
    }

    renderDetailModal(){
        const TabPane = Tabs.TabPane;
        return (
            <Modal
                className="modal-detail"
                title="案件详情"
                width="90%"
                centered
                visible={ this.state.caseDetailVisible }
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
            caseDetailVisible: true,
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
            caseDetailVisible: false,
            policyId: '',
            caseDetail: {}
        })
    }

    changeReason = v => {
        this.setState({
            cancelReason: v
        })
    }
    
    logOff = record => {
        this.setState({
            reasonVisible: true,
            cancelReason: undefined,
            caseId: record.id
        })
    }
    queryOff = () => {
        if(!this.state.cancelReason){
            message.error('请选择注销原因')
            return
        }
        let data = {
            id: this.state.caseId,
            reportCancelReason: this.state.cancelReason
        }
        http.post('/rs/api/claim/caseinfo/deleteCase', data, { isLoading: true }).then(res => {
            message.success('报案注销成功')
            this.closeReason()
            this.getList(1)
        })
    }
    closeReason = () => {
        this.setState({
            reasonVisible: false,
            caseId: ''
        })
    }
    
}
export default index