<script setup lang="ts">
import { useTemplateRef, inject } from 'vue';
import type { Ref } from 'vue';

import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import { Form, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { ProjectDetailsSchema } from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
import {
    isValid as baseIsValid,
    updateModelValue as baseUpdateModelValue,
} from '@/bcfms/utils.ts';
import type { AliasedNodeData } from '@/arches_component_lab/types.ts';
import { getFlattenResolver } from '@/bcgov_arches_common/validation-utils.ts';

const ipa = inject<Ref<IPA>>('ipa');

if (!ipa || !ipa.value) {
    throw new Error('IPA instance not provided.');
}

const emit = defineEmits(['update:stepIsValid']);

const projectLocationForm: Ref<FormInstance | null> = useTemplateRef(
    'projectLocationForm',
) as Ref<FormInstance | null>;

const projectLocationResolver = getFlattenResolver(
    zodResolver(ProjectDetailsSchema),
);

const isValid = () => {
    return baseIsValid(
        projectLocationForm as Ref<FormInstance>,
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
        ipa.value.project_details.aliased_data.project_site.aliased_data,
        projectLocationForm as Ref<FormInstance>,
    );
    emit('update:stepIsValid', isValid());
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectLocationForm"
        name="projectLocationForm"
        :validateOnBlur="true"
        :validateOnValueUpdate="true"
        :resolver="projectLocationResolver"
    >
        <div>Need to add map</div>
        <LabelledInput
            hint="Provide geographic names and distances -- e.g., A River, 3km north of Highway XX crossing"
            input-name="locationDescription"
        >
            <GenericWidget
                graph-slug="project_assessment"
                node-alias="location_description"
                :mode="EDIT"
                :aliased-node-data="
                    ipa?.project_details.aliased_data?.project_site
                        ?.aliased_data.location_description
                "
                @update:value="updateModelValue($event, 'location_description')"
            />
        </LabelledInput>
        <LabelledInput
            label="Geometry Qualifier"
            hint="Select the meaning of the geometry"
            input-name="geometryQualifier"
        >
            <GenericWidget
                :mode="EDIT"
                :should-show-label="false"
                :aliased-node-data="
                    ipa?.project_details.aliased_data?.project_site
                        ?.aliased_data.geometry_qualifier
                "
                graph-slug="project_assessment"
                node-alias="geometry_qualifier"
                @update:value="updateModelValue($event, 'geometry_qualifier')"
            />
        </LabelledInput>
        <LabelledInput
            label="Multiple Geometry Qualifier"
            hint="If the project has more than one area, add any qualifying remarks here"
            input-name="multipleGeometryQualifier"
        >
            <GenericWidget
                :mode="EDIT"
                :should-show-label="false"
                :aliased-node-data="
                    ipa?.project_details.aliased_data?.project_site.aliased_data
                        ?.multiple_geometry_qualifier
                "
                graph-slug="project_assessment"
                node-alias="multiple_geometry_qualifier"
                @update:value="
                    updateModelValue($event, 'multiple_geometry_qualifier')
                "
            />
        </LabelledInput>
    </Form>
</template>

<style>
.inline-block {
    display: inline-block;
    width: unset;
}
</style>
