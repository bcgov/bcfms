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
    <div>
        <p class="step-title">Project Assessment Details</p>
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="ipa?.project_details.assessment_start_date"
            graph-slug="project_assessment"
            node-alias="assessment_start_date"
        />
        -
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="ipa?.project_details.assessment_completion_date"
            graph-slug="project_assessment"
            node-alias="assessment_completion_date"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="ipa?.project_details.intersects_ifa"
            graph-slug="project_assessment"
            node-alias="intersects_ifa"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="ipa?.project_details.proximity_to_fos"
            graph-slug="project_assessment"
            node-alias="proximity_to_fos"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="ipa?.project_details.ground_disturbance"
            graph-slug="project_assessment"
            node-alias="ground_disturbance"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="ipa?.project_details.metamorphic_rock"
            graph-slug="project_assessment"
            node-alias="metamorphic_rock"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="ipa?.project_details.igneous_rock"
            graph-slug="project_assessment"
            node-alias="igneous_rock"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="ipa?.project_details.sedimentary_rock"
            graph-slug="project_assessment"
            node-alias="sedimentary_rock"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="ipa?.project_details.quaternary_deposits"
            graph-slug="project_assessment"
            node-alias="quaternary_deposits"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="ipa?.project_details.frpr"
            graph-slug="project_assessment"
            node-alias="frpr"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details.initial_review_level_of_risk
            "
            graph-slug="project_assessment"
            node-alias="initial_review_level_of_risk"
        />
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details.initial_review_internal_notes
            "
            graph-slug="project_assessment"
            node-alias="initial_review_internal_notes"
        />
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
</style>
