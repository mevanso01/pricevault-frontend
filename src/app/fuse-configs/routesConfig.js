import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import DashboardConfig from 'app/main/dashboard/DashboardConfig';
import SubmissionsConfig from 'app/main/submissions/SubmissionsConfig';
import FuseLoading from '@fuse/core/FuseLoading';
import Error404Page from 'app/main/404/Error404Page';
import LoginConfig from 'app/main/login/LoginConfig';
import RegisterConfig from 'app/main/register/RegisterConfig';

const routeConfigs = [
  DashboardConfig,
  SubmissionsConfig,
  LoginConfig,
  RegisterConfig
];

const routes = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
  // The individual route configs which has auth option won't be overridden.
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    exact: true,
    path: '/',
    component: () => <Redirect to="/dashboard" />,
  },
  {
    exact: true,
    path: '/submissions',
    component: () => <Redirect to="/submissions" />,
  },
  // {
  //   path: '/loading',
  //   exact: true,
  //   component: () => <FuseLoading />,
  // },
  // {
  //   path: '/404',
  //   component: () => <Error404Page />,
  // },
  {
    component: () => <Redirect to="/dashboard" />,
  },
];

export default routes;
