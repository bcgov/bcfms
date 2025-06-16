<script setup lang="ts">
import { provide, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGettext } from 'vue3-gettext';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import {
    ANONYMOUS,
    DEFAULT_ERROR_TOAST_LIFE,
    ENGLISH,
    ERROR,
    USER_KEY,
    selectedLanguageKey,
    systemLanguageKey,
} from '@/bcgov_arches_common/constants.ts';
import { routeNames } from '@/bcfms/routes.ts';
import {
    fetchUser,
    setUrlPrefix,
    setUrlContextRoot,
} from '@/bcgov_arches_common/api.ts';
import PageHeader from '@/bcgov_arches_common/components/header/PageHeader.vue';
import SideNav from '@/bcgov_arches_common/components/sidenav/SideNav.vue';
import type { Ref } from 'vue';
import type { Language, User } from '@/bcgov_arches_common/types.ts';

const user = ref<User | null>(null);
const setUser = (userToSet: User | null) => {
    user.value = userToSet;
};

provide(USER_KEY, { user, setUser });

const selectedLanguage: Ref<Language> = ref(ENGLISH);
provide(selectedLanguageKey, selectedLanguage);
const systemLanguage = ENGLISH; // TODO: get from settings
provide(systemLanguageKey, systemLanguage);

const router = useRouter();
const route = useRoute();
const toast = useToast();
const { $gettext } = useGettext();
setUrlPrefix('http://localhost:81');
setUrlContextRoot('/bc-fossil-management');

router.beforeEach(async (to, _from, next) => {
    try {
        let userData = await fetchUser();

        if (
            to.meta.requiresAuthentication &&
            !(
                'Local Government' in userData.groups ||
                'Heritage Branch' in userData.groups
            )
        ) {
            window.location.replace(
                window.location.origin + '/bc-fossil-management',
            );
        }

        setUser(userData);

        const requiresAuthentication = to.matched.some(
            (record) => record.meta.requiresAuthentication,
        );

        if (requiresAuthentication && userData.username === ANONYMOUS) {
            throw new Error();
        } else {
            next();
        }
    } catch (error) {
        if (to.name !== routeNames.home) {
            toast.add({
                severity: ERROR,
                life: DEFAULT_ERROR_TOAST_LIFE,
                summary: $gettext('Login required.'),
                detail: error instanceof Error ? error.message : undefined,
            });
        }

        next({ name: routeNames.home });
    }
});
</script>

<template>
    <main>
        <PageHeader
            v-if="route.meta.shouldShowNavigation"
            :route-names="routeNames"
            system-name="BC Fossil Management System"
        />
        <div
            style="
                display: flex;
                flex: auto;
                margin-top: 50px;
                flex-direction: row;
            "
        >
            <SideNav
                v-if="route.meta.shouldShowNavigation"
                :route-names="routeNames"
            />
            <div
                class="bcgov-main-content"
                style="flex: auto; background-color: #e9e9e9"
            >
                <RouterView />
            </div>
        </div>
    </main>
    <Toast />
</template>

<style scoped>
main {
    font-family: sans-serif;
    height: 100vh;
    width: 100vw;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
}

.full-height {
    height: 100%;
}
</style>

<style>
#bcfms-mounting-point {
    font-size: 0.8rem;
}

.bcgov-vertical-steps > .p-steplist {
    flex-direction: column;
    align-items: flex-start;
}

.bcgov-vertical-step-panels {
    height: 100%;
    width: 100%;
}

.bcgov-main-content .p-panel {
    background-color: var(--p-panel-background) !important;
}

.bcgov-stepper {
    display: flex;
    flex-direction: row;
}

.p-tooltip-text,
.p-button-label,
.p-inputtext {
    font-size: 0.8rem !important;
}
</style>
