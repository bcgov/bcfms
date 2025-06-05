<script setup lang="ts">
import { ref } from 'vue';
import Card from 'primevue/card';
import Panel from 'primevue/panel';
import Fluid from 'primevue/fluid';
import { useGettext } from 'vue3-gettext';

import { routeNames } from '@/bcfms/routes.ts';

const { $gettext } = useGettext();
const workflowItems = ref([
    {
        label: $gettext('New Project'),
        description: $gettext('Add a new project'),
        icon: 'fa fa-file',
        class: 'dashboard-card ipa',
        routeName: routeNames.newProject,
    },
]);
</script>
<template>
    <Panel
        header="Workflows"
        class="full-height"
    >
        <Fluid>
            <div class="flex max-w-2xl">
                <Card
                    v-for="item in workflowItems"
                    :key="item.routeName"
                    :class="item.class"
                >
                    <template #title>
                        <p class="dashboard-card-title mt-2">
                            {{ item.label }}
                        </p>
                    </template>
                    <template #content>
                        <i
                            :class="item.icon"
                            class="dashboard-card-icon"
                        >
                        </i>
                    </template>
                    <template #footer>
                        <router-link
                            :to="{ name: item.routeName }"
                            class="card-router-link"
                        >
                            <div class="dashboard-card-link">
                                <p class="dashboard-card-description">
                                    {{ item.description }}
                                </p>
                            </div>
                        </router-link>
                    </template>
                </Card>
            </div>
        </Fluid>
    </Panel>
</template>

<style scoped>
.dashboard-card {
    /*margin: 1rem;*/
    min-width: 33%;
    /*display: inline-block;*/
}

.card-router-link {
    text-decoration: none;
}

.dashboard-card.ipa {
    border: 1px solid #7847ce;
    border-radius: 0%;
    height: 253px;
    max-width: 275px;
    margin: 5px;
    text-align: center;
    background: #8bc3eb;
    color: #440ea2;
    opacity: 0.8;
}

.dashboard-card.ipa :deep(.p-card-body) {
    padding: 0rem;
}

.dashboard-card.ipa:hover {
    background: #6da8d3;
}

.dashboard-card-title {
    font-weight: 500;
    color: #440ea2;
    text-align: center;
    overflow-wrap: break-word;
}

.dashboard-card-icon {
    color: #fff;
    font-size: 2.8rem;
    line-height: 32px;
    padding: 1rem;
    margin-bottom: 3rem;
}

.dashboard-card-description {
    height: 55px;
    width: 100%;
    font-weight: 600;
    border-top: 1px solid #7847ce;
    color: white;
    font-size: 0.7rem;
}

.dashboard-card-link {
    background: #2b4e6d;
}

.dashboard-card-link:hover {
    background: #4683b9;
}

.dashboard-card-footer {
    height: 50px;
    position: absolute;
    bottom: 0;
    width: 100%;
    color: white;
}

.dashboard-card.collection-event {
    border: solid thick rgba(50, 50, 50, 0.7);
}
</style>
