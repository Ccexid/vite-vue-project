import { createApp } from 'vue';
import '@/styles/index.less';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import App from './App.vue';
import router from './router';
import VueVirtualScroller from 'vue-virtual-scroller'

createApp(App)
    .use(router)
    .use(VueVirtualScroller)
    .mount('#app');
