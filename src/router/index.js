import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import defaultLayout from "@/layout/defaultLayout.vue";
import Me from "@/views/home/Me.vue";
import { useUserStore } from "@/stores/user";
const isElectron =
  typeof process !== "undefined"
    ? process.env.IS_ELECTRON
    : import.meta.env.IS_ELECTRON;
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  mode: isElectron ? "hash" : "history",
  //  mode: 'hash',
  routes: [
    {path: "/default",
      name: "默认",
      meta: { isAuth: true, isAdmin: false},
      component: defaultLayout,
      children: [
        {
          path: "todo",
          name: "我的待办",
          component: () => import("@/views/home/Todo.vue"),
          meta: { isAuth: true, isAdmin: false,showMenu:true},
        },
        {
          path: "collection",
          name: "我的收藏",
          component: () => import("@/views/home/Collection.vue"),
          meta: { isAuth: true, isAdmin: false,showMenu:true},
        },
        {
          path: "patient",
          name: "患者管理",
          component: () => import("@/views/patient/NewPatient.vue"),
          meta: { isAuth: true, isAdmin: false,showMenu:true},
        },
        {
          path: "Xray",
          name: "X光",
          component: () => import("@/views/patient/Xray.vue"),
          meta: { isAuth: true, isAdmin: false,showMenu:true},
        },
        {
          path:"question",
          name:"常见问题",
          component:()=>import("@/views/help/Question.vue"),
          meta: { isAuth: true, isAdmin: false,showMenu:true},
        },
        {
          path: "users",
          name: "用户管理",
          component: () => import("@/views/users/UserManage.vue"),
          meta: { isAuth: true, isAdmin: true,showMenu:true},
        },
        {
          path: "guide",
          name: "操作指南",
          component: () => import("@/views/help/Guide.vue"),
          meta: { isAuth: true, isAdmin: false,showMenu:true},
        },
        {
          path: "patientXray",
          name: "患者X光",
          component: () => import("@/views/patient/PatientXray.vue"),
          meta: { isAuth: true, isAdmin: false,showMenu:false},
        },
        {
          path: "xrayDetail",
          name: "X光详情",
          component: () => import("@/views/patient/XrayDetail.vue"),
          meta: { isAuth: true, isAdmin: false,showMenu:false},
        },
        {
          path:"data",
          name: "数据统计",
          component: () => import("@/views/data/AllData.vue"),
          meta: { isAuth: true, isAdmin: false,showMenu:true},
          children:[
            {
              path: "ageData",
              name: "年龄统计",
              component: () => import("@/views/data/AgeData.vue"),
              meta: { isAuth: true, isAdmin: false,showMenu:true},

            },
            {
              path: "genderData",
              name: "性别统计",
              component: () => import("@/views/data/GenderData.vue"),
              meta: { isAuth: true, isAdmin: false,showMenu:true},
            },
            {
              path: "regionData",
              name: "地区统计",
              component: () => import("@/views/data/RegionData.vue"),
              meta: { isAuth: true, isAdmin: false,showMenu:true},
            },
          ]
    },]},
    {
      path: "/",
      meta: { isAuth: false, isAdmin: false, showMenu:false},
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      meta: { isAuth: false, isAdmin: false },
      component: () => import("@/views/LoginView.vue"),
    },
  ],
});
router.beforeEach((to, from, next) => {
  if (to.meta.isAuth) {
    console.log("isAuth");
    if (useUserStore().user.is_logged_in) {
      next();
    } else {
      console.log("not logged in");
      next("/login");
    }
  } else {
    console.log("not isAuth");
    next();
  }
});
export default router;
