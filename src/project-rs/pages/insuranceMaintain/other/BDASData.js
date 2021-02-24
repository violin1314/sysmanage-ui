import React, { Component } from 'react'
import { Modal, Form, Button, Table, DatePicker, message, Descriptions } from 'antd';
import http from '@/utils/http'
import moment from 'moment'

class BDASData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            caseId: '',
            policy: {},
            caseInfo: {},

            searchData: {},
            currentPage: 1,
            pageSize: 5,
            list: [],
            selectedKeys: [],
            selectedRows: []
        }
    }
    componentDidMount(){
        if(!this.props.visible){
            return
        }
        this.setState({
            visible: this.props.visible,
            caseId: this.props.caseId,
            caseInfo: this.props.caseInfo,
            policy: this.props.policy
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        if(!nextProps.visible || nextProps.visible === this.state.visible){
            return
        }
        this.setState({
            visible: nextProps.visible
        })
        this.props.form.resetFields()
        this.setState({
            caseId: nextProps.caseId,
            policy: nextProps.policy,
            caseInfo: nextProps.caseInfo,
            selectedKeys: [],
            selectedRows: []
        }, () => {
            this.getList()
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                className="modal-detail"
                title="生成数据"
                width="90%"
                centered
                visible={ this.state.visible }
                onOk={ this.queryBDAS }
                onCancel={ this.closeBDAS }
            >
                <div style={{ padding: 10, minHeight: 475 }}>
                    <Descriptions size="small" column={4} style={{ padding: '5px 10px 7px', marginBottom: 10, borderBottom: '1px solid #eee'}}>
                        <Descriptions.Item label="报案方式">
                            { this.state.caseInfo.reporterChannelName }
                        </Descriptions.Item>
                        <Descriptions.Item label="报案人姓名">
                            { this.state.caseInfo.applyName }
                        </Descriptions.Item>
                        <Descriptions.Item label="报案人电话">
                            { this.state.caseInfo.applyTelephone }
                        </Descriptions.Item>
                        <Descriptions.Item label="联系人姓名">
                            { this.state.caseInfo.contactName }
                        </Descriptions.Item>
                        <Descriptions.Item label="联系人电话">
                            { this.state.caseInfo.contactTel }
                        </Descriptions.Item>
                        <Descriptions.Item label="出险日期">
                            { this.state.caseInfo.accidentDate ? moment(this.state.caseInfo.accidentDate).format('YYYY-MM-DD') : '' }
                        </Descriptions.Item>
                        <Descriptions.Item label="出险地点">
                            { this.state.caseInfo.damageAddress }
                        </Descriptions.Item>
                        <Descriptions.Item label="出险原因">
                            { this.state.caseInfo.accidentReasonName }
                        </Descriptions.Item>
                        <Descriptions.Item label="出险经过">
                            { this.state.caseInfo.accidentDescribe }
                        </Descriptions.Item>
                        <Descriptions.Item label="报案医院">
                            { this.state.caseInfo.reportHospitalName }
                        </Descriptions.Item>
                        <Descriptions.Item label="报案疾病">
                            { this.state.caseInfo.reportDiseaseName }
                        </Descriptions.Item>
                        <Descriptions.Item label="备注">
                            { this.state.caseInfo.remark }
                        </Descriptions.Item>
                    </Descriptions>
                    <Form layout="inline" onSubmit={ this.searchSubmit } className="form-search" style={{ marginBottom: 0 }}>
                        <Form.Item label="查询时间">
                            {getFieldDecorator('dateRange')(
                                <DatePicker.RangePicker
                                    placeholder={['开始日期', '终止日期']}
                                    style={{ width: 250 }}
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button onClick={ this.searchReset }>重置</Button>
                        </Form.Item>
                    </Form>
                    { this.renderList() }
                </div>
            </Modal>
        )
    }
    renderList() {
        const columns = [
            { title: '姓名', dataIndex: 'patientName', align: 'center'},
            { title: '入院日期', dataIndex: 'inHosDate', align: 'center' },
            { title: '出院日期', dataIndex: 'outHosDate', align: 'center' },
            { title: '就诊医院名称', dataIndex: 'medicalOrganizationName', align: 'center' },
            { title: '出院诊断', dataIndex: 'outhosDiagnose', align: 'center' },
            { title: '入院科室', dataIndex: 'inhosDepartment', align: 'center' },
            { title: '医疗大类', dataIndex: 'medTypeName', align: 'center' },
            { title: '医疗总费用', dataIndex: 'medicalTotalMoney', align: 'center' },
            { title: '社保支付金额', dataIndex: 'siCost', align: 'center' },
            { title: '其他途径报销金额', dataIndex: 'otherPayMoney', align: 'center' }
        ]
        let pagination = {
            total: this.state.list.length,
            current: this.state.currentPage,
            showTotal: total => `共 ${total} 项`,
            pageSize: this.state.pageSize,
            onChange: current => {
                this.setState({
                    currentPage: current
                })
            }
        }
        const props = {
            rowKey: 'visitNo',
            columns: columns,
            size: 'middle',
            dataSource: this.state.list,
            pagination: pagination,
            rowSelection: {
                selectedRowKeys: this.state.selectedKeys,
                onChange: (keys, rows) => {
                    this.setState({
                        selectedKeys: keys,
                        selectedRows: rows
                    })
                }
            }
        }
        return (
            <Table bordered className="list-table" {...props} />
        )
    }
    getList = () => {
        this.setState({
            currentPage: 1,
            list: [],
            selectedKeys: [],
            selectedRows: []
        })
        let data = this.state.searchData
        data.insurancePolicyInfoEntity = {
            id: this.state.policy.id,
            startDate: this.state.policy.startDate,
            endDate: this.state.policy.endDate
        }
        http.post('/rs/api/claim/caseinfo/queryCaseInfoByBdas', data, { isLoading: true }).then(res => {
            this.setState({
                list: res ? res : []
            })
        })
    }
    searchSubmit = e => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(err){
                return
            }
            let startDate = values.dateRange && values.dateRange.length > 0 ? values.dateRange[0].format('YYYY-MM-DD') : undefined
            let endDate = values.dateRange && values.dateRange.length > 0 ? values.dateRange[1].format('YYYY-MM-DD') : undefined

            if(startDate && !moment(startDate).isBetween(this.state.policy.startDate, this.state.policy.endDate)){
                message.error('查询时间必须在保单有效时间之内')
                return
            }
            if(endDate && !moment(endDate).isBetween(this.state.policy.startDate, this.state.policy.endDate)){
                message.error('查询时间必须在保单有效时间之内')
                return
            }

            this.setState({
                searchData: {
                    startDate,
                    endDate
                }
            }, () => {
                this.getList()
            })
        })
    }
    searchReset = () => {
        this.props.form.resetFields()
        this.setState({
            searchData: {}
        }, () => {
            this.getList()
        })
    }
    closeBDAS = () => {
        this.setState({
            visible: false
        })
        this.props.onCancel()
    }
    queryBDAS = () => {
        if(this.state.selectedRows.length === 0){
            message.error('请选择就诊信息')
            return
        }
        Modal.confirm({
            title: '提示',
            content: '您确定要以选中的就诊信息来生成数据吗？',
            onOk: () => {
                let data = {
                    policyId: this.state.policy.id,
                    caseId: this.state.caseId,
                    visitInfoEntityList: this.state.selectedRows
                }
                http.post('/rs/api/claim/caseinfo/generateCaseInfoByBdas', data, { isLoading: true }).then(res => {
                    this.setState({
                        visible: false
                    })
                    this.props.onOk()
                })
            }
        })
    }
}
BDASData = Form.create()(BDASData)
export default BDASData