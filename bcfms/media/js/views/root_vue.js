// // add the beginning of your app entry
// import 'vite/modulepreload-polyfill';
import { createRouter, createWebHistory } from 'vue-router';
import BCFMSApp from '@/bcfms/App.vue';
import { routes } from '@/bcfms/routes.ts';
import { arches } from '@/bcfms/api.ts';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import ToastService from 'primevue/toastservice';
import AnimateOnScroll from 'primevue/animateonscroll';
import FocusTrap from 'primevue/focustrap';
import StyleClass from 'primevue/styleclass';
import Tooltip from 'primevue/tooltip';
import { createGettext } from 'vue3-gettext';

const router = createRouter({
    history: createWebHistory(),
    routes,
});

const BCGovPreset = definePreset(Aura, {
    options: {
        prefix: 'p',
        darkModeSelector: 'system',
        cssLayer: false,
    },
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}',
        },
        colorScheme: {
            light: {
                color: '{gray.50}',
                formField: {
                    hoverBorderColor: '{primary.color}',
                },
            },
            dark: {
                formField: {
                    hoverBorderColor: '{primary.color}',
                },
            },
        },
    },
    components: {
        button: {
            paddingX: '.75rem;',
            paddingY: '0.1rem;',
        },
        card: {
            titleFontSize: '1.0rem',
        },
        fieldset: {
            colorScheme: {
                light: {
                    background: '{grey.50}',
                    legendBackground: '{grey.50}',
                },
                dark: {
                    background: '{grey.900}',
                    legendBackground: '{grey.900}',
                },
            },
        },
        inputtext: {
            paddingX: '0.2rem',
            paddingY: '0.2rem',
        },
        select: {
            paddingX: '0.2rem',
            paddingY: '0.2rem',
        },
        checkbox: {
            width: '1.0rem',
            height: '1.0rem',
        },
        radiobutton: {
            width: '1.0rem',
            height: '1.0rem',
        },
        panel: {
            contentPadding: '1.0rem',
            colorScheme: {
                light: {
                    background: '{grey.50}',
                },
                dark: {
                    background: '#222',
                },
            },
        },
        stepper: {
            stepNumberSize: '1.5rem',
            stepNumberFontSize: '1.0rem',
            steppanel: {
                background: '{grey.50}',
            },
        },
    },
});

document.addEventListener('DOMContentLoaded', function () {
    fetch(arches.urls.api_get_frontend_i18n_data)
        .then(function (resp) {
            if (!resp.ok) {
                throw new Error(resp.statusText);
            }
            return resp.json();
        })
        .then(function (respJSON) {
            const gettext = createGettext({
                availableLanguages: respJSON['enabled_languages'],
                defaultLanguage: respJSON['language'],
                translations: respJSON['translations'],
            });
            const vueApp = createApp(BCFMSApp);
            vueApp.use(PrimeVue, {
                theme: {
                    preset: BCGovPreset,
                    options: {
                        cssLayer: {
                            name: 'primevue',
                            order: 'theme, base, primevue',
                        },
                    },
                },
            });
            vueApp.use(gettext);
            vueApp.use(ConfirmationService);
            vueApp.use(DialogService);
            vueApp.use(ToastService);
            vueApp.directive('animateonscroll', AnimateOnScroll);
            vueApp.directive('focustrap', FocusTrap);
            vueApp.directive('styleclass', StyleClass);
            vueApp.directive('tooltip', Tooltip);
            vueApp.use(router);
            vueApp.mount('#bcfms-mounting-point');
        });
});
