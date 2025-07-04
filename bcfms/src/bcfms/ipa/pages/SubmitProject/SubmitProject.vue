<script setup lang="ts">
import { computed, ref, provide, onMounted } from 'vue';
import Stepper from 'primevue/stepper';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepperNavigation from '@/bcgov_arches_common/components/stepper/StepperNavigation.vue';
import Panel from 'primevue/panel';
import type { StepperProps } from 'primevue/stepper';
import type { StepperState } from 'primevue/stepper';
import SubmitProjectStep1 from '@/bcfms/ipa/pages/SubmitProject/steps/Step1_About.vue';
import SubmitProjectStep2 from '@/bcfms/ipa/pages/SubmitProject/steps/Step2_Details.vue';
import SubmitProjectStep3 from '@/bcfms/ipa/pages/SubmitProject/steps/Step3_Type.vue';
import SubmitProjectStep4 from '@/bcfms/ipa/pages/SubmitProject/steps/Step4_Location.vue';
import SubmitProjectStep5 from '@/bcfms/ipa/pages/SubmitProject/steps/Step5_Documents.vue';
import SubmitProjectStep6 from '@/bcfms/ipa/pages/SubmitProject/steps/Step6_ReviewSubmission.vue';
import { getIPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import type { Ref } from 'vue';

const activateNextStep = () => {
    myStepper.value.d_value++;
};
const activatePreviousStep = () => {
    myStepper.value.d_value--;
};

function activateStep(step: number) {
    if (step > lastStep && !isValid(lastStep)) {
        myStepper.value.d_value = lastStep;
    } else {
        lastStep = step;
    }
}

const isValid = (step: number) => {
    let stepValid = true;

    if (typeof steps[step - 1]?.value?.isValid === 'function') {
        stepValid = steps[step - 1]?.value?.isValid();
    }
    if (step === steps.length) {
        submitted.value = true;
    }

    return stepValid;
};
const printDetails = () => {
    console.log('printDetails');
};
const stepperProps: Ref<StepperProps | null> = ref(null);
const stepperState: Ref<StepperState | null> = ref(null);
const myStepper = ref();
const step1 = ref();
const step2 = ref();
const step3 = ref();
const step4 = ref();
const step5 = ref();
const step6 = ref();
const step7 = ref();
const steps: Ref[] = [];
let lastStep = 1;
const currentStep = computed(() => {
    return myStepper.value?.d_value;
});
const submitted = ref(false);
const ipa: Ref<typeof IPA> = ref(getIPA());

provide('ipa', ipa);

const nextLabel = computed(() => {
    if (currentStep.value === steps.length) return 'Print';
    return currentStep.value < steps.length - 1 ? 'Next' : 'Submit';
});
const showPrevious = computed(() => {
    return !(currentStep.value === steps.length || currentStep.value === 1);
});

const showDebug = ref(false);

onMounted(() => {
    steps.push(step1, step2, step3, step4, step5, step6, step7);
});
</script>

<template>
    <div
        id="debug-div"
        :v-show="showDebug"
        class="debug-step"
        :class="{ 'show-debug': showDebug }"
    >
        {{ JSON.stringify(ipa) }}
    </div>
    <i
        style="margin-top: 30px"
        class="fa fa-eye-slash debug-toggle"
        @click="showDebug = !showDebug"
    ></i>
    <Panel class="full-height">
        <div style="display: none">Step: {{ currentStep }}</div>
        <Stepper
            ref="myStepper"
            :state="stepperState"
            :props="stepperProps"
            :value="1"
            linear
            @update:value="activateStep"
        >
            <div class="bcgov-stepper">
                <div class="bcgov-vertical-steps">
                    <StepList>
                        <Step :value="1">Submission Requirements</Step>
                        <Step :value="2">Details</Step>
                        <Step :value="3">Project Type</Step>
                        <Step :value="4">Location</Step>
                        <Step :value="5">Documents</Step>
                        <Step :value="6">Review Submission</Step>
                        <Step :value="7">Submission Complete</Step>
                    </StepList>
                </div>
                <div class="bcgov-vertical-step-panels">
                    <h3 class="heading-black">Submit New Project Assessment</h3>
                    <StepperNavigation
                        :step-number="currentStep"
                        :validate-fn="isValid"
                        :show-previous="showPrevious"
                        :next-label="nextLabel"
                        @next-click="activateNextStep"
                        @previous-click="activatePreviousStep"
                    >
                    </StepperNavigation>
                    <StepPanels>
                        <StepPanel
                            v-slot="{ activateCallback }"
                            :value="1"
                        >
                            <SubmitProjectStep1
                                ref="step1"
                            ></SubmitProjectStep1>

                            <StepperNavigation
                                :step-number="1"
                                :validate-fn="isValid"
                                @next-click="activateCallback(2)"
                            ></StepperNavigation>
                        </StepPanel>
                        <StepPanel
                            v-slot="{ activateCallback }"
                            :value="2"
                        >
                            <div class="step-title">Project Details</div>
                            <SubmitProjectStep2
                                ref="step2"
                            ></SubmitProjectStep2>

                            <StepperNavigation
                                :step-number="2"
                                :validate-fn="isValid"
                                @next-click="activateCallback(3)"
                                @previous-click="activateCallback(1)"
                            ></StepperNavigation>
                        </StepPanel>
                        <StepPanel
                            v-slot="{ activateCallback }"
                            :value="3"
                        >
                            <div class="step-title">Project Type</div>
                            <SubmitProjectStep3
                                ref="step3"
                            ></SubmitProjectStep3>

                            <StepperNavigation
                                :step-number="3"
                                :validate-fn="isValid"
                                @next-click="activateCallback(4)"
                                @previous-click="activateCallback(2)"
                            ></StepperNavigation>
                        </StepPanel>
                        <StepPanel
                            v-slot="{ activateCallback }"
                            :value="4"
                        >
                            <div class="step-title">Project Location</div>
                            <SubmitProjectStep4
                                ref="step4"
                            ></SubmitProjectStep4>

                            <StepperNavigation
                                :step-number="4"
                                :validate-fn="isValid"
                                @next-click="activateCallback(5)"
                                @previous-click="activateCallback(3)"
                            ></StepperNavigation>
                        </StepPanel>
                        <StepPanel
                            v-slot="{ activateCallback }"
                            :value="5"
                        >
                            <div class="step-title">Project Documents</div>
                            <SubmitProjectStep5
                                ref="step5"
                            ></SubmitProjectStep5>

                            <StepperNavigation
                                :step-number="5"
                                :validate-fn="isValid"
                                @next-click="activateCallback(6)"
                                @previous-click="activateCallback(4)"
                            ></StepperNavigation>
                        </StepPanel>
                        <StepPanel
                            v-slot="{ activateCallback }"
                            :value="6"
                        >
                            <div class="step-title">Review Submission</div>
                            <SubmitProjectStep6
                                ref="step6"
                            ></SubmitProjectStep6>
                            <StepperNavigation
                                :step-number="6"
                                :validate-fn="isValid"
                                next-label="Submit"
                                @next-click="activateCallback(7)"
                                @previous-click="activateCallback(5)"
                            >
                            </StepperNavigation>
                        </StepPanel>
                        <StepPanel :value="7">
                            <div class="step-title">Submission Complete</div>
                            <StepperNavigation
                                :step-number="7"
                                :validate-fn="isValid"
                                :show-previous="false"
                                next-label="Print"
                                @next-click="printDetails"
                            ></StepperNavigation>
                        </StepPanel>
                    </StepPanels>
                </div>
            </div>
        </Stepper>
    </Panel>
</template>

<style scoped>
.dashboard-card {
    font-size: 1.1rem;
    margin: 1rem;
    max-width: 33%;
}

.p-card-content {
    font-size: 1rem;
}

li {
    color: var(--p-primary-color);
}

.step-title {
    margin-bottom: 1rem;
    font-size: 21px;
    font-weight: bold;
    line-height: inherit;
    color: #333;
}

.debug-step {
    max-width: 80%;
    margin-top: 100px;
    display: none;
    position: absolute;
    bottom: 10px;
    word-wrap: anywhere;
    color: darkgray;
}

.show-debug {
    display: inline-block !important;
}

.debug-toggle {
    position: absolute;
    top: 0;
    left: 0.5rem;
    color: white;
    z-index: 9000;
}

.heading-black {
    color: black;
}

.p-panel {
    color: white;
}
.stepper-nav-panel {
    color: white;
}
</style>
