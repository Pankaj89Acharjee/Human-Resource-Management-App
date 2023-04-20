// AUTH
import EmployeeLogin from './auth/employeeLogin';
import AdminLogin from './auth/adminLogin';

// PRE JOINEE
import PrejoineeLogin from './auth/prejoineeLogin';
import PrejoineeProfile from './prejoinee/profile';
import PrejoineeUpdateProfile from './prejoinee/updateprofile';

// EMPLOYEE
import EmployeeHome from './employeepage/page/home';

// ADMIN
import AdminHome from './adminpage/page/home';
import AdminProfile from './adminpage/page/adminProfile';
import AdminEmployeeList from './adminpage/page/adminEmployeeList';
import AdminAddEmployee from './adminpage/page/adminAddEmployee';
import AdminEmployeeDetails from './adminpage/page/adminEmployeeDetails';
import AdminLoans from './adminpage/page/loans';
import JobRequisition from './adminpage/page/jobRequisition';
import JobReference from './adminpage/page/referenceJob';
import Department from './adminpage/page/department';
import Grades from './adminpage/page/grades';
import AssetsList from './adminpage/page/assets';
import EmployeeRequest from './adminpage/page/employeeRequest';
import PreJoining from './adminpage/page/preJoining';
import PreJoiningView from './adminpage/page/preJoiningView';
import EmployeeRequestView from './adminpage/page/employeeRequestView';
import AssetsAddNew from './adminpage/page/assetsAdd';
import AssetsCategory from './adminpage/page/assetsCategory';

export const EmployeeAuthRouter = [
  {
    path: '/employee/login',
    component: EmployeeLogin,
    exact: true,
  },
];

export const AuthRouter = [
  {
    path: '/employee/login',
    component: EmployeeLogin,
    exact: true,
  },
  {
    path: '/admin/login',
    component: AdminLogin,
    exact: true,
  },
  {
    path: '/prejoinee/login',
    component: PrejoineeLogin,
    exact: true,
  },
  {
    path: '/prejoinee',
    component: PrejoineeProfile,
    exact: true,
  },
  {
    path: '/prejoinee/profile',
    component: PrejoineeProfile,
    exact: true,
  },
  {
    path: '/prejoinee/update-profile',
    component: PrejoineeUpdateProfile,
    exact: true,
  }
];
export const AdminAuthRouter = [
  {
    path: '/admin/login',
    component: AdminLogin,
    exact: true,
  },
];

// export const AccountAuthRouter = [
//   {
//     path: '/accounts/login',
//     component: AdminLogin,
//     exact: true,
//   }
// ];

export const EmployeeRouter = [
  {
    path: '/',
    component: EmployeeHome,
    exact: true,
  },
  {
    path: '/employee',
    component: EmployeeHome,
    exact: true,
  },
  {
    path: '/employee/home',
    component: EmployeeHome,
    exact: true,
  },
];

export const AdminRouter = [
  {
    path: '/admin',
    component: AdminHome,
    exact: true,
  },
  {
    path: '/admin/home',
    component: AdminHome,
    exact: true,
  },
  {
    path: '/admin/profile',
    component: AdminProfile,
    exact: true,
  },
  {
    path: '/admin/employee',
    component: AdminEmployeeList,
    exact: true,
  },
  {
    path: '/admin/loans',
    component: AdminLoans,
    exact: true,
  },
  {
    path: '/admin/job-requisition',
    component: JobRequisition,
    exact: true,
  },
  {
    path: '/admin/job-reference',
    component: JobReference,
    exact: true,
  },
  {
    path: '/admin/pre-joining',
    component: PreJoining,
    exact: true,
  },
  {
    path: '/admin/pre-joining/:id',
    component: PreJoiningView,
    exact: true,
  },
  {
    path: '/admin/add-employee',
    component: AdminAddEmployee,
    exact: true,
  },
  {
    path: '/admin/holiday',
    component: AdminAddEmployee,
    exact: true,
  },
  {
    path: '/admin/employee/:empid',
    component: AdminEmployeeDetails,
    exact: true,
  },
  {
    path: '/admin/department',
    component: Department,
    exact: true,
  },
  {
    path: '/admin/grade',
    component: Grades,
    exact: true,
  },
  {
    path: '/admin/assets',
    component: AssetsList,
    exact: true,
  },
  {
    path: '/admin/add-assets',
    component: AssetsAddNew,
    exact: true,
  },
  {
    path: '/admin/manage-assets',
    component: AssetsAddNew,
    exact: true,
  },
  {
    path: '/admin/assets-category',
    component: AssetsCategory,
    exact: true,
  },
  {
    path: '/admin/employee-request',
    component: EmployeeRequest,
    exact: true,
  },
  {
    path: '/admin/employee-request/:id',
    component: EmployeeRequestView,
    exact: true,
  },
];