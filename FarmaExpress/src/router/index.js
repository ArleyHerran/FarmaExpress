// Composables
import { useRouter } from 'vue-router'
import { auth} from '../confiFirebase'
import { onAuthStateChanged } from "firebase/auth";
import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from "../store/app";
import store from '@/store';
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Login.vue'),
        meta:{
          requireAuth:false
        }
      },
      {
        path: '/Dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Dashboard.vue'),
         meta:{
          requireAuth:true
        }
      },
      {
        path: '/Almacen',
        name: 'Almacen',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Almacen.vue'),
         meta:{
          requireAuth:true
        }
      },
      {
        path: '/Ventas',
        name: 'Ventas',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Ventas.vue'),
         meta:{
          requireAuth:true
        }
      },
      {
        path: '/Productos',
        name: 'Productos',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Productos.vue'),
         meta:{
          requireAuth:true
        }
      },
      {
        path: '/Gastos',
        name: 'Gastos',
        component: () => import(/* webpackChunkName: "home" */ '@/views/Gastos.vue'),
         meta:{
          requireAuth:true
        }
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})



router.beforeEach((to,from ,next)=>{
  const needAuth=to.meta.requireAuth;
  const usuarioGuardado = localStorage.getItem('usuario');
  const usuarioObjeto = JSON.parse(usuarioGuardado);
    const user = usuarioObjeto!=null;
//console.log(usuarioObjeto)
    if (!user && needAuth) {
      next('');
      //console.log("tiene que loguear");
     
    } else if (user && !needAuth) {
      next('/Dashboard');
     // console.log("logueadoo");
      
    } else {
      next();
    }
  });

  

   


export default router
