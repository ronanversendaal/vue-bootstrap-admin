import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Overview from 'src/components/Dashboard/Views/Overview.vue'
import UserProfile from 'src/components/Dashboard/Views/UserProfile.vue'
import TableList from 'src/components/Dashboard/Views/TableList.vue'
import Typography from 'src/components/Dashboard/Views/Typography.vue'
import Icons from 'src/components/Dashboard/Views/Icons.vue'
import Notifications from 'src/components/Dashboard/Views/Notifications.vue'
import Login from 'src/components/Dashboard/Views/Auth/Login'

import ArticleList from 'src/components/Dashboard/Views/Management/Articles/Articles'
import Articles from 'src/components/Dashboard/Views/Management/Articles/'
import ArticleEdit from 'src/components/Dashboard/Views/Management/Articles/ArticleEdit'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/overview'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/overview',
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview
      },
      {
        path: '/login',
        name: 'login',
        component: Login
      },
      {
        path: 'user',
        name: 'User',
        component: UserProfile
      },
      {
        path: 'table-list',
        name: 'Table List',
        component: TableList
      },
      {
        path: 'typography',
        name: 'Typography',
        component: Typography
      },
      {
        path: 'icons',
        name: 'Icons',
        component: Icons
      },
      {
        path: 'articles',
        component: Articles,
        redirect: '/admin/articles',
        meta: {
          auth: true,
          link: '../components/Dashboard/Views/Management/Articles/index.vue'
        },
        children: [
          {
            name: 'Articles',
            path: '/',
            component: ArticleList
          },
          {
            name: 'ArticleEdit',
            path: ':id/edit',
            component: ArticleEdit
          }
        ]
      },
      {
        path: 'projects',
        // component: lazyLoading('management/projects', true),
        meta: {
          link: 'management/projects/index.vue'
        },
        children: [
          {
            name: 'Projects',
            path: '',
            // component: lazyLoading('management/projects/Projects'),
            meta: {
              link: 'management/projects/Projects.vue'
            }
          },
          {
            name: 'ProjectEdit',
            path: ':id/edit',
            // component: lazyLoading('management/projects/ProjectEdit'),
            meta: {
              link: 'management/projects/ProjectEdit.vue'
            }
          }
        ]
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      }
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
 **/
function view (name) {
  var res = import('../components/Dashboard/Views/' + name + '.vue')
  return res
}

export default routes
