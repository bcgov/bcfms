import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import type { Ref } from 'vue';

// ─── module mocks (hoisted automatically by Vitest) ─────────────────────────

// vi.hoisted runs before vi.mock factories, ensuring the variables are
// initialised before the factory closures capture them.
const { mockIsValid, mockUpdateModelValue } = vi.hoisted(() => ({
    mockIsValid: vi.fn(() => true),
    mockUpdateModelValue: vi.fn(),
}));

vi.mock('@/bcfms/utils.ts', () => ({
    isValid: mockIsValid,
    updateModelValue: mockUpdateModelValue,
}));

vi.mock('@/bcgov_arches_common/validation-utils.ts', () => ({
    getFlattenResolver:
        vi.fn(
            (resolver: unknown) =>
                resolver,
        ),
}));

vi.mock('@primevue/forms/resolvers/zod', () => ({
    zodResolver: vi.fn(() => async () => ({ errors: {} })),
}));

vi.mock('@/bcgov_arches_common/datatypes/string/validation/utils.ts', () => ({
    htmlToPlainText: vi.fn((html: string) => html.replace(/<[^>]+>/g, '')),
}));

// ─── component import (after mocks) ─────────────────────────────────────────

import Step4_RiskAssessment from './Step4_RiskAssessment.vue';

// ─── stubs ──────────────────────────────────────────────────────────────────

const FormStub = {
    name: 'Form',
    props: ['resolver', 'validateOnBlur', 'validateOnValueUpdate'],
    template: '<form><slot /></form>',
};

const LabelledInputStub = {
    name: 'LabelledInput',
    props: ['label', 'hint', 'inputName', 'required'],
    template: '<div class="labelled-input"><slot /></div>',
};

const GenericWidgetStub = {
    name: 'GenericWidget',
    props: [
        'mode',
        'aliasedNodeData',
        'shouldShowLabel',
        'placeholder',
        'graphSlug',
        'nodeAlias',
        'cardXNodeXWidgetDataOverrides',
    ],
    emits: ['update:value'],
    template: '<div class="generic-widget" />',
};

// ─── IPA fixture ────────────────────────────────────────────────────────────

function makeIpa() {
    return ref({
        aliased_data: {
            initial_project_review: {
                aliased_data: {
                    frpr: { display_value: '', node_value: null, details: [] },
                    initial_review_level_of_risk: {
                        display_value: '',
                        node_value: null,
                        details: [],
                    },
                    initial_review_internal_notes: {
                        display_value: '',
                        node_value: { en: { value: '', direction: 'ltr' } },
                        details: [],
                    },
                },
            },
            assessment_details: {
                aliased_data: {
                    project_requirements: {
                        display_value: '',
                        node_value: null,
                        details: [],
                    },
                    fossil_repository_agreement: {
                        display_value: '',
                        node_value: null,
                        details: [],
                    },
                },
            },
        },
    });
}

// ─── mount helper ────────────────────────────────────────────────────────────

function mountComponent(ipaRef: Ref<unknown> = makeIpa()) {
    return mount(Step4_RiskAssessment, {
        global: {
            provide: { ipa: ipaRef },
            stubs: {
                Form: FormStub,
                LabelledInput: LabelledInputStub,
                GenericWidget: GenericWidgetStub,
            },
        },
    });
}

// ─── tests ───────────────────────────────────────────────────────────────────

describe('Step4_RiskAssessment', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ── guard ──────────────────────────────────────────────────────────────

    describe('injection guard', () => {
        it('throws when ipa is not provided', () => {
            expect(() =>
                mount(Step4_RiskAssessment, {
                    global: {
                        stubs: {
                            Form: FormStub,
                            LabelledInput: LabelledInputStub,
                            GenericWidget: GenericWidgetStub,
                        },
                    },
                }),
            ).toThrow('IPA instance not provided.');
        });

        it('throws when the ipa ref value is falsy', () => {
            expect(() =>
                mount(Step4_RiskAssessment, {
                    global: {
                        provide: { ipa: ref(null) },
                        stubs: {
                            Form: FormStub,
                            LabelledInput: LabelledInputStub,
                            GenericWidget: GenericWidgetStub,
                        },
                    },
                }),
            ).toThrow('IPA instance not provided.');
        });
    });

    // ── rendering ──────────────────────────────────────────────────────────

    describe('rendering', () => {
        it('renders a Form element', () => {
            const wrapper = mountComponent();
            expect(wrapper.findComponent({ name: 'Form' }).exists()).toBe(true);
        });

        it('renders exactly three LabelledInput elements', () => {
            const wrapper = mountComponent();
            expect(
                wrapper.findAllComponents({ name: 'LabelledInput' }),
            ).toHaveLength(3);
        });

        it('renders five GenericWidget elements', () => {
            const wrapper = mountComponent();
            expect(
                wrapper.findAllComponents({ name: 'GenericWidget' }),
            ).toHaveLength(5);
        });

        it('renders the Fossil Resource Potential Ranking label', () => {
            const wrapper = mountComponent();
            const inputs = wrapper.findAllComponents({ name: 'LabelledInput' });
            expect(inputs[0].props('label')).toBe(
                'Fossil Resource Potential Ranking',
            );
        });

        it('renders the Initial Level of Risk label', () => {
            const wrapper = mountComponent();
            const inputs = wrapper.findAllComponents({ name: 'LabelledInput' });
            expect(inputs[1].props('label')).toBe('Initial Level of Risk');
        });

        it('renders the Initial Review Internal Notes label', () => {
            const wrapper = mountComponent();
            const inputs = wrapper.findAllComponents({ name: 'LabelledInput' });
            expect(inputs[2].props('label')).toBe(
                'Initial Review Internal Notes',
            );
        });

        it('marks all LabelledInput fields as required', () => {
            const wrapper = mountComponent();
            const inputs = wrapper.findAllComponents({ name: 'LabelledInput' });
            inputs.forEach((input) => {
                expect(input.props('required')).toBe(true);
            });
        });
    });

    // ── isValid ─────────────────────────────────────────────────────────────

    describe('isValid (exposed)', () => {
        it('is exposed on the component instance', () => {
            const wrapper = mountComponent();
            expect(typeof wrapper.vm.isValid).toBe('function');
        });

        it('returns true when both baseIsValid calls succeed', () => {
            mockIsValid.mockReturnValue(true);
            const wrapper = mountComponent();
            expect(wrapper.vm.isValid()).toBe(true);
        });

        it('returns false when the first baseIsValid call fails', () => {
            mockIsValid.mockReturnValueOnce(false);
            const wrapper = mountComponent();
            expect(wrapper.vm.isValid()).toBe(false);
        });

        it('returns false when the second baseIsValid call fails', () => {
            mockIsValid.mockReturnValueOnce(true).mockReturnValueOnce(false);
            const wrapper = mountComponent();
            expect(wrapper.vm.isValid()).toBe(false);
        });

        it('calls baseIsValid twice (once per schema)', () => {
            const wrapper = mountComponent();
            mockIsValid.mockClear();
            wrapper.vm.isValid();
            expect(mockIsValid).toHaveBeenCalledTimes(2);
        });
    });

    // ── internalReviewHint ──────────────────────────────────────────────────

    describe('internalReviewHint', () => {
        it('displays "0/500" before any input', () => {
            const wrapper = mountComponent();
            const notesInput = wrapper.findAllComponents({
                name: 'LabelledInput',
            })[2];
            expect(notesInput.props('hint')).toBe('0/500');
        });

        it('updates the character count after initial_review_internal_notes changes', async () => {
            const wrapper = mountComponent();
            const widgets = wrapper.findAllComponents({ name: 'GenericWidget' });
            // 3rd widget (index 2) is bound to initial_review_internal_notes
            await widgets[2].vm.$emit('update:value', {
                display_value: 'hello',
                node_value: { en: { value: 'hello', direction: 'ltr' } },
                details: [],
            });

            const notesInput = wrapper.findAllComponents({
                name: 'LabelledInput',
            })[2];
            expect(notesInput.props('hint')).toBe('5/500');
        });

        it('strips HTML tags when counting characters', async () => {
            const wrapper = mountComponent();
            const widgets = wrapper.findAllComponents({ name: 'GenericWidget' });
            await widgets[2].vm.$emit('update:value', {
                display_value: 'hi',
                node_value: { en: { value: '<p>hi</p>', direction: 'ltr' } },
                details: [],
            });

            const notesInput = wrapper.findAllComponents({
                name: 'LabelledInput',
            })[2];
            // htmlToPlainText strips tags → 'hi' = 2 chars
            expect(notesInput.props('hint')).toBe('2/500');
        });
    });

    // ── updateModelValue routing ─────────────────────────────────────────────

    describe('updateModelValue routing', () => {
        it('emits update:stepIsValid after any field update', async () => {
            const wrapper = mountComponent();
            const widgets = wrapper.findAllComponents({ name: 'GenericWidget' });
            await widgets[0].vm.$emit('update:value', {
                display_value: 'Low',
                node_value: 'some-uuid',
            });
            expect(wrapper.emitted('update:stepIsValid')).toBeTruthy();
        });

        it('routes frpr to initial_project_review.aliased_data', async () => {
            const ipa = makeIpa();
            const wrapper = mountComponent(ipa);
            const widgets = wrapper.findAllComponents({ name: 'GenericWidget' });

            const frprValue = { display_value: 'Low', node_value: 'uuid-1' };
            await widgets[0].vm.$emit('update:value', frprValue);

            const [newVal, attrName, dataObj] =
                mockUpdateModelValue.mock.calls[0];
            expect(attrName).toBe('frpr');
            expect(dataObj).toBe(
                ipa.value.aliased_data.initial_project_review?.aliased_data,
            );
        });

        it('routes initial_review_level_of_risk to initial_project_review.aliased_data', async () => {
            const ipa = makeIpa();
            const wrapper = mountComponent(ipa);
            const widgets = wrapper.findAllComponents({ name: 'GenericWidget' });

            await widgets[1].vm.$emit('update:value', {
                display_value: 'High',
                node_value: 'uuid-2',
            });

            const [, attrName, dataObj] = mockUpdateModelValue.mock.calls[0];
            expect(attrName).toBe('initial_review_level_of_risk');
            expect(dataObj).toBe(
                ipa.value.aliased_data.initial_project_review?.aliased_data,
            );
        });

        it('routes initial_review_internal_notes to initial_project_review.aliased_data', async () => {
            const ipa = makeIpa();
            const wrapper = mountComponent(ipa);
            const widgets = wrapper.findAllComponents({ name: 'GenericWidget' });

            await widgets[2].vm.$emit('update:value', {
                display_value: 'notes',
                node_value: { en: { value: 'notes', direction: 'ltr' } },
            });

            const [, attrName, dataObj] = mockUpdateModelValue.mock.calls[0];
            expect(attrName).toBe('initial_review_internal_notes');
            expect(dataObj).toBe(
                ipa.value.aliased_data.initial_project_review?.aliased_data,
            );
        });

        it('routes project_requirements to assessment_details.aliased_data', async () => {
            const ipa = makeIpa();
            const wrapper = mountComponent(ipa);
            const widgets = wrapper.findAllComponents({ name: 'GenericWidget' });

            await widgets[3].vm.$emit('update:value', {
                display_value: 'Req',
                node_value: 'uuid-3',
            });

            const [, attrName, dataObj] = mockUpdateModelValue.mock.calls[0];
            expect(attrName).toBe('project_requirements');
            expect(dataObj).toBe(
                ipa.value.aliased_data.assessment_details?.aliased_data,
            );
        });

        it('routes fossil_repository_agreement to assessment_details.aliased_data', async () => {
            const ipa = makeIpa();
            const wrapper = mountComponent(ipa);
            const widgets = wrapper.findAllComponents({ name: 'GenericWidget' });

            await widgets[4].vm.$emit('update:value', {
                display_value: 'Agreement',
                node_value: 'uuid-4',
            });

            const [, attrName, dataObj] = mockUpdateModelValue.mock.calls[0];
            expect(attrName).toBe('fossil_repository_agreement');
            expect(dataObj).toBe(
                ipa.value.aliased_data.assessment_details?.aliased_data,
            );
        });
    });

    // ── conceptCheckboxOverride ──────────────────────────────────────────────

    describe('conceptCheckboxOverride', () => {
        it('passes card-x-node-x-widget-data-overrides to the project_requirements widget', () => {
            const wrapper = mountComponent();
            const widgets = wrapper.findAllComponents({ name: 'GenericWidget' });
            const overrides = widgets[3].props(
                'cardXNodeXWidgetDataOverrides',
            ) as { widget: { component: string } } | undefined;

            expect(overrides?.widget?.component).toBe(
                'arches_component_lab/widgets/ConceptMultiselectWidget/ConceptMultiselectWidget.vue',
            );
        });

        it('does not pass overrides to non-project_requirements widgets', () => {
            const wrapper = mountComponent();
            const widgets = wrapper.findAllComponents({ name: 'GenericWidget' });

            // widgets 0, 1, 2, 4 should have no override
            [0, 1, 2, 4].forEach((idx) => {
                const overrides = widgets[idx].props(
                    'cardXNodeXWidgetDataOverrides',
                );
                expect(overrides).toBeFalsy();
            });
        });
    });
});
