import ReportCase from './pages/reportCase'
import InsuranceAccept from './pages/insuranceAccept'
import InsuranceSecondAudit from './pages/insuranceSecondAudit'
import InsuranceChangeRecord from './pages/insuranceChangeRecord'
import FinalAudit from './pages/finalAudit'
import AllSearch from './pages/allSearch'
import InsuranceCaseInvestigation from './pages/insuranceCaseInvestigation'
import CasePriority from './pages/casePriority'
import ReopenCase from './pages/reopenCase'
import ReopenCaseAudit from './pages/reopenCaseAudit'
import ReopenCaseAccept from './pages/reopenCaseAccept'
import ImageManage from './pages/imageManage'
import RedList from './pages/redList'
import InsuranceMaintain from './pages/insuranceMaintain'
import Hospital from './pages/hospital'
import PreviousDisease from './pages/previousDisease'
import CaseAudit from './pages/caseAudit'

const RsRouter = [
	{ path: '/rs/reportCase', component: ReportCase, routes: [] },
	{ path: '/rs/insurance/accept', component: InsuranceAccept, routes: [] },
	{ path: '/rs/insurance/secondAudit', component: InsuranceSecondAudit, routes: [] },
	{ path: '/rs/insurance/changeRecord', component: InsuranceChangeRecord, routes: [] },
	{ path: '/rs/case/finalAudit', component: FinalAudit, routes: [] },
	{ path: '/rs/all/search', component: AllSearch, routes: [] },
	{ path: '/rs/insurance/CaseInvestigation', component: InsuranceCaseInvestigation, routes: [] },
	{ path: '/rs/casePriority', component: CasePriority, routes: [] },
	{ path: '/rs/reopenCase', component: ReopenCase, routes: [] },
	{ path: '/rs/reopenCaseAudit', component: ReopenCaseAudit, routes: [] },
	{ path: '/rs/reopenCaseAccept', component: ReopenCaseAccept, routes: [] },
	{ path: '/rs/imageManage', component: ImageManage, routes: [] },
	{ path: '/rs/redList', component: RedList, routes: [] },
	{ path: '/rs/insurance/maintain', component: InsuranceMaintain, routes: [] },
	{ path: '/rs/hospital', component: Hospital, routes: [] },
	{ path: '/rs/previousDisease', component: PreviousDisease, routes: [] },
	{ path: '/rs/caseAudit', component: CaseAudit, routes: [] }
]
export default RsRouter