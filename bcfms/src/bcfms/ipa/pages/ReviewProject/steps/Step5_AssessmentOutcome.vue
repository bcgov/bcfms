<script setup lang="ts">
import { inject } from 'vue';
import type { Ref } from 'vue';
import Message from 'primevue/message';
import type { ErrorMessage } from '@/bcfms/types.ts';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { VIEW } from '@/arches_component_lab/widgets/constants.ts';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';

const ipa = inject<Ref<IPA>>('ipa');

defineProps<{
    submissionErrors: ErrorMessage[];
}>();

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
        <section
            v-if="submissionErrors && submissionErrors.length"
            class="mt-4"
        >
            <h3>Submission Errors</h3>
            <div>
                <Message
                    v-for="(error, index) in submissionErrors"
                    :key="index"
                    severity="error"
                    :closable="false"
                >
                    <div>
                        <span>{{ error.error }}</span>
                        <span>({{ error.type }})</span>
                    </div>
                    <div>
                        {{ error.message }}
                    </div>
                </Message>
            </div>
        </section>

        <p class="p-margin-top-bottom">
            Please review the entered information prior to submitting the
            application:
        </p>
        <p class="p-underline-bold">Filing Details</p>
        <div
            v-if="
                ipa?.aliased_data?.assessment_details?.aliased_data
                    ?.assessment_start_date.display_value
            "
            class="div-grid-cols"
        >
            <div>Submission Date</div>
            <div>
                {{
                    ipa?.aliased_data?.assessment_details?.aliased_data
                        ?.assessment_start_date.display_value
                }}
            </div>
        </div>

        <div
            v-if="
                ipa?.aliased_data?.assessment_details?.aliased_data?.ipa_number
                    ?.display_value
            "
            class="div-grid-cols"
        >
            <div class="div-grid-cols">Reference Number</div>
            <div class="div-grid-cols">
                {{
                    ipa?.aliased_data?.assessment_details?.aliased_data
                        ?.ipa_number?.display_value
                }}
            </div>
        </div>
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.aliased_data?.initial_project_review?.aliased_data
                    ?.assessment_start_date
            "
            graph-slug="project_assessment"
            node-alias="assessment_start_date"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.aliased_data?.initial_project_review?.aliased_data
                    ?.assessment_completion_date
            "
            graph-slug="project_assessment"
            node-alias="assessment_completion_date"
        />
        <!-- GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.initial_project_review?.aliased_data?.intersects_ifa
            "
            graph-slug="project_assessment"
            node-alias="intersects_ifa"
        /-->
        <div
            class="widget div-grid-cols"
            data-graph-slug="project_assessment"
            data-node-alias="intersects_ifa"
        >
            <label
                class="widget-label"
                for="proximity_to_fos"
            >
                <div
                    style="display: flex"
                    data-pd-tooltip="true"
                >
                    <span data-v-ed582886=""
                        >Intersects with Important Fossil Area</span
                    >
                    <!--v-if-->
                </div> </label
            ><!--v-if-->
            <div>
                {{
                    ipa?.aliased_data?.initial_project_review?.aliased_data
                        ?.intersects_ifa?.node_value
                        ? 'Yes'
                        : 'No'
                }}
            </div>
        </div>
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.aliased_data?.initial_project_review?.aliased_data
                    ?.proximity_to_fos
            "
            graph-slug="project_assessment"
            node-alias="proximity_to_fos"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.aliased_data?.initial_project_review?.aliased_data
                    ?.ground_disturbance
            "
            graph-slug="project_assessment"
            node-alias="ground_disturbance"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.aliased_data?.initial_project_review?.aliased_data
                    ?.metamorphic_rock
            "
            graph-slug="project_assessment"
            node-alias="metamorphic_rock"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.aliased_data?.initial_project_review?.aliased_data
                    ?.igneous_rock
            "
            graph-slug="project_assessment"
            node-alias="igneous_rock"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.aliased_data?.initial_project_review?.aliased_data
                    ?.sedimentary_rock
            "
            graph-slug="project_assessment"
            node-alias="sedimentary_rock"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.aliased_data?.initial_project_review?.aliased_data
                    ?.quaternary_deposits
            "
            graph-slug="project_assessment"
            node-alias="quaternary_deposits"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.aliased_data?.initial_project_review?.aliased_data?.frpr
            "
            graph-slug="project_assessment"
            node-alias="frpr"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.aliased_data?.initial_project_review?.aliased_data
                    ?.initial_review_level_of_risk
            "
            graph-slug="project_assessment"
            node-alias="initial_review_level_of_risk"
        />
        <GenericWidget
            class="div-grid-cols"
            :mode="VIEW"
            :aliased-node-data="
                ipa?.aliased_data?.initial_project_review?.aliased_data
                    ?.initial_review_internal_notes
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
    grid-template-columns: repeat(1, minmax(0, 1fr) 2fr);
}
</style>
