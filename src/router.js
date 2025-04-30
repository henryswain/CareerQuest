import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import FindJobs from './pages/FindJobs.vue'; 
import ProfilePage from './pages/ProfilePage.vue';
import SavedJobs from './pages/SavedJobs.vue';
import Settings from './pages/Settings.vue';
import AboutPage from './pages/About.vue';
import ContactPage from './pages/Contact.vue';
import PrivacyPage from './pages/Privacy.vue';
import TermsPage from './pages/Terms.vue'

// eventually will add imports like a PostJob that link to './pages.Postjob.vue'
// Will also add one for companies and career advice. But we will talk more about that 

const routes = [
  {
    path: '/',
    redirect: './home-page'
  },
  {
    path: '/home-page',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/find-jobs',
    name: 'FindJobs',
    component: FindJobs,
    props: (route) => ({ query: route.query.q })
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
  },
  {
    path: '/saved-jobs',
    name: 'SavedJobs',
    component: SavedJobs,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactPage,
  },
  {
    path: '/Privacy',
    name: '/Contact',
    component: PrivacyPage,
  },
  {
    path: '/terms',
    name: 'Terms',
    component: TermsPage,
  }
  // we can add our future routes here for the post job and comapnies
];

const router = createRouter({
  // history: createWebHashHistory("/informatics-capstone-project/"),
  history: createWebHistory(),
  routes,
});

export default router;
