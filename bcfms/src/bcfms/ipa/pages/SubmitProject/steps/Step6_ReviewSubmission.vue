<script setup lang="ts">
import { inject } from 'vue';
import type { Ref } from 'vue';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { VIEW } from '@/arches_component_lab/widgets/constants.ts';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';

const ipa = inject<Ref<IPA>>('ipa');

const isValid = () => {
    console.log(ipa?.value);
    return true;
};

const emit = defineEmits(['update:stepIsValid']);

defineExpose({ isValid });

emit('update:stepIsValid', isValid());
</script>

<template>
    <div class="review_submit_page">
        <div class="step-title">Submission Details</div>
        <p class="p-margin-top-bottom">
            Please review the entered information prior to submitting the
            application:
        </p>
        <p class="p-underline-bold">Filling Details</p>
        <div>
            <div class="div-grid-cols">Reference Number</div>
            <div class="div-grid-cols">
                <p>Submission Date</p>
                <span>{{
                    ipa?.projectDetails.project_start_date.node_value
                }}</span>
            </div>
        </div>
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="ipa?.projectDetails.project_name"
            graph-slug="project_assessment"
            node-alias="project_name"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="ipa?.projectDetails.project_initiator"
            graph-slug="project_assessment"
            node-alias="project_initiator"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="ipa?.projectDetails.industry_company_name"
            graph-slug="project_assessment"
            node-alias="industry_company_name"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="ipa?.projectDetails.project_authorizing_agency"
            graph-slug="project_assessment"
            node-alias="project_authorizing_agency"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="ipa?.projectDetails?.land_act_file_number"
            graph-slug="project_assessment"
            node-alias="land_act_file_number"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="ipa?.projectDetails.project_start_date"
            graph-slug="project_assessment"
            node-alias="project_start_date"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="ipa?.projectDetails.project_end_date"
            graph-slug="project_assessment"
            node-alias="project_end_date"
        />

        <GenericWidget
            class="div-grid-cols"
            graph-slug="project_assessment"
            node-alias="project_type"
            :mode="VIEW"
            :aliased-node-data="ipa?.projectDetails.project_type"
        />
        <GenericWidget
            class="div-grid-cols"
            graph-slug="project_assessment"
            node-alias="other_project_type"
            :mode="VIEW"
            :aliased-node-data="ipa?.projectDetails?.other_project_type"
        />
        <GenericWidget
            class="div-grid-cols"
            graph-slug="project_assessment"
            node-alias="proposed_activity"
            :aliased-node-data="ipa?.projectDetails?.proposed_activity"
            :mode="VIEW"
        />
        <GenericWidget
            class="div-grid-cols"
            graph-slug="project_assessment"
            node-alias="location_description"
            :mode="VIEW"
            :aliased-node-data="ipa?.projectDetails.location_description"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="ipa?.projectDetails.geometry_qualifier"
            graph-slug="project_assessment"
            node-alias="geometry_qualifier"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="ipa?.projectDetails.multiple_geometry_qualifier"
            graph-slug="project_assessment"
            node-alias="multiple_geometry_qualifier"
        />
        <div class="div-grid-cols">
            <div>Uploaded Files</div>
        </div>
    </div>
</template>
<style scoped>
.step-title {
    margin-bottom: 1rem;
    font-size: 21px;
    font-weight: bold;
    line-height: inherit;
    color: #333;
}
.p-margin-top-bottom {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
}
.p-underline-bold {
    text-decoration: underline;
    font-weight: bold;
}
.div-grid-cols {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr) 1fr);
}
.widget {
    margin-bottom: 1rem;
}
.review_submit_page {
    line-height: 1.25;
}
</style>
