import React, { Component } from 'react';
import { Table, Tabs } from 'antd';

import OperationDetail from './OperationDetail'
import ExaminationDetail from './ExaminationDetail'
import TestDetail from './TestDetail'
import DischargeSummary from './DischargeSummary'

class ElectronicMedical extends Component {
    constructor(props) {
        super(props)
        this.state = {
            conHeight: '',
            detail: {},
            
            docAdvicesCurrent: 1,
            operationCurrent: 1,
            examinationCurrent: 1,
            testCurrent: 1,

            doctorAdvices: [],
            operations: [],
            examinationList: [],
            testInfoCategoryList: [],
            dischargeSummary: {}
        }
    }
    componentDidMount() {
        this.init(this.props.detail)
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.init(nextProps.detail)
    }
    init(detail){
        let wHeight = document.body.clientHeight
        this.setState({
            conHeight: wHeight - 180,
            detail: detail ?  detail : {},
            doctorAdvices: detail.doctorAdvices ? detail.doctorAdvices : [],
            operations: detail.operations ? detail.operations : [],
            examinationList: detail.examinationList ? detail.examinationList : [],
            testInfoCategoryList: detail.testInfoCategoryList ? detail.testInfoCategoryList : [],
            dischargeSummary: detail.dischargeSummary ? detail.dischargeSummary : {}
        })
    }
    render(){
        const TabPane = Tabs.TabPane
        const wrapStyle = {
            height: this.state.conHeight,
            overflowY: 'auto'
        }
        return(
            <Tabs defaultActiveKey="1" tabPosition="left">
                <TabPane tab="病案首页" key="1">
                    <div style={ wrapStyle }>
                        <div dangerouslySetInnerHTML={{ __html: this.state.detail.emrContent }}></div>
                    </div>
                </TabPane>
                <TabPane tab="医嘱信息" key="2">
                    <div style={ wrapStyle }>
                        { this.renderDocAdvicesList() }
                    </div>
                </TabPane>
                <TabPane tab="手术记录" key="3">
                    <div style={ wrapStyle }>
                        { this.renderOperationList() }
                    </div>
                </TabPane>
                <TabPane tab="影像/检查信息" key="4">
                    <div style={ wrapStyle }>
                        { this.renderExaminationList() }
                    </div>
                </TabPane>
                <TabPane tab="化验信息" key="5">
                    <div style={ wrapStyle }>
                        { this.renderTestList() }
                    </div>
                </TabPane>
                <TabPane tab="出院小结" key="6">
                    <div style={ wrapStyle }>
                        <DischargeSummary detail={ this.state.dischargeSummary } />
                    </div>
                </TabPane>
            </Tabs>
        )
    }
    // 医嘱信息
    renderDocAdvicesList() {
        const coulmns = [
            { title: '医嘱时间', dataIndex: 'advice_date', align: 'center' },
            { title: '医嘱项目名称', dataIndex: 'advice_item_name', align: 'center' },
            { title: '医嘱项目编码', dataIndex: 'advice_item_code', align: 'center' },
            { title: '长期医嘱标志', dataIndex: 'longAdviceFlagName', align: 'center' },
            { title: '频次', dataIndex: 'freq', align: 'center' },
            { title: '每日用量', dataIndex: 'daily_dose', align: 'center' },
            { title: '用法', dataIndex: 'usage', align: 'center' },
            { title: '最小单位', dataIndex: 'smallest_unit', align: 'center' },
            { title: '总量', dataIndex: 'total', align: 'center' },
            { title: '处方号', dataIndex: 'prescription_id', align: 'center' },
            { title: '开始执行时间', dataIndex: 'start_date', align: 'center' },
            { title: '每次用量', dataIndex: 'dose', align: 'center' },
            { title: '每次用量单位', dataIndex: 'dose_unit', align: 'center' },
            { title: '日频次', dataIndex: 'daily_freq', align: 'center' },
            { title: '最小剂量', dataIndex: 'minimum_dose', align: 'center' },
            { title: '最小剂量单位', dataIndex: 'minimum_dose_unit', align: 'center' },
            { title: '组合号', dataIndex: 'group_id', align: 'center' },
            { title: '停止日期', dataIndex: 'stop_date', align: 'center' },
            { title: '停止执行时间', dataIndex: 'stop_exec_time', align: 'center' }
        ]
        let pagination = {
            total: this.state.doctorAdvices.length,
            current: this.state.docAdvicesCurrent,
            showTotal: total => `共 ${total} 项`,
            pageSize: 10,
            onChange: current => {
                this.setState({
                    docAdvicesCurrent: current
                })
            }
        }
        const props = {
            rowKey: 'prescription_id',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.doctorAdvices,
            pagination: pagination,
            scroll: { x: true }
        }
        return(
            <Table bordered className="list-table table-nowrap" {...props} />
        )
    }
    // 手术记录
    renderOperationList() {
        const coulmns = [
            { title: '手术名称', dataIndex: 'operation_name', align: 'center' },
            { title: '手术级别', dataIndex: 'operation_level', align: 'center' },
            { title: '手术开始时间', dataIndex: 'operation_start_dtime', align: 'center' },
            { title: '手术结束时间', dataIndex: 'operation_end_dtime', align: 'center' },
            { title: '手术及操作编码', dataIndex: 'operation_code', align: 'center' },
            { title: '术前诊断编码', dataIndex: 'before_operation_icd', align: 'center' },
            { title: '术后诊断编码', dataIndex: 'after_operation_icd', align: 'center' }
        ]
        let pagination = {
            total: this.state.operations.length,
            current: this.state.operationCurrent,
            showTotal: total => `共 ${total} 项`,
            pageSize: 10,
            onChange: current => {
                this.setState({
                    operationCurrent: current
                })
            }
        }
        const expandedRowRender = record => (
            <OperationDetail detail={ record } />
        )
        const props = {
            rowKey: 'prescription_no',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.operations,
            pagination: pagination,
            scroll: { x: true },
            expandedRowRender : expandedRowRender
        }
        return(
            <Table bordered className="list-table table-nowrap" {...props} />
        )
    }
    // 影像/检查信息
    renderExaminationList() {
        const coulmns = [
            { title: '检查项目(设备类型)', dataIndex: 'examination_item', align: 'center' },
            { title: '影像与超声检查', dataIndex: 'examination_image', align: 'center' },
            { title: '检查类型', dataIndex: 'examination_type', align: 'center' },
            { title: '送检日期', dataIndex: 'sample_date', align: 'center' },
            { title: '检查报告日期', dataIndex: 'examination_report_date', align: 'center' }
        ]
        let pagination = {
            total: this.state.examinationList.length,
            current: this.state.examinationCurrent,
            showTotal: total => `共 ${total} 项`,
            pageSize: 10,
            onChange: current => {
                this.setState({
                    examinationCurrent: current
                })
            }
        }
        const expandedRowRender = record => (
            <ExaminationDetail detail={ record } />
        )
        const props = {
            rowKey: 'examination_report_no',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.examinationList,
            pagination: pagination,
            scroll: { x: true },
            expandedRowRender : expandedRowRender
        }
        return(
            <Table bordered className="list-table table-nowrap" {...props} />
        )
    }
    // 化验信息
    renderTestList() {
        const coulmns = [
            { title: '检验方法名称', dataIndex: 'test_name', align: 'center' },
            { title: '检验报告单编号', dataIndex: 'test_no', align: 'center' },
            { title: '检验项目名称', dataIndex: 'test_item_name', align: 'center' },
            { title: '检验报告结果', dataIndex: 'test_report_result', align: 'center' },
            { title: '参考值', dataIndex: 'test_reference_value', align: 'center' },
            { title: '单位', dataIndex: 'test_measurement_units', align: 'center' },
            { title: '接收标本日期', dataIndex: 'sample_receive_date', align: 'center' },
            { title: '检验报告日期', dataIndex: 'test_report_date', align: 'center' }
        ]
        let pagination = {
            total: this.state.testInfoCategoryList.length,
            current: this.state.testCurrent,
            showTotal: total => `共 ${total} 项`,
            pageSize: 10,
            onChange: current => {
                this.setState({
                    testCurrent: current
                })
            }
        }
        const expandedRowRender = record => (
            <TestDetail detail={ record } />
        )
        const props = {
            rowKey: 'test_no',
            columns: coulmns,
            size: 'middle',
            dataSource: this.state.testInfoCategoryList,
            pagination: pagination,
            scroll: { x: true },
            expandedRowRender: expandedRowRender
        }
        return(
            <Table bordered className="list-table table-nowrap" {...props} />
        )
    }
}
export default ElectronicMedical;