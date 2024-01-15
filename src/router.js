/* =========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== */

import Vue from 'vue';
import Router from 'vue-router';
import FullPage from '@/layouts/full-page/FullPage.vue';
import Landing from '@/views/Landing.vue';
Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: '',
      component: FullPage,
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: '/welcome',
          name: 'welcome',
          component: () => import('./views/Index.vue'),
          meta: {
            rule: 'isPublic',
            title: 'Welcome',
          },
        },
        {
          path: '/about',
          name: 'AboutUs',
          component: () => import('./views/AboutUs.vue'),
          meta: {
            rule: 'isPublic',
            title: 'About Us',
          },
        },
        {
          path: '/',
          name: 'Landing',
          component: Landing,
          meta: {
            rule: 'isPublic',
            title: 'VideoWiki',
          },
        },
        {
          path: '/classroom',
          name: 'Classroom',
          component: () => import('./views/classroom/Classroom.vue'),
          meta: {
            rule: 'isPublic',
            title: 'Classroom',
          },
        },
        {
          path: '/team',
          name: 'Teams',
          component: () => import('./views/Teams.vue'),
          meta: {
            rule: 'isPublic',
            title: 'Teams',
          },
        },
        {
          path: '/goals',
          name: 'Goals',
          component: () => import('./views/Goals.vue'),
          meta: {
            rule: 'isPublic',
            title: 'Goals',
          },
        },
        {
          path: '/vc',
          name: 'VideoConference',
          component: () => import('./views/VideoConference.vue'),
          meta: {
            rule: 'isPublic',
          },
        },
        {
          path: '/awards',
          name: 'Awards',
          component: () => import('./views/Awards.vue'),
          meta: {
            rule: 'isPublic',
            title : 'Awards',
          },
        },

        {
          path: '/search',
          name: 'Search',
          component: () => import('./views/search/Index.vue'),
          meta: {
            rule: 'isPublic',
            title: 'Search',
          },
        },
        {
          path: '/video/:slug',
          name: 'Video View',
          component: () => import('./views/videos/NewDetailViewVideo.vue'),
          meta: {
            rule: 'isPublic',
            title : 'Video view'
          },
        },
        {
          path: '/privacy-policy',
          name: 'Privacy Policy',
          component: () => import('./views/Privacy.vue'),
          meta: {
            rule: 'isPublic',
            title : 'Privacy Policy'
          },
        },
        {
          path: '/terms-of-use',
          name: 'Terms of Use',
          component: () => import('./views/Terms.vue'),
          meta: {
            rule: 'isPublic',
            title : 'Terms of Use'
          },
        },
        {
          path: '/integration/ms-teams',
          name: 'MsTeams',
          component: () => import('./views/Integrations/MsTeams/MsTeams.vue'),
          meta: {
            rule: 'isPublic',
            title: 'MsTeams'
          },
        },
        {
          path: '/integration/webex-bot',
          name: 'WebexBot',
          component: () =>
            import('./views/Integrations/WebexBot/WebexPage.vue'),
          meta: {
            rule: 'isPublic',
            title: 'WebexBot'
          },
        },
        {
          path: '/integration/ocean-protocol',
          name: 'OceanProtocol',
          component: () =>
            import('./views/Integrations/OceanProtocol/OceanProtocol.vue'),
          meta: {
            rule: 'isPublic',
            title : 'OceanProtocol',
          },
        },
        {
          path: '/creators',
          name: 'Creators',
          component: () => import('./views/creators/Creators.vue'),
          meta: {
            rule: 'isPublic',
            title : 'Creators'
          },
        },
        {
          path: '/feedback',
          name: 'Feedback',
          component: () => import('./views/cannio/Feedback.vue'),
          meta: {
            rule: 'isLogged',
            title : 'Feedback'
          },
        },
        {
          path: '/cast',
          component: () => import('./views/ComingSoon.vue'),
          meta: {
            rule: 'isPublic',
            title : 'Coming Soon'
          },
        },
      ],
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('./views/register/Register.vue'),
      meta: {
        rule: 'isPublic',
        title : 'Register'
      },
    },
    {
      path: '',
      name: '/',
      component: () => import('./views/login/Login.vue'),
      meta: {
        rule: 'isPublic',
        title:'Login'
      },
      children: [
        {
          path: '/login/',
          name: 'Login',
          component: () => import('@/views/login/components/Restricted.vue'),
          meta: {
            rule: 'isPublic',
            // layout: 'full',
            pageType: 'auth',
            title: 'Login'
          },
        },
      ],
    },
    {
      path: '/test/',
      name: 'test',
      component: () => import('@/views/login/components/Test.vue'),
      meta: {
        rule: 'isPublic',
        // layout: 'full',
        pageType: 'auth',
      },
    },
    {
      path: '/password/reset/:token/:origin',
      name: 'Reset Password',
      component: () => import('@/views/passwordReset/Reset.vue'),
      meta: {
        rule: 'isPublic',
        title : 'Reset Password'
      },
    },
    {
      path: '/password/email',
      name: 'Reset Email',
      component: () => import('@/views/passwordReset/Reset.vue'),
      meta: {
        rule: 'isPublic',
        title : 'Reset Email'
      },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('./views/dashboard/Dashboard.vue'),
      meta: {
        rule: 'isPublic',
        title: 'Dashboard'
      },
    },
    {
      path: '/myvideos',
      name: 'MyVideos',
      component: () => import('./views/MyVideos.vue'),
      meta: {
        rule: 'isLogged',
        title : 'My Videos',
      },
    },
    {
      path: '/callback',
      name: 'Callback',
      component: () => import('./views/login/components/Callback.vue'),
      meta: {
        rule: 'isPublic',
      },
    },
    {
      path: '/saveInfo',
      name: 'Info',
      component: () => import('./views/login/components/SaveInfo.vue'),
      meta: {
        rule: 'isPublic',
      },
    },
    {
      path: '/consent',
      name: 'Consent',
      component: () => import('./views/login/components/Consent.vue'),
      meta: {
        rule: 'isPublic',
      },
    },
    {
      path: '/profile',
      name: 'MyProfile',
      component: () => import('./views/Profile.vue'),
      meta: {
        rule: 'isLogged',
        title: 'My Profile'
      },
    },
    {
      path: '/contact-us',
      name: 'ContactUs',
      component: () => import('./views/ContactUs.vue'),
      meta: {
        rule: 'isPublic',
        title: 'Contact us'
      },
    },

    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: '',
      component: () => import('./layouts/main/Main.vue'),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: '/studio/:videoId?',
          name: 'home',
          component: () => import('./views/Home.vue'),
          meta: {
            rule: 'isPublic',
            title: 'Studio',
          },
        },
      ],
    },
    {
      // =============================================================================
      // VideoWiki Class LAYOUT ROUTES
      // =============================================================================
      path: '',
      component: () => import('./layouts/videowiki-class/Index.vue'),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================
        {
          path: '/integrations/classroom',
          name: 'VideoWikiClassLanding',
          component: () => import('./views/videowiki-class/Landing.vue'),
          meta: {
            rule: 'isPublic',
            title:'VideoWikiClassLanding'
          },
        },
      ],
    },
    {
      path: '/error/not-authorized',
      component: () => import('./views/NotAuthorized.vue'),
    },
    {
      path: '/error/404',
      component: () => import('./views/Error404.vue'),
      meta: {
        rule: 'isPublic',
        title: 'Error',
      },
    },

    { path: '/error/500', component: () => import('./views/Error500.vue') },
    // Redirect to 404 page, if no match found
    {
      path: '*',
      redirect: '/error/404',
    },
  ],
});

router.afterEach((to) => {
  const pageTitle = to.meta.title || 'VideoWiki'; // Get the route-specific title or set a default value
  document.title = pageTitle; // Update the document title
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg');
  if (appLoading) {
    appLoading.style.display = 'none';
  }
});

export default router;
