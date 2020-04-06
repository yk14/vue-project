import Vue from "vue";
import Router from "vue-router";

import auth from "./auth";

import Home from "./views/home";
import defaultLayout from "./layouts/side-nav-outer-toolbar";
import simpleLayout from "./layouts/single-card";

import reportCommonProps from './views/reportCommonProps'
import reportCommonContents from './views/reportCommonContents'
import reportManager from './views/reportManager'
import fileManager from './views/fileManager'
import fileUpload from './views/fileUpload'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/home",
      name: "home",
      meta: { requiresAuth: true },
      components: {
        layout: defaultLayout,
        content: Home
      }
    },
      {
          //文件上传测试
          path: "/fileUpload",
          name: "fileUpload",
          meta: { requiresAuth: true },
          components: {
              layout: defaultLayout,
              content: fileUpload
          }
      },

      {
      //历史兑付明细配置
      path: "/historyCashDetailProp",
      name: "historyCashDetailProp",
      meta: { requiresAuth: true },
      components: {
        layout: defaultLayout,
        content: reportCommonProps
      }
    },
      {
          //历史兑付明细内容
          path: "/historyCashDetailContent",
          name: "historyCashDetailContent",
          meta: { requiresAuth: true },
          components: {
              layout: defaultLayout,
              content: reportCommonContents
          }
      },
      {
          //报表管理
          path: "/reportManager",
          name: "reportManager",
          meta: { requiresAuth: true },
          components: {
              layout: defaultLayout,
              content: reportManager
          }
      },
      {
          //文件管理配置
          path: "/fileManager",
          name: "fileManager",
          meta: { requiresAuth: true },
          components: {
              layout: defaultLayout,
              content: fileManager
          }
      },
    {
      path: "/login-form",
      name: "login-form",
      meta: { requiresAuth: false },
      components: {
        layout: simpleLayout,
        // route level code-splitting
        // this generates a separate chunk (login.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        content: () =>
            import(/* webpackChunkName: "login" */ "./views/login-form")
      }
    },
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/recovery",
      redirect: "/home"
    },
    {
      path: "*",
      redirect: "/home"
    }

  ]
});

router.beforeEach((to, from, next) => {

  if (to.name === "login-form" && auth.authenticated()) {
    next({ name: "home" });
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.authenticated()) {
      next({
        name: "login-form",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
