<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import InputText from 'primevue/inputtext';
import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import { Form, FormField, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import ConceptSelect from '@/bcgov_arches_common/components/ConceptSelect/ConceptSelect.vue';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { ProjectDetailsSchema } from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';

const ipa = inject<IPA>('ipa');

if (!ipa) {
    throw new Error('IPA instance not provided.');
}

const projectLocationForm: Ref<FormInstance | null> = useTemplateRef(
    'projectLocationForm',
) as Ref<FormInstance | null>;
const zodLocationDescriptionResolver = zodResolver(
    ProjectDetailsSchema.shape.locationDescription,
);
const zodGeometryQualifierResolver = zodResolver(
    ProjectDetailsSchema.shape.geometryQualifier,
);
const zodMultipleGeometryQualifierResolver = zodResolver(
    ProjectDetailsSchema.shape.multipleGeometryQualifier,
);
const isValid = () => {
    return projectLocationForm.value?.valid;
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectLocationForm"
        v-slot="$form"
        name="projectLocationForm"
        :validateOnBlur="true"
    >
        <FormField
            :resolver="zodLocationDescriptionResolver"
            name="locationDescription"
        >
            <div class="formfield-margin-bottom">
                <LabelledInput
                    label="Location Description"
                    hint="Provide geographic names and distances -- e.g., A River, 3km north of Highway XX crossing"
                    input-name="locationDescription"
                    :error-message="$form.locationDescription?.error?.message"
                    :required="true"
                >
                    <InputText
                        id="locationDescription"
                        ref="locationDescriptionField"
                        v-model="ipa.projectDetails.locationDescription"
                        aria-describedby="location-description-help"
                        aria-required="true"
                        fluid
                        placeholder="Enter a description of the project location(s)"
                        class="inline-block"
                    />
                </LabelledInput>
            </div>
        </FormField>
        <FormField
            :resolver="zodGeometryQualifierResolver"
            name="geometryQualifier"
        >
            <div class="formfield-margin-bottom">
                <LabelledInput
                    label="Geometry Qualifier"
                    hint="Select the meaning of the geometry"
                    input-name="geometryQualifier"
                    :error-message="$form.geometryQualifier?.error?.message"
                >
                    <ConceptSelect
                        id="geometryQualifier"
                        ref="geometryQualifierField"
                        v-model="ipa.projectDetails.geometryQualifier"
                        graph-slug="project_assessment"
                        node-alias="geometry_qualifier"
                    />
                </LabelledInput>
            </div>
        </FormField>
        <FormField
            :resolver="zodMultipleGeometryQualifierResolver"
            name="multipleGeometryQualifier"
        >
            <div class="formfield-margin-bottom">
                <LabelledInput
                    label="Multiple Geometry Qualifier"
                    hint="If the project has more than one area, add any qualifying remarks here"
                    input-name="multipleGeometryQualifier"
                    :error-message="
                        $form.multipleGeometryQualifier?.error?.message
                    "
                >
                    <InputText
                        id="multipleGeometryQualifier"
                        ref="multipleGeometryQualifierField"
                        v-model="ipa.projectDetails.multipleGeometryQualifier"
                        aria-describedby="multiple-geometry-qualifier-help"
                        aria-required="true"
                        fluid
                        placeholder="Multiple Geometry Qualifiers"
                        class="inline-block"
                    />
                </LabelledInput>
            </div>
        </FormField>
    </Form>
</template>

<style>
.inline-block {
    display: inline-block;
    width: unset;
}
</style>
