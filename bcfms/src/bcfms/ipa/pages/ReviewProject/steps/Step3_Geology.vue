<script setup lang="ts">
import { useTemplateRef, inject, ref } from 'vue';
import type { Ref } from 'vue';

import LabelledInput from '@/bcgov_arches_common/components/labelledinput/LabelledInput.vue';
import { Form, FormField, type FormInstance } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { InitialProjectReviewSchema } from '@/bcfms/ipa/schema/InitialProjectReviewSchema.ts';
import GenericWidget from '@/arches_component_lab/generics/GenericWidget/GenericWidget.vue';
import { EDIT } from '@/arches_component_lab/widgets/constants.ts';
import { blankConceptValue } from '@/arches_component_lab/datatypes/concept/utils.ts';

const ipa = inject<IPA>('ipa');
const blankMetamorphicRock = ref(blankConceptValue());
const blankIgneousRock = ref(blankConceptValue());
const blankSedimentaryRock = ref(blankConceptValue());
const blankQuaternaryDeposits = ref(blankConceptValue());

if (!ipa) {
    throw new Error('IPA instance not provided.');
}

const projectGeologyForm: Ref<FormInstance | null> = useTemplateRef(
    'projectGeologyForm',
) as Ref<FormInstance | null>;
const zodMetamorphicRockResolver = zodResolver(
    InitialProjectReviewSchema.shape.metamorphicRock,
);
const zodIgneousRockResolver = zodResolver(
    InitialProjectReviewSchema.shape.igneousRock,
);
const zodSedimentaryRockResolver = zodResolver(
    InitialProjectReviewSchema.shape.sedimentaryRock,
);
const zodQuaternarySedimentsResolver = zodResolver(
    InitialProjectReviewSchema.shape.quaternarySediments,
);
const isValid = () => {
    return (
        (projectGeologyForm.value?.valid &&
            !(
                projectGeologyForm.value?.states.metamorphicRock.pristine ||
                projectGeologyForm.value?.states.igneousRock.pristine ||
                projectGeologyForm.value?.states.sedimentaryRock.pristine ||
                projectGeologyForm.value?.states.quaternarySediments.pristine
            )) ||
        ((ipa as any).value?.initialProjectReview.metamorphicRock &&
            (ipa as any).value?.initialProjectReview.igneousRock &&
            (ipa as any).value?.initialProjectReview.sedimentaryRock &&
            (ipa as any).value?.initialProjectReview.quaternarySediments)
    );
};

defineExpose({ isValid });
</script>
<template>
    <Form
        ref="projectGeologyForm"
        v-slot="$form"
        name="projectGeologyForm"
        :validateOnBlur="true"
        :resolver="zodResolver(InitialProjectReviewSchema)"
    >
        <FormField
            :resolver="zodMetamorphicRockResolver"
            name="metamorphicRock"
        >
            <LabelledInput
                label="Metamorphic Rock"
                hint="Select option to best describe metamorphic rock, if present"
                input-name="metamorphicRock"
                :error-message="$form.metamorphicRock?.error?.message"
                :required="true"
            >
                <GenericWidget
                    :mode="EDIT"
                    :should-show-label="false"
                    :aliased-node-data="blankMetamorphicRock"
                    placeholder="Select Metamorphic Rock"
                    graph-slug="project_assessment"
                    node-alias="metamorphic_rock"
                />
            </LabelledInput>
        </FormField>
        <FormField
            :resolver="zodIgneousRockResolver"
            name="igneousRock"
        >
            <LabelledInput
                label="Igneous Rock"
                hint="Select option to best describe igneous rock, if present"
                input-name="igneousRock"
                :error-message="$form.igneousRock?.error?.message"
                :required="true"
            >
                <GenericWidget
                    :mode="EDIT"
                    :aliased-node-data="blankIgneousRock"
                    :should-show-label="false"
                    placeholder="Select Igneous Rock"
                    graph-slug="project_assessment"
                    node-alias="igneous_rock"
                />
            </LabelledInput>
        </FormField>
        <FormField
            :resolver="zodSedimentaryRockResolver"
            name="sedimentaryRock"
        >
            <LabelledInput
                label="Sedimentary Rock"
                hint="Select option to best describe sedimentary rock, if present"
                input-name="sedimentaryRock"
                :error-message="$form.sedimentaryRock?.error?.message"
                :required="true"
            >
                <GenericWidget
                    :mode="EDIT"
                    :aliased-node-data="blankSedimentaryRock"
                    :should-show-label="false"
                    placeholder="Select Sedimentary Rock"
                    graph-slug="project_assessment"
                    node-alias="sedimentary_rock"
                />
            </LabelledInput>
        </FormField>
        <FormField
            :resolver="zodQuaternarySedimentsResolver"
            name="quaternarySediments"
        >
            <LabelledInput
                label="Quaternary Sediments"
                hint="Select option to best describe quaternary sediments, if present"
                input-name="quaternarySediments"
                :error-message="$form.quaternarySediments?.error?.message"
                :required="true"
            >
                <GenericWidget
                    :mode="EDIT"
                    :aliased-node-data="blankQuaternaryDeposits"
                    :should-show-label="false"
                    placeholder="Select Quaternary Sediments"
                    graph-slug="project_assessment"
                    node-alias="quaternary_deposits"
                />
            </LabelledInput>
        </FormField>
    </Form>
</template>
