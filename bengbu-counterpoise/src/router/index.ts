import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Org from "@/views/org/Org.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    //组织管理
    path: "/",
    name: "org",
    component: Org,
  },
  {
    //设备管理
    path: "/sensor",
    name: "sensor",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "sensor" */ "@/views/sensor/Sensor.vue"),
  },
  {
    //比对库管理
    path: "/repo",
    name: "repo",
    component: () => import("@/views/repo/Repo.vue"),
  },
  {
    //分析任务
    path: "/task",
    name: "task",
    component: () => import("@/views/task/Task.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
