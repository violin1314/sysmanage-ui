import React, { Component } from 'react';
import { Row, Col, Form, Upload, Button, Icon, Select, Spin, message, Popconfirm, Tabs } from 'antd';
import ImgScroll from '@/project-rs/assets/component/ImgScroll';
import http from '@/utils/http'

class EnclosureManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            caseId: '',
            list: [],
            imgType: '01',
            imgIndex: 0,
            imgList: [],
            isLoading: false,
            fileList: [],
            isDirectory: false
        }
    }
    componentDidMount() {
        this.setState({
            caseId: this.props.id
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
            <Row>
                <Col span={12} style={{ padding: 10 }}>
                    <Spin spinning={this.state.isLoading}>
                        { this.renderImg() }
                    </Spin>
                </Col>
                <Col span={12}>
                    <Form {...formItemLayout} onSubmit={this.searchSubmit} style={{ marginTop: 20 }}>
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
                            <Button id="$button_sendid" type="primary" htmlType="submit">上传</Button>
                            <Button onClick={this.searchReset} style={{ marginLeft: 20 }}>重置</Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        )
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

    renderImg(){
        return(
            <div>
                <Tabs type="card" activeKey={ this.state.imgType } onChange={ this.changeType }>
                    <Tabs.TabPane tab="医学类" key="01"></Tabs.TabPane>
                    <Tabs.TabPane tab="身份类" key="02"></Tabs.TabPane>
                </Tabs>
                {
                    this.state.imgList.length > 0 &&
                    <div style={{ textAlign: 'right', marginBottom: 10 }}>
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

    changeUploadType = v => {
        this.setState({
            isDirectory: v === '2' ? true : false
        })
    }
    searchSubmit = e => {
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
            http.post('/rs/api/claim/attachment/updateAttachmentType', formData, { isLoading: true }).then(res => {
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
        http.post('/rs/api/claim/attachment/deleteAttachmentList', data, { isLoading: true }).then(res => {
            message.success('删除附件成功')
            this.getList()
        })
    }
}
EnclosureManage = Form.create()(EnclosureManage)
export default EnclosureManage;