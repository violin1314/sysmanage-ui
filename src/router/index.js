import React from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom'

// 基础界面
import Login from '@/basic/login' //登陆
import LayoutPage from '@/basic/layout' //布局
import Home from '@/basic/home' //首页
import SysMenu from '@/basic/system/menu'
import SysRole from '@/basic/system/role'
import SysUser from '@/basic/system/user'

// 融盛路由
import RsRouter from '@/project-rs/router'
// 泰康路由
import TkRouter from '@/project-tk/router'
// 国寿路由
import GsRouter from '@/project-gs/router'

// 基础路由
const BasicRouter = [
	{ path: '/sys/menu', component: SysMenu, routes: [] },
	{ path: '/sys/role', component: SysRole, routes: [] },
	{ path: '/sys/user', component: SysUser, routes: [] },
]
const routers = [...BasicRouter, ...RsRouter, ...TkRouter, ...GsRouter];

// 路由
const RouterView = () => (
	<BrowserRouter>
		<Switch>
			<Route path="/login" component={Login} />
			<Route path="/" component={LayoutPage} />
		</Switch>
	</BrowserRouter>
)
// 子路由
const ChildrenRouter = () => (
	<Switch>
		<Route path="/home" component={ Home } />
		{routers.map((router, index) => {
			if (router.exact) {
				return <Route exact key={index} path={router.path}
					render={
						props => (<router.component {...props} routes={router.routers} />)
					} />
			} else {
				return <Route key={index} path={router.path}
					render={props => (<router.component {...props} routes={router.routers} />)} />
			}
		})
		}
		<Redirect to="/home" />
	</Switch>
)
export {
	RouterView,
	ChildrenRouter
}