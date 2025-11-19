<script setup lang="ts">
import Panel from 'primevue/panel';
import Fluid from 'primevue/fluid';
import { useGettext } from 'vue3-gettext';
import { routeNames } from '@/bcfms/routes.ts';
import Card from '@/bcgov_arches_common/components/card/card.vue';
import { onMounted, ref, type Ref } from 'vue';

import { getIpasForReview } from '@/bcfms/ipa/api.ts';
import type { IPAListResponseType } from '@/bcfms/ipa/types.ts';
import type { IPAType } from '@/bcfms/ipa/schema/IPASchema.ts';

const { $gettext } = useGettext();
const ipasForReview: Ref<IPAType[]> = ref([]);
const nextPage = ref('');
const previousPage = ref('');
const ipaCount = ref(0);
const offset = ref(0);
const pageResults = function (url: string) {
    console.log(url);
    const tmpOffset = url?.split('offset=')[1]?.split('&')[0];
    getIpasForReview(url).then((response: IPAListResponseType) => {
        ipasForReview.value = response.results;
        nextPage.value = response.next;
        previousPage.value = response.previous;
        ipaCount.value = response.count;
        offset.value = tmpOffset ? parseInt(tmpOffset) : 0;
    });
};
onMounted(() => {
    getIpasForReview(null).then((response: IPAListResponseType) => {
        ipasForReview.value = response.results;
        nextPage.value = response.next;
        previousPage.value = response.previous;
        ipaCount.value = response.count;
    });
});
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
            </div>
            <div class="section-title">
                <i
                    v-if="previousPage"
                    class="previous-page-link fa fa-angles-left"
                    @click="pageResults(previousPage)"
                >
                </i>
                Review Submitted IPAs ({{ offset + 1 }}-{{
                    Math.min(offset + 10, ipaCount)
                }}
                / {{ ipaCount }})
                <i
                    v-if="nextPage"
                    class="next-page-link fa fa-angles-right"
                    @click="pageResults(nextPage)"
                >
                </i>
            </div>
            <div class="dashboard-div-flex">
                <Card
                    v-for="ipa in ipasForReview"
                    :key="ipa?.resourceinstanceid"
                    :label="
                        $gettext(
                            ipa?.aliased_data?.assessment_details?.aliased_data
                                ?.ipa_number?.display_value,
                        )
                    "
                    :subtitle="
                        $gettext(
                            ipa?.aliased_data?.project_details?.aliased_data
                                ?.project_name?.display_value,
                        )
                    "
                    :description="$gettext('Review project')"
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
    flex-wrap: wrap;
}

.previous-page-link,
.next-page-link {
    min-width: 1rem;
    cursor: pointer;
    color: #440ea2;
}

.section-title {
    margin-top: 1rem;
    font: 1rem sans-serif;
}
</style>
