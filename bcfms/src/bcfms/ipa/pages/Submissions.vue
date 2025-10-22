<script setup lang="ts">
import Panel from 'primevue/panel';
import Fluid from 'primevue/fluid';
import { useGettext } from 'vue3-gettext';
import { routeNames } from '@/bcfms/routes.ts';
import Card from '@/bcgov_arches_common/components/card/card.vue';

const { $gettext } = useGettext();
</script>
<template>
    <Panel
        header="Workflows"
        class="full-height"
    >
        <Fluid>
            <div class="dashboard-div-flex">
                <Card
                    :label="$gettext('New Project')"
                    :description="$gettext('Add a new project')"
                    :subtitle="$gettext('Add a new project')"
                    :icon="'fa fa-file'"
                    :class="'dashboard-card ipa'"
                    :route-name="routeNames.submitProject"
                />
                <Card
                    :label="$gettext('Review Project')"
                    :subtitle="$gettext('Review an existing project')"
                    :description="$gettext('Review existing project')"
                    :icon="'fa fa-file'"
                    :class="'dashboard-card ipa'"
                    :route-name="routeNames.reviewProject"
                />
            </div>
        </Fluid>
    </Panel>
</template>

<style scoped>
.dashboard-div-flex {
    display: flex;
    max-width: 46rem;
    flex-wrap: wrap;
}
</style>
