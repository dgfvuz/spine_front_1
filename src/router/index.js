import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import defaultLayout from '@/layout/defaultLayout.vue'
import Me from '@/views/home/Me.vue'
import { useUserStore } from '@/stores/user'
const isElectron = typeof process !== 'undefined' ? process.env.IS_ELECTRON : import.meta.env.IS_ELECTRON;
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
   mode: isElectron ? 'hash' : 'history',
  //  mode: 'hash',
  routes: [
    {
      path:'/',
      meta:{isAuth:false,isAdmin:false},
      redirect:'/login'
    },
    {
      path: '/admin',
      name: '管理员',
      meta:{isAuth:true,isAdmin:true},
      component: defaultLayout,
      children: [
        {
          path: 'users',
          name: '用户管理',
          component: () => import('@/views/users/UserManage.vue')
        }
      ]
    },
    {
      path: '/home',
      name: '主页',
      meta:{isAuth:true,isAdmin:false},
      component: defaultLayout,
      children: [
        {
          path: 'todo',
          name: '我的待办',
          component: () => import('@/views/home/Todo.vue')
        },
        {
          path:'collection',
          name:'我的收藏',
          component:()=>import('@/views/home/Collection.vue')
        },
        {
          path: 'me',
          name: '账号信息',
          component: Me,
        },
        {
          path:'security',
          name:'安全设置',
          component:()=>import('@/views/home/Account.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta:{isAuth:false,isAdmin:false},
      component: () => import('@/views/LoginView.vue')
    },

    {
      path:'/patient',
      name:'患者管理',
      meta:{isAuth:true,isAdmin:false},
      component:defaultLayout,
      children:[
        {
          path:'add',
          name:'添加患者',
          component:()=>import('@/views/patient/NewPatient.vue')
        },
        {
          path:'search',
          name:'患者查询',
          component:()=>import('@/views/patient/SearchPatient.vue')
        },
        {
          path:'result',
          name:'查询结果',
          component:()=>import('@/views/patient/SearchResult.vue')
        }
      ]
    },
    {
      path:'/data',
      name:'数据统计',
      meta:{isAuth:true,isAdmin:false},
      component:defaultLayout,
      children:[
        {
          path:'all',
          name:'全部数据',
          component:()=>import('@/views/data/AllData.vue')
        },
        {
          path:'condition',
          name:'条件查询',
          component:()=>import('@/views/data/ConditionData.vue')
        },
        {
          path:'timeline',
          name:'患者时间轴',
          component:()=>import('@/views/data/PatientTimeline.vue')
        },
        {
          path:'analysis',
          name:'数据统计',
          component:()=>import('@/views/data/DataAnalysis.vue')
        },
        {
          path:'approved',
          name:'已审核',
          component:()=>import('@/views/data/ApprovedPatient.vue')
        },
        {
          path:'unapproved',
          name:'未审核',
          component:()=>import('@/views/data/UnapprovedPatient.vue')
        }
      ]
    },
    {
      path:'/help',
      name:'帮助中心',
      meta:{isAuth:true,isAdmin:false},
      component:defaultLayout,
      children:[
        {
          path:'start',
          name:'快速上手',
          component:()=>import('@/views/help/Start.vue')
        },
        {
          path:'guide',
          name:'操作指南',
          component:()=>import('@/views/help/Guide.vue')
        },
        {
          path:'question',
          name:'常见问题',
          component:()=>import('@/views/help/Question.vue')
        },
        {
          path:'manual',
          name:'使用手册',
          component:()=>import('@/views/help/Manual.vue')
        },
        {
          path:'video',
          name:'视频教程',
          component:()=>import('@/views/help/Video.vue')
        },
        {
          path:'new',
          name:'新功能介绍',
          component:()=>import('@/views/help/New.vue')
        }
      ]
    },

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.isAuth) {
    console.log('isAuth')
    if (useUserStore().user.is_logged_in) {
      next()
    } else {
      next('/login')
    }
  }else{
    next()
  }
})
export default router
