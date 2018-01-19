import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from './Main.vue';
import Index from './Index.vue';
import ViewConfig from './ViewConfig.vue';
import EditConfig from './EditConfig.vue';
import CreateConfig from './CreateConfig.vue';
import * as firebase from 'firebase';
import {DataSnapshot} from '@firebase/database-types';

Vue.use(VueRouter);

const firebaseConfig = {
  apiKey: 'AIzaSyDkWQzJ83vW7hzXiDT1GM_nYHXXgsnXKn4',
  authDomain: 'homepage-1cf5b.firebaseapp.com',
  databaseURL: 'https://homepage-1cf5b.firebaseio.com',
  projectId: 'homepage-1cf5b',
  storageBucket: 'homepage-1cf5b.appspot.com',
  messagingSenderId: '359082159191'
};
firebase.initializeApp(firebaseConfig);

const routes = [
  {path: '/', component: Index},
  {path: '/create', component: CreateConfig},
  {path: '/view/:config', component: ViewConfig},
  {path: '/edit', component: EditConfig},
  {path: '/edit/:config', component: EditConfig}
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

Vue.filter('snapshotArr', (value: DataSnapshot) => {
  const result = [];

  value.forEach(child => {
    result.push({
      snapshot: child,
      val: child.val(),
      key: child.key
    });

    return false;
  });

  return result;
});

const vue = new Vue({
  el: '#app',
  router,
  render: h => h(Main)
});
