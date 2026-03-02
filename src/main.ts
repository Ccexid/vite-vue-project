import { createApp } from 'vue';
import '@/styles/index.less';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import App from './App.vue';
import router from './router';
import VueVirtualScroller from 'vue-virtual-scroller'
import i18n from '@/locales/index'

createApp(App)
    .use(router)
    .use(i18n)
    .use(VueVirtualScroller)
    .mount('#app');
