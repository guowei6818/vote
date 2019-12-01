/*
 * @Author: your name
 * @Date: 2019-11-16 20:17:42
 * @LastEditTime: 2019-11-30 17:12:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Vote\voter\src\router\index.js
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

import Index from "../views/Index.vue";
// import Login from "../views/Login.vue";
// import Register from "../views/Register.vue";
import CreateVote from "../views/CreateVote.vue";
import VoteView from "../views/VoteView.vue";
import Forgot from "../views/Forgot.vue";
import ChangePassword from "../views/ChangePassword.vue";
import ShowCreate from "../views/ShowCreate.vue";
import ShowJoin from "../views/ShowJoin.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
    children: [{
      path: '/create',
      component: ShowCreate
    },{
      path: '/join',
      component: ShowJoin
    }]
  },{
    path: "/create-vote",
    name: 'create-vote',
    component: CreateVote
  },{
    path: "/vote-show/:id",
    name: 'vote-view',
    component: VoteView
  },{
    path: "/forgot",
    name: 'forgot',
    component: Forgot
  },{
    path: "/change-password/:token",
    name: 'change-password',
    component: ChangePassword
  }
];

const router = new VueRouter({
  routes,
});

export default router;
