import type { LanguageValue } from '@/arches_component_lab/datatypes/string/types.ts';
import type { AliasedNodeData } from '*.ts';

export const blankStringValue = function () {
    return {
        display_value: '',
        node_value: {} as Record<string, LanguageValue>,
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
