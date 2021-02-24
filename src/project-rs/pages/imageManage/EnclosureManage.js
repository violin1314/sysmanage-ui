import React, { Component } from 'react';
import { Row, Col, Form, Upload, Button, Icon, Select, Spin, message, Popconfirm, Tabs, Modal, Table, Tooltip } from 'antd';

import http from '@/utils/http'
import ImgScroll from '@/project-rs/assets/component/ImgScroll';

class EnclosureManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            conHeight: '',
            caseId: '',
            reportNo: '',
            list: [],
            imgType: '01',
            imgIndex: 0,
            imgList: [],
            isLoading: false,
            fileList: [],
            isDirectory: false,

            visible: false,
            questionVisible: false,
            questionList: [],

            singleItem: {},
            singleVisible: false
        }
    }
    componentDidMount() {
        let windowHeight = document.body.clientHeight
        this.setState({
            conHeight: windowHeight - 150
        })
        this.setState({
            caseId: this.props.id,
            reportNo: this.props.reportNo,
            caseState: this.props.caseState
        }, () => {
            this.getList()
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!nextProps.id || nextProps.id === this.props.id) {
            return
        }
        this.searchReset()
        this.setState({
            caseId: nextProps.id,
            reportNo: nextProps.reportNo,
            caseState: nextProps.caseState,
            list: [],
            isLoading: false
        }, () => {
            this.getList()
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        }
        const { getFieldDecorator } = this.props.form
        const { fileList } = this.state
        const props = {
            multiple: true,
            onRemove: file => {
                let index = fileList.indexOf(file);
                let newFileList = fileList.slice();
                newFileList.splice(index, 1)

                this.setState({
                    fileList: newFileList
                })
            },
            beforeUpload: file => {
                if (fileList.indexOf(file) === -1) {
                    fileList.push(file)
                }
                this.setState({
                    fileList
                })
                return false
            },
            fileList,
            directory: this.state.isDirectory
        }
        return (
            <div>
                <Row>
                    <Col span={12} style={{ padding: 10 }}>
                        <Spin spinning={this.state.isLoading}>
                            {this.renderImg()}
                        </Spin>
                    </Col>
                    <Col span={12}>
                        <Form {...formItemLayout} onSubmit={this.query} style={{ marginTop: 20 }}>
                            <Form.Item label="业务类型">
                                {getFieldDecorator('fileType', {
                                    rules: [{ required: true, message: '请选择业务类型' }]
                                })(
                                    <Select placeholder="请选择业务类型" >
                                        <Select.Option value="01">医学类</Select.Option>
                                        <Select.Option value="02">身份类</Select.Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="上传方式">
                                {getFieldDecorator('uploadType', {
                                    initialValue: '3',
                                    rules: [{ required: true, message: '请选择上传方式' }]
                                })(
                                    <Select placeholder="请选择上传方式" onChange={this.changeUploadType} >
                                        <Select.Option value="2">本地文件夹上传</Select.Option>
                                        <Select.Option value="3">本地批量上传</Select.Option>
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item label="选择文件">
                                <Upload {...props}>
                                    <Button stype="primary">
                                        <Icon type="upload" /> 浏览
                                        </Button>
                                </Upload>
                            </Form.Item>
                            <div style={{ textAlign: 'center', marginTop: 20 }}>
                                <Button type="primary" htmlType="submit" disabled={ this.state.caseState !== '99' }>上传</Button>
                                <Button onClick={this.searchReset} style={{ marginLeft: 10 }}>重置</Button>
                                <Button type="primary" onClick={ this.checkQuestion } style={{ marginLeft: 10 }}>查看问题件</Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
                { this.renderQuestion() }
            </div>
        )
    }
    renderImg(){
        return(
            <div>
                <Tabs type="card" activeKey={ this.state.imgType } onChange={ this.changeType }>
                    <Tabs.TabPane tab="医学类" key="01"></Tabs.TabPane>
                    <Tabs.TabPane tab="身份类" key="02"></Tabs.TabPane>
                </Tabs>
                {
                    (this.state.imgList.length > 0 && this.state.caseState === '99') &&
                    <div style={{ position: 'absolute', right: 0, top: 5 }}>
                        <Popconfirm
                            placement="right"
                            title="确定删除所选附件吗？"
                            onConfirm={ this.delFile }
                        >
                            <Button type="primary" size="small"><Icon type="delete" /> 删除</Button>
                        </Popconfirm>
                    </div>
                }
                <ImgScroll list={ this.state.imgList } onChange={ this.imgChange } />
            </div>
            
        )
    }
    initImgs = () => {
        let imgs = JSON.parse(JSON.stringify(this.state.list))
        let imgList = []
        imgs.forEach(item => {
            if(item.serviceType === this.state.imgType){
                imgList.push(item)
            }
        })
        this.setState({
            imgList
        })
    }
    changeType = v => {
        this.setState({
            imgType: v,
            imgIndex: 0
        }, () => {
            this.initImgs()
        })
    }
    getList = () => {
        this.setState({
            isLoading: true,
            imgList: [],
            imgIndex: 0,
            imgType: '01'
        })
        http.post('/rs/api/claim/attachment/findAttachmentList', { indemnityCaseId: this.state.caseId }).then(res => {
            this.setState({
                list: res,
                isLoading: false
            }, () => {
                this.initImgs()
            })
        })
    }
    changeUploadType = v => {
        this.setState({
            isDirectory: v === '2' ? true : false
        })
    }
    query = e => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return
            }
            const { fileList } = this.state;
            if (fileList.length === 0) {
                message.error('请选择文件')
                return
            }
            const formData = new FormData();
            fileList.forEach(file => {
                formData.append('files[]', file);
            })
            formData.append('indemnityCaseId', this.state.caseId);
            formData.append('serviceType', values.fileType)
            http.post('/rs/api/claim/attachment/updateAttachmentTypeHjBwylT', formData, { isLoading: true }).then(res => {
                message.success('附件上传成功')
                this.getList()
                this.searchReset()
            })
        })
    }
    searchReset = () => {
        this.props.form.resetFields()
        this.setState({
            fileList: []
        })
    }
    imgChange = idx => {
        this.setState({
            imgIndex: idx
        })
    }
    delFile = () => {
        let data = {
            caseAttachmentList: [this.state.imgList[this.state.imgIndex]]
        }
        http.post('/rs/api/claim/attachment/deleteAttachmentHjReportAcceptOper', data, { isLoading: true }).then(res => {
            message.success('删除附件成功')
            this.getList()
        })
    }

    renderQuestion(){
        const columns = [
            { title: '报案号', dataIndex: 'reportNo', width: 200 },
            { title: '问题件', dataIndex: 'description' },
            { title: '是否已处理', dataIndex: 'isHandle', width: 150,
                render: (text, record) => (
                    <div className="list-actions" style={{ textAlign: 'center' }}>
                        { record.revokeReason && text === '1' && '已撤销' }
                        { !record.revokeReason && text === '1' && '是' }
                        { text === '0' && '否' }
                        { text === '0' &&
                            <Tooltip title="处理" onClick={this.handle.bind(this, record)}>
                                <span style={{ marginLeft: 10 }}><Icon type="stop" /></span>
                            </Tooltip>
                        }
                    </div>
                )
            }
        ]
        const props = {
            columns,
            rowKey: 'id',
            size: 'middle',
            dataSource: this.state.questionList,
            pagination: false
        }
        return (
            <Modal
                title="问题件"
                className="modal-detail"
                width="90%"
                centered
                visible={ this.state.questionVisible }
                onCancel={ this.closeQuestion }
                footer={ false }
            >
                <div className="modal-detail-content" style={{ height: this.state.conHeight }}>
                    <Table bordered className="list-table" {...props} />
                </div>
            </Modal>
        )
    }
    checkQuestion = () => {
        this.setState({
            questionVisible: true
        })
        this.queryProblemPiecs()
    }
    queryProblemPiecs = () => {
        http.post('/rs/api/claim/problempiecs/queryProblemPiecs', { reportNo: this.state.reportNo }, { isLoading: true }).then(res => {
            this.setState({
                questionList: res
            })
        })
    }
    closeQuestion = () => {
        this.setState({
            questionVisible: false
        })
    }
    handle = record => {
        Modal.confirm({
            title: '提示',
            content: '确定处理此问题件吗？',
            onOk: () => {
                let data = {
                    reportNo: record.reportNo,
                    questionList: [
                        { questionNo: record.problemNo, isSuccess: '1' }
                    ]
                }
                http.post('/rs/api/claim/problempiecs/confirmProblem', data, { isLoading: true }).then(res => {
                    message.success('问题件处理成功')
                    this.queryProblemPiecs()
                })
            }
        })
    }
}
EnclosureManage = Form.create()(EnclosureManage)
export default EnclosureManage;