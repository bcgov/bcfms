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
        <div class="div-grid-cols">
            <div>Submission Date</div>
            <div>
                {{
                    ipa?.project_details?.aliased_data?.project_start_date
                        .display_value
                }}
            </div>
        </div>
        <div class="div-grid-cols">
            <div>Uploaded Files</div>
        </div>

        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details?.aliased_data?.project_name
            "
            graph-slug="project_assessment"
            node-alias="project_name"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details?.aliased_data?.project_initiator
            "
            graph-slug="project_assessment"
            node-alias="project_initiator"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details?.aliased_data?.industry_company_name
            "
            graph-slug="project_assessment"
            node-alias="industry_company_name"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details?.aliased_data?.project_authorizing_agency
            "
            graph-slug="project_assessment"
            node-alias="project_authorizing_agency"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details?.aliased_data?.land_act_file_number
            "
            graph-slug="project_assessment"
            node-alias="land_act_file_number"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details?.aliased_data?.project_start_date
            "
            graph-slug="project_assessment"
            node-alias="project_start_date"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details?.aliased_data?.project_end_date
            "
            graph-slug="project_assessment"
            node-alias="project_end_date"
        />

        <GenericWidget
            graph-slug="project_assessment"
            node-alias="project_type"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details?.aliased_data?.project_type?.aliased_data
                    .project_type
            "
        />
        <GenericWidget
            graph-slug="project_assessment"
            node-alias="other_project_type"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details?.aliased_data?.project_type?.aliased_data
                    .other_project_type
            "
        />
        <GenericWidget
            graph-slug="project_assessment"
            node-alias="proposed_activity"
            :aliased-node-data="
                ipa?.project_details?.aliased_data?.project_type?.aliased_data
                    .proposed_activity
            "
            :mode="VIEW"
        />
        <GenericWidget
            graph-slug="project_assessment"
            node-alias="location_description"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details?.aliased_data?.project_site?.aliased_data
                    .location_description
            "
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details?.aliased_data?.project_site?.aliased_data
                    .geometry_qualifier
            "
            graph-slug="project_assessment"
            node-alias="geometry_qualifier"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details.aliased_data?.project_site?.aliased_data
                    .multiple_geometry_qualifier
            "
            graph-slug="project_assessment"
            node-alias="multiple_geometry_qualifier"
        />
    </div>
    <div>{{ ipa }}</div>
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
