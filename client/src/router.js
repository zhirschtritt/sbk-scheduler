import Vue from 'vue';
import VueRouter from 'vue-router';
import StaffSchedule from './pages/StaffSchedule.vue';
import MemberView from './pages/MemberView.vue';

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: 'abstract',
  routes: [
    { path: '/members', name: 'members', component: MemberView },
    { path: '/staff', name: 'staff', component: StaffSchedule }
  ]
});
