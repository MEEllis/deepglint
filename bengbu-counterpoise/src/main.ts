//重置浏览器样式
import "normalize.css";
import Vue from "vue";
//引入ui框架
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/index.scss";
import App from "./App.vue";
import "./registerServiceWorker";
import VirtualList from "vue-virtual-scroll-list";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component("VirtualList", VirtualList);

function load() {
  (window as any).Vm = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
}

load();
