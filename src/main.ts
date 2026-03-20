import { createApp } from 'vue';
import App from './App.vue';
import i18n from '@/locales/index';
import 'virtual:uno.css';
import '@/styles/main.less';
import router from '@/router';

const app = createApp(App);
app.use(i18n);
app.use(router);

app.config.globalProperties.$t = i18n.global.t;

app.mount('#app');
