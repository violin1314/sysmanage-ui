import React, {Component} from 'react';
import { Link, NavLink } from 'react-router-dom'
import { ChildrenRouter } from '../router'
import { Layout, Icon, Menu, Avatar, Row } from 'antd';
import http from '@/utils/http'

const { Sider, Header, Content } = Layout;
const SubMenu = Menu.SubMenu

class LayoutPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            userInfo: {},
            collapsed: false,
            menus: [],
            openKeys: [],

            headerHeight: ''
        }

        this.selectKeys = []
        this.rootMenuKeys = []
    }
    componentDidMount(){
        // 是否存在登录信息
        if(!sessionStorage.getItem('userInfo')){
            // 不存在则跳到登录页
            this.props.history.push('/login')
        }else{
            this.setState({
                userInfo: JSON.parse(sessionStorage.getItem('userInfo'))
            })

            this.getMenus()
        }

        // 监听路由变化
        this.props.history.listen(route => {
            if(!this.state.collapsed){
                return
            }
            this.setState({
                collapsed: false
            })
        })

        let headerHeight = document.querySelector('.header').offsetHeight
        this.setState({
            headerHeight
        })
    }
    // 渲染界面
    render(){
        return (
            <Layout style={{ height: '100%' }}>
                <Sider trigger={null} collapsible collapsed={ this.state.collapsed } style={{ overflowY: 'auto' }}>
                    <div className="sider-logo">
                        <Link to="/home">
                            <span>商保理赔系统</span>
                        </Link>
                    </div>
                    { this.renderMenu() }
                </Sider>
                <Content style={{ position: 'relative' }}>
                    <Header className="header">
                        <Icon
                            className="trigger"
                            type={ this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={ this.toggle }
                        />
                        { this.renderHeader() }
                    </Header>
                    <div className="wrap" style={{ paddingTop: this.state.headerHeight + 'px' }}>
                        <ChildrenRouter />
                    </div>
                </Content>
            </Layout>
        )
    }
    // 渲染菜单
    renderMenu(){
        return(
            <Menu
	        id="rootMenu"
                mode="inline"
                theme="dark"
                defaultSelectedKeys={ this.selectKeys }
                openKeys={ this.state.openKeys }
                onOpenChange={ this.onOpenChange }
            >
                { this.renderNodes(this.state.menus) }
            </Menu>
        )
    }
    renderNodes(menus){
        return (
            menus.map(menu => {
                if(menu.items){
                    return(
                        <SubMenu id={ menu.id } key={ menu.id } title={
                            menu.icon ? <span><Icon type={ menu.icon } /><span>{ menu.menuName }</span></span> : <span>{ menu.menuName }</span>
                        }>
                            { this.renderNodes(menu.items) }
                        </SubMenu>
                    )
                }else{
                    return (
                        <Menu.Item id={ menu.id } key={ menu.id }>
                            <NavLink to={ menu.menuUrl }>
                                { menu.icon ? <Icon type={ menu.icon } /> : '' }
                                <span>{ menu.menuName }</span>
                            </NavLink>
                        </Menu.Item>
                    )
                }
            })
        )
    }
    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if(this.rootMenuKeys.indexOf(latestOpenKey) === -1){
            this.setState({ openKeys });
        }else{
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : []
            });
        }
    }
    // 渲染 Header
    renderHeader(){
        return (
            <Row type="flex" align="middle">
                <span className='header-account'>
                    <Avatar size="small" className='avatar' icon="user"/> { this.state.userInfo.user_name }
                </span>
                <Icon type="logout" title="退出登录" style={{ fontSize: 20, cursor: 'pointer', marginLeft: 5 }} onClick={ this.logOut } />
            </Row>
        )
    }
    getMenus = () => {
        http.get('/api/console/menu/getMenuTreeList').then(res => {
            if(!res) return;
            res.forEach(item => {
                this.rootMenuKeys.push(item.id)
            })
            this.setState({
                menus: res
            })
        })
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }
    logOut = () => {
        http.post('/api/console/auth/logout').then(() => {
            sessionStorage.setItem('userInfo', '')
            this.props.history.push('/login')
        })
    }
}
export default LayoutPage;