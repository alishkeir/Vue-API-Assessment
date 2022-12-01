import { createRouter, createWebHistory } from 'vue-router';

import Customers from '../components/pages/CustomersList.vue';
import Customer from '../components/pages/Customer.vue';
import NotFound from '../components/pages/NotFound.vue';

// create routes array
const routes = [
    { path: '/', component: Customers },
    { path: '/customer/:id', component: Customer },
    { path: '/:pathMatch(.*)*', component: NotFound },
];

// create routers
const router = createRouter({
    //  creates history for SPA
    history: createWebHistory(),
    routes,
});

export default router;
