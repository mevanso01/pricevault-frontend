import i18next from 'i18next';
import { authRoles } from 'app/auth';
import Trades from './Trades';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'tradesPage', en);
i18next.addResourceBundle('tr', 'tradesPage', tr);
i18next.addResourceBundle('ar', 'tradesPage', ar);

const TradesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: '/trades',
      component: Trades,
    },
  ],
};

export default TradesConfig;