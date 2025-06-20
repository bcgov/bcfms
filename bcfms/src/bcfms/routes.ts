import type { RouteNamesType } from '@/bcgov_arches_common/routes.ts';

const dev_mode = true;
const routes = [
    {
        path: '/bc-fossil-management/submissions/',
        name: 'root',
        component: () => import('@/bcfms/ipa/pages/Submissions.vue'),
        meta: {
            shouldShowNavigation: true,
            requiresAuthentication: !dev_mode,
        },
    },
    {
        path: '/bc-fossil-management/submissions/new-project/',
        name: 'submitProject',
        component: () =>
            import('@/bcfms/ipa/pages/SubmitProject/SubmitProject.vue'),
        meta: {
            shouldShowNavigation: true,
            requiresAuthentication: !dev_mode,
        },
    },
];

type BCFMSRouteNamesType = RouteNamesType & {
    submitProject: string;
};

const routeNames: BCFMSRouteNamesType = {
    home: 'root',
    login: 'login',
    submitProject: 'submitProject',
};

export { routes, routeNames };
export type { BCFMSRouteNamesType };
