import { lazy } from 'react';
import { authRoles } from 'app/auth';

const ProfileConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: '/profile',
      component: lazy(() => import('./Profile')),
    },
  ],
};

export default ProfileConfig;