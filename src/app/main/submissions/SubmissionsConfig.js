import i18next from 'i18next';
import { authRoles } from 'app/auth';
import Submissions from './Submissions';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'submissionsPage', en);
i18next.addResourceBundle('tr', 'submissionsPage', tr);
i18next.addResourceBundle('ar', 'submissionsPage', ar);

const SubmissionsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: '/submissions',
      component: Submissions,
    },
  ],
};

export default SubmissionsConfig;