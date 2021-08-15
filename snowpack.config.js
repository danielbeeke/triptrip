export default {
  mount: {
    'src': '/',
    'scss': '/css',
  },
  routes: [
    {
      match: 'routes',
      src: '.*',
      dest: '/index.html',
    },
  ],
  plugins: [
    '@snowpack/plugin-sass'
  ]
};
