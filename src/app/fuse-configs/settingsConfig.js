const settingsConfig = {
  layout: {
    style: 'layout3', // layout1 layout2 layout3
    config: {
      mode: 'container',
      containerWidth: 1200,
      toolbar: {
        position: 'above'
      },
      footer: {
        style: 'static'
      },
      leftSidePanel: {
        display: true
      },
      rightSidePanel: {
        display: false
      }
    }, // checkout default layout configs at app/fuse-layouts for example  app/fuse-layouts/layout1/Layout1Config.js
  },
  customScrollbars: true,
  direction: 'ltr', // rtl, ltr
  theme: {
    main: 'default',
    navbar: 'light10',
    toolbar: 'light10',
    footer: 'light10',
  },
};

export default settingsConfig;
