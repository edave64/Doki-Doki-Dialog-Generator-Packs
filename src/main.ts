import Vue from 'vue';
import App from './App.vue';
import contenteditable from 'vue-contenteditable';
Vue.use(contenteditable);

Vue.config.productionTip = false;

new Vue({
	render: h => h(App),
}).$mount('#app');
