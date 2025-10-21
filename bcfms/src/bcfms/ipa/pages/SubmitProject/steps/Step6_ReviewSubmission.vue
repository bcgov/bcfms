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
    <div class="review_submit_page">
        <div class="step-title">Submission Details</div>
        <section
            v-if="submissionErrors && submissionErrors.length"
            class="mt-4"
        >
            <h3 class="text-lg font-semibold mb-2 text-red-600">
                Submission Errors
            </h3>

            <div class="flex flex-col gap-2">
                <Message
                    v-for="(error, index) in submissionErrors"
                    :key="index"
                    severity="error"
                    :closable="false"
                >
                    <div
                        class="flex flex-col sm:flex-row sm:items-center gap-1"
                    >
                        <span class="font-medium">{{ error.error }}</span>
                        <span class="text-sm text-gray-600"
                            >({{ error.type }})</span
                        >
                    </div>
                    <div class="text-sm">
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
                ipa?.assessment_details?.aliased_data?.assessment_start_date
                    .display_value
            "
            class="div-grid-cols"
        >
            <div>Submission Date</div>
            <div>
                {{
                    ipa?.assessment_details?.aliased_data?.assessment_start_date
                        .display_value
                }}
            </div>
        </div>

        <div
            v-if="
                ipa?.assessment_details?.aliased_data?.ipa_number?.display_value
            "
            class="div-grid-cols"
        >
            <div>Reference Number</div>
            <div>
                {{
                    ipa?.assessment_details?.aliased_data?.ipa_number
                        ?.display_value
                }}
            </div>
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
        <GenericWidget
            :mode="VIEW"
            :aliased-node-data="
                ipa?.project_details.aliased_data?.project_documents
                    ?.aliased_data.project_documents
            "
            graph-slug="project_assessment"
            node-alias="project_documents"
        />
    </div>
</template>
<style>
[data-node-alias='project_documents'] {
    max-width: 200px;
    max-height: 200px;
    object-fit: contain;
}
</style>
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
