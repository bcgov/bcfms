<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
import { Form, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
// @ts-ignore
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { ProjectDetailsSchema } from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';
import type { AliasedNodeData } from '@/arches_component_lab/types.ts';
import {
    isValid as baseIsValid,
    updateModelValue as baseUpdateModelValue,
} from '@/bcfms/utils.ts';

const ipa = inject<Ref<IPA>>('ipa');

const emit = defineEmits(['update:stepIsValid']);

if (!ipa || !ipa.value) {
    throw new Error('IPA instance not provided.');
}

const projectDetailsForm: Ref<FormInstance | null> = useTemplateRef(
    'projectDetailsForm',
) as Ref<FormInstance | null>;

const isValid = () => {
    return baseIsValid(
        projectDetailsForm as Ref<FormInstance>,
        ProjectDetailsSchema,
    );
};

const updateModelValue = function (
    newValue: AliasedNodeData,
    attribute_name: string,
) {
    baseUpdateModelValue(
        newValue,
        attribute_name,
        ipa.value.projectDetails,
        projectDetailsForm as Ref<FormInstance>,
    );
    emit('update:stepIsValid', isValid());
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectDetailsForm"
        name="projectDetailsForm"
        :validateOnBlur="true"
        :resolver="zodResolver(ProjectDetailsSchema)"
    >
        <LabelledInput
            hint="Enter a specific project name, in sentence case, that includes the geographic location and project type"
            input-name="projectName"
            :error-message="
                projectDetailsForm?.fields?.project_name?.error?.message
            "
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="ipa?.projectDetails.project_name"
                graph-slug="project_assessment"
                node-alias="project_name"
                @update:value="updateModelValue($event, 'project_name')"
            />
        </LabelledInput>
        <LabelledInput
            hint="Select the organization or individual initiating the assessment"
            input-name="projectInitiator"
            :error-message="
                projectDetailsForm?.fields?.project_initiator?.error?.message
            "
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="ipa?.projectDetails.project_initiator"
                graph-slug="project_assessment"
                node-alias="project_initiator"
                @update:value="updateModelValue($event, 'project_initiator')"
            />
        </LabelledInput>
        <LabelledInput
            label="Industry Company / Individual / Organization"
            hint="Enter the name of Company / Individual / Organization that is responsible for executing the project"
            input-name="industryCompanyName"
            :error-message="
                projectDetailsForm?.getFieldState('industry_company_name')
                    ?.error?.message
            "
            :required="true"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="ipa?.projectDetails.industry_company_name"
                graph-slug="project_assessment"
                node-alias="industry_company_name"
                :should-show-label="false"
                @update:value="
                    updateModelValue($event, 'industry_company_name')
                "
            />
        </LabelledInput>
        <LabelledInput
            label="Authorizing Agency"
            hint="Select the Agency that is authorizing the project"
            input-name="projectAuthorizingAgency"
            :error-message="
                projectDetailsForm?.fields?.project_authorizing_agency?.error
                    ?.message
            "
            :required="true"
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="
                    ipa?.projectDetails.project_authorizing_agency
                "
                graph-slug="project_assessment"
                node-alias="project_authorizing_agency"
                :should-show-label="false"
                @update:value="
                    updateModelValue($event, 'project_authorizing_agency')
                "
            />
        </LabelledInput>
        <LabelledInput
            input-name="landActFileNumber"
            :error-message="
                projectDetailsForm?.fields?.land_act_file_number?.error?.message
            "
        >
            <GenericWidget
                :mode="EDIT"
                :aliased-node-data="ipa?.projectDetails?.land_act_file_number"
                graph-slug="project_assessment"
                node-alias="land_act_file_number"
                placeholder="Land Act Number"
                @update:value="updateModelValue($event, 'land_act_file_number')"
            />
        </LabelledInput>
        <div class="flex-row">
            <div class="formfield-flex-grow">
                <GenericWidget
                    :mode="EDIT"
                    :aliased-node-data="ipa?.projectDetails.project_start_date"
                    graph-slug="project_assessment"
                    node-alias="project_start_date"
                    placeholder="Project Start Date"
                    @update:value="
                        updateModelValue($event, 'project_start_date')
                    "
                />
            </div>
            <div class="formfield-flex-grow">
                <GenericWidget
                    :mode="EDIT"
                    :aliased-node-data="ipa?.projectDetails.project_end_date"
                    graph-slug="project_assessment"
                    node-alias="project_end_date"
                    placeholder="Project End Date"
                    @update:value="updateModelValue($event, 'project_end_date')"
                />
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
}

.datepicker-width {
    width: 85%;
}
</style>
