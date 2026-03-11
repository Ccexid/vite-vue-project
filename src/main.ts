import { createApp } from 'vue';
import 'virtual:uno.css';
import '@/styles/index.less';
import App from './App.vue';
import router from './router';
import i18n from '@/locales/index';

createApp(App).use(router).use(i18n).mount('#app');
