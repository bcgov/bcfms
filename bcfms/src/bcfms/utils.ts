import type { Ref } from 'vue';
import type { LanguageValue } from '@/arches_component_lab/datatypes/string/types.ts';
import type { AliasedNodeData } from '@/arches_component_lab/types.ts';
import type { AnyZodObject } from 'zod';
import type { FormInstance } from '@primevue/forms';

export type FieldError = { type?: string; message: string };

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
    form.value.validate(attribute_name).then((result) => {
        if (result?.errors?.[attribute_name]?.length ?? 0 > 0) {
            console.log(result.errors[attribute_name]);
        } else {
            dataObject[attribute_name] = newValue;
        }
    });
};

// Zod reports errors with keys like "project_name.node_value.en.value". Want to flatten them at the top so they can
// be applied like $form.project_name.error.message
export function collapseFieldNames(
    nestedErrors: Record<string, FieldError[]>,
    options: { dedupe?: boolean; aggregate?: boolean } = {
        dedupe: true,
        aggregate: false,
    },
): Record<string, FieldError[]> {
    const out: Record<string, FieldError[]> = {};

    for (const [path, errs] of Object.entries(nestedErrors)) {
        const top = path.split('.')[0]; // "project_name"
        if (!errs?.length) continue;

        if (!out[top]) out[top] = [];

        if (options.aggregate) {
            // push all messages (optionally dedupe)
            for (const e of errs) {
                if (
                    !options.dedupe ||
                    !out[top].some((x) => x.message === e.message)
                ) {
                    out[top].push({ type: e.type, message: e.message });
                }
            }
        } else {
            // keep only the first nested error for a concise summary
            const first = errs[0];
            if (
                !options.dedupe ||
                !out[top].some((x) => x.message === first.message)
            ) {
                out[top].push({ type: first.type, message: first.message });
            }
        }
    }

    return out;
}
