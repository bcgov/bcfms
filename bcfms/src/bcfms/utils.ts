import type { Ref } from 'vue';
import type { LanguageValue } from '@/arches_component_lab/datatypes/string/types.ts';
import { ProjectDetailsSchema } from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';
import type { AliasedNodeData } from '@/arches_component_lab/types.ts';
import type { AnyZodObject } from 'zod';
import type { FormInstance } from '@primevue/forms';

export const blankStringValue = function () {
    return {
        display_value: '',
        node_value: { en: { value: '', direction: 'ltr' } } as Record<
            string,
            LanguageValue
        >,
        details: [] as never[],
    };
};

export const blankResourceInstanceValue = function () {
    return {
        display_value: '',
        node_value: null,
        details: [],
    };
};

export const blankDateValue = function () {
    return {
        display_value: '',
        node_value: null,
        details: [] as never[],
    };
};

export const currentDateValue = function () {
    return {
        display_value: '',
        node_value: new Date().toISOString().split('T')[0],
        details: [] as never[],
    };
};

export const isValid = (form: Ref<FormInstance>, schema: AnyZodObject) => {
    if (!form.value) return false;

    const formStates = form?.value?.states;
    const fields = Object.keys(form.value.states);

    const allValid = fields.every(
        (field) =>
            schema.shape[field].safeParse(formStates?.[field]?.value).success,
    );
    return allValid;
};

export const updateModelValue = function (
    newValue: AliasedNodeData,
    attribute_name: string,
    dataObject: Record<string, any>,
    form: Ref<FormInstance>,
) {
    console.log('updateModelValue', attribute_name, newValue);
    if (dataObject[attribute_name] === newValue) return;

    const validator = ProjectDetailsSchema.shape[attribute_name];
    const result = validator.safeParse(newValue);

    if (result.success) {
        dataObject[attribute_name] = result.data;
        form.value.states[attribute_name].error = null;
    } else {
        if (form) {
            console.log(result.error.issues[0].message);
            form.value.states[attribute_name].error = {
                key: result.error.issues[0].code,
                message: result.error.issues[0].message,
            };
            // result.error;
        }
    }
};
