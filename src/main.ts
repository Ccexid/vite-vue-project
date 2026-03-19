import { createApp } from 'vue';
import App from './App.vue';
import i18n from '@/locales/index';
import 'virtual:uno.css';
import '@/styles/main.less';

createApp(App).use(i18n).mount('#app');
