<script setup lang="ts">
import { useTemplateRef, inject, computed, watch } from 'vue';
import type { Ref } from 'vue';

import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
import { Form, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import Message from 'primevue/message';

// @ts-ignore
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import {
    ProjectDetailsSchema,
    ProjectDateValidationSchema,
} from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';
import type { AliasedNodeData } from '@/arches_component_lab/types.ts';
import {
    isValid as baseIsValid,
    updateModelValue as baseUpdateModelValue,
} from '@/bcfms/utils.ts';
import { getFlattenResolver } from '@/bcgov_arches_common/validation-utils.ts';

const ipa = inject<Ref<IPA>>('ipa');
const emit = defineEmits(['update:stepIsValid']);

if (!ipa || !ipa.value) {
    throw new Error('IPA instance not provided.');
}

const projectDetailsForm: Ref<FormInstance | null> = useTemplateRef(
    'projectDetailsForm',
) as Ref<FormInstance | null>;

const projectDetailsResolver = getFlattenResolver(
    zodResolver(ProjectDetailsSchema.shape['aliased_data']),
);

const isValid = () => {
    const isBaseValid = baseIsValid(
        projectDetailsForm as Ref<FormInstance>,
        ProjectDetailsSchema.shape['aliased_data'],
    );

    const data = ipa.value?.aliased_data?.project_details?.aliased_data;
    let areDatesValid = true;

    if (data) {
        areDatesValid = ProjectDateValidationSchema.safeParse(data).success;
    }

    return isBaseValid && areDatesValid;
};

watch(
    () => ipa.value?.aliased_data?.project_details?.aliased_data,
    () => {
        const validState = isValid();
        emit('update:stepIsValid', validState);
    },
    { deep: true, immediate: true },
);

const updateModelValue = function (
    newValue: AliasedNodeData,
    attribute_name: string,
) {
    baseUpdateModelValue(
        newValue,
        attribute_name,
        ipa.value.aliased_data?.project_details?.aliased_data,
        projectDetailsForm as Ref<FormInstance>,
    );
};

const dateErrorMessage = computed(() => {
    const data = ipa.value?.aliased_data?.project_details?.aliased_data;
    if (!data) return '';

    const result = ProjectDateValidationSchema.safeParse(data);
    if (!result.success) {
        return result.error.issues[0]?.message || '';
    }
    return '';
});

defineExpose({ isValid });
</script>

<template>
    <Form
        ref="projectDetailsForm"
        name="projectDetailsForm"
        :validateOnBlur="true"
        :validateOnValueUpdate="true"
        :resolver="projectDetailsResolver"
    >
        <LabelledInput
            hint="Enter a specific project name, in sentence case, that includes the geographic location and project type"
            input-name="projectName"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="
                    ipa?.aliased_data?.project_details?.aliased_data
                        ?.project_name
                "
                graph-slug="project_assessment"
                node-alias="project_name"
                @update:value="updateModelValue($event, 'project_name')"
            />
        </LabelledInput>
        <LabelledInput
            hint="Select the organization or individual initiating the assessment"
            input-name="projectInitiator"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="
                    ipa?.aliased_data?.project_details?.aliased_data
                        ?.project_initiator
                "
                graph-slug="project_assessment"
                node-alias="project_initiator"
                @update:value="updateModelValue($event, 'project_initiator')"
            />
        </LabelledInput>
        <LabelledInput
            label="Industry Company / Individual / Organization"
            hint="Enter the name of Company / Individual / Organization that is responsible for executing the project"
            input-name="industryCompanyName"
            :required="true"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="
                    ipa?.aliased_data?.project_details?.aliased_data
                        ?.industry_company_name
                "
                graph-slug="project_assessment"
                node-alias="industry_company_name"
                :should-show-label="false"
                @update:value="
                    updateModelValue($event, 'industry_company_name')
                "
            />
        </LabelledInput>
        <div class="flex-row flex-gap">
            <div class="agency-col">
                <LabelledInput
                    hint="Select the Agency that is authorizing the project"
                    input-name="projectAuthorizingAgency"
                >
                    <GenericWidget
                        :mode="EDIT"
                        :aliased-node-data="
                            ipa?.aliased_data?.project_details?.aliased_data
                                ?.project_authorizing_agency
                        "
                        graph-slug="project_assessment"
                        node-alias="project_authorizing_agency"
                        @update:value="
                            updateModelValue(
                                $event,
                                'project_authorizing_agency',
                            )
                        "
                    />
                </LabelledInput>
            </div>

            <div
                v-if="
                    ipa?.aliased_data?.project_details?.aliased_data
                        ?.project_authorizing_agency?.display_value ===
                    'Front Counter BC (FCBC)'
                "
                class="land-act-col"
            >
                <LabelledInput>
                    <GenericWidget
                        :mode="EDIT"
                        :aliased-node-data="
                            ipa?.aliased_data?.project_details?.aliased_data
                                ?.land_act_file_number
                        "
                        graph-slug="project_assessment"
                        node-alias="land_act_file_number"
                        placeholder="Land Act Number"
                        @update:value="
                            updateModelValue($event, 'land_act_file_number')
                        "
                    />
                </LabelledInput>
            </div>
        </div>
        <div class="flex-row">
            <div class="formfield-flex-grow">
                <LabelledInput
                    label="Estimated Project Start Date"
                    hint="Enter the estimated start date"
                    input-name="projectStartDate"
                >
                    <GenericWidget
                        :mode="EDIT"
                        :should-show-label="false"
                        :aliased-node-data="
                            ipa?.aliased_data?.project_details?.aliased_data
                                ?.project_start_date
                        "
                        graph-slug="project_assessment"
                        node-alias="project_start_date"
                        placeholder="Project Start Date"
                        @update:value="
                            updateModelValue($event, 'project_start_date')
                        "
                /></LabelledInput>
            </div>
            <div class="formfield-flex-grow">
                <LabelledInput
                    label="Estimated Project End Date"
                    hint="Enter the completion date if known"
                    input-name="project_end_date"
                >
                    <GenericWidget
                        :mode="EDIT"
                        :should-show-label="false"
                        :aliased-node-data="
                            ipa?.aliased_data?.project_details?.aliased_data
                                ?.project_end_date
                        "
                        graph-slug="project_assessment"
                        node-alias="project_end_date"
                        placeholder="Project End Date"
                        @update:value="
                            updateModelValue($event, 'project_end_date')
                        "
                    />
                    <Message
                        v-if="dateErrorMessage"
                        severity="error"
                        size="small"
                        class="mt-1"
                        :closable="false"
                    >
                        {{ dateErrorMessage }}
                    </Message>
                </LabelledInput>
            </div>
        </div>
    </Form>
</template>

<style>
.inline-block {
    display: inline-block;
    width: unset;
}

.flex-row {
    display: flex;
    flex-direction: row;
}

.formfield-flex-grow {
    flex-grow: 2;
    margin-right: 1rem;
    max-width: calc(50% - 0.5rem);
}

.datepicker-width {
    width: 85%;
}

.flex-gap {
    gap: 1rem;
    width: 100%;
}

.agency-col {
    flex: 3;
    min-width: 0;
}

.land-act-col {
    flex: 1;
    min-width: 0;
}
</style>
