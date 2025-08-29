<script setup lang="ts">
import { useTemplateRef, inject, ref } from 'vue';
import type { Ref } from 'vue';

import InputText from 'primevue/inputtext';
import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import { Form, FormField, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { ProjectDetailsSchema } from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
import { blankConceptValue } from '@/arches_component_lab/datatypes/concept/utils.ts';

const ipa = inject<IPA>('ipa');

if (!ipa) {
    throw new Error('IPA instance not provided.');
}

const blankGeometryQualifier = ref(blankConceptValue());

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
    return (
        (projectLocationForm.value?.valid &&
            !projectLocationForm.value?.states.locationDescription.pristine) ||
        (ipa as any).value?.projectDetails.locationDescription
    );
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
        </FormField>
        <FormField
            :resolver="zodGeometryQualifierResolver"
            name="geometryQualifier"
        >
            <LabelledInput
                label="Geometry Qualifier"
                hint="Select the meaning of the geometry"
                input-name="geometryQualifier"
                :error-message="$form.geometryQualifier?.error?.message"
            >
                <GenericWidget
                    :mode="EDIT"
                    :should-show-label="false"
                    :aliased-node-data="blankGeometryQualifier"
                    graph-slug="project_assessment"
                    node-alias="geometry_qualifier"
                />
            </LabelledInput>
        </FormField>
        <FormField
            :resolver="zodMultipleGeometryQualifierResolver"
            name="multipleGeometryQualifier"
        >
            <LabelledInput
                label="Multiple Geometry Qualifier"
                hint="If the project has more than one area, add any qualifying remarks here"
                input-name="multipleGeometryQualifier"
                :error-message="$form.multipleGeometryQualifier?.error?.message"
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
        </FormField>
    </Form>
</template>

<style>
.inline-block {
    display: inline-block;
    width: unset;
}
</style>
