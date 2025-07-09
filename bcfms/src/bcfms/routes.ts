import type { RouteNamesType } from '@/bcgov_arches_common/routes.ts';

const dev_mode = true;
const routes = [
    {
        path: '/bc-fossil-management/submissions/',
        name: 'root',
        component: () => import('@/bcfms/pages/Submissions.vue'),
        meta: {
            shouldShowNavigation: true,
            requiresAuthentication: !dev_mode,
        },
    },
    {
        path: '/bc-fossil-management/submissions/new-project/',
        name: 'newProject',
        component: () => import('@/bcfms/pages/NewProject.vue'),
        meta: {
            shouldShowNavigation: true,
            requiresAuthentication: !dev_mode,
        },
    },
];

type BCFMSRouteNamesType = RouteNamesType & {
    newProject: string;
};

const routeNames: BCFMSRouteNamesType = {
    home: 'root',
    login: 'login',
    newProject: 'newProject',
};

export { routes, routeNames };
export type { BCFMSRouteNamesType };
