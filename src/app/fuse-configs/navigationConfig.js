import authRoles from 'app/auth/authRoles';
import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  // {
  //   id: 'applications',
  //   title: 'Applications',
  //   translate: 'APPLICATIONS',
  //   type: 'group',
  //   icon: 'apps',
  //   children: [
  //     {
  //       id: 'dashboard-component',
  //       title: 'Dashboard',
  //       translate: 'DASHBOARD',
  //       type: 'item',
  //       icon: 'whatshot',
  //       url: '/dashboard',
  //     },
  //   ],
  // },
  {
    id: 'results',
    title: 'Results',
    type: 'item',
    icon: 'assessment',
    url: '/dashboard',
  },
  {
    id: 'trade-repo',
    title: 'Trade Repo',
    type: 'item',
    icon: 'folder',
    url: '/trades',
  },
  {
    id: 'submissions',
    title: 'Submissions',
    type: 'item',
    icon: 'upload',
    url: '/submissions',
  },
  {
    id: 'users',
    title: 'Users',
    type: 'item',
    auth: authRoles.admin,//['admin']
    icon: 'person',
    url: '/users',
  },
];

export default navigationConfig;
