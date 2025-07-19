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
import ReviewProjectStep1 from '@/bcfms/ipa/pages/ReviewProject/steps/Step1_Details.vue';
import ReviewProjectStep2 from '@/bcfms/ipa/pages/ReviewProject/steps/Step2_Geology.vue';
import ReviewProjectStep3 from '@/bcfms/ipa/pages/ReviewProject/steps/Step3_RiskAssessment.vue';
import ReviewProjectStep4 from '@/bcfms/ipa/pages/ReviewProject/steps/Step4_AssessmentOutcome.vue';
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
    steps.push(step1, step2, step3, step4);
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
                        <Step :value="1">Details</Step>
                        <Step :value="2">Geology</Step>
                        <Step :value="3">Risk Assessment</Step>
                        <Step :value="4">Assessment Outcome</Step>
                    </StepList>
                </div>
                <div class="bcgov-vertical-step-panels">
                    <h1 class="heading-black">Review New Project</h1>
                    <StepPanels>
                        <StepPanel
                            v-slot="{ activateCallback }"
                            :value="1"
                        >
                            <h3 class="heading-margin-bottom">
                                Project Details
                            </h3>
                            <ReviewProjectStep1
                                ref="step1"
                            ></ReviewProjectStep1>
                            <StepperNavigation
                                :step-number="1"
                                :validate-fn="isValid"
                                :show-previous="showPrevious"
                                @next-click="activateCallback(2)"
                            ></StepperNavigation>
                        </StepPanel>
                        <StepPanel
                            v-slot="{ activateCallback }"
                            :value="2"
                        >
                            <h3 class="heading-margin-bottom">Geology</h3>
                            <StepperNavigation
                                :step-number="currentStep"
                                :validate-fn="isValid"
                                :show-previous="showPrevious"
                                :next-label="nextLabel"
                                @next-click="activateNextStep"
                                @previous-click="activatePreviousStep"
                            >
                            </StepperNavigation>
                            <ReviewProjectStep2
                                ref="step2"
                            ></ReviewProjectStep2>
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
                            <h3 class="heading-margin-bottom">
                                Risk Assessment
                            </h3>
                            <StepperNavigation
                                :step-number="currentStep"
                                :validate-fn="isValid"
                                :show-previous="showPrevious"
                                :next-label="nextLabel"
                                @next-click="activateNextStep"
                                @previous-click="activatePreviousStep"
                            >
                            </StepperNavigation>
                            <ReviewProjectStep3
                                ref="step3"
                            ></ReviewProjectStep3>
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
                            <h3 class="heading-margin-bottom">
                                Assessment Outcome
                            </h3>
                            <StepperNavigation
                                :step-number="4"
                                :validate-fn="isValid"
                                :show-previous="showPrevious"
                                :next-label="nextLabel"
                                @next-click="printDetails"
                                @previous-click="activateCallback(3)"
                            >
                            </StepperNavigation>
                            <ReviewProjectStep4
                                ref="step4"
                            ></ReviewProjectStep4>
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

.heading-margin-bottom {
    margin-bottom: 2rem;
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
</style>
