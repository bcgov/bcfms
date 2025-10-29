<script setup lang="ts">
import { computed, ref, provide, onMounted } from 'vue';
import Stepper from 'primevue/stepper';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepperNavigation from '@/bcgov_arches_common/components/Stepper/components/StepperNavigation/StepperNavigation.vue';
import Panel from 'primevue/panel';
import ProgressSpinner from 'primevue/progressspinner';
import type { StepperProps } from 'primevue/stepper';
import type { StepperState } from 'primevue/stepper';
import type { ErrorMessage } from '@/bcfms/types.ts';
import ReviewProjectStep1 from '@/bcfms/ipa/pages/ReviewProject/steps/Step1_Requirements.vue';
import ReviewProjectStep2 from '@/bcfms/ipa/pages/ReviewProject/steps/Step2_Details.vue';
import ReviewProjectStep3 from '@/bcfms/ipa/pages/ReviewProject/steps/Step3_Geology.vue';
import ReviewProjectStep4 from '@/bcfms/ipa/pages/ReviewProject/steps/Step4_RiskAssessment.vue';
import ReviewProjectStep5 from '@/bcfms/ipa/pages/ReviewProject/steps/Step5_AssessmentOutcome.vue';
import { getIPA, type IPAType } from '@/bcfms/ipa/schema/IPASchema.ts';
import { getBlankIpa } from '@/bcfms/ipa/api.ts';
import { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';
import type { Ref } from 'vue';
import { submitIPA } from '@/bcfms/ipa/api.ts';

const activateNextStep = async () => {
    if (currentStep.value === 5) {
        submitIpaData();
    } else {
        myStepper.value.d_value++;
        setCurrentStepValid(
            steps[myStepper.value.d_value - 1].value.isValid(),
            myStepper.value.d_value,
        );
    }
};
const submitIpaData = async () => {
    console.log('submit IPA', ipa);
    submitting.value = true;
    submissionErrors.value = [];
    submitIPA(ipa.value)
        .then((updatedIPA) => {
            ipa.value = updatedIPA.aliased_data as Promise<IPAType>;
            myStepper.value.d_value++;
            setCurrentStepValid(
                steps[myStepper.value.d_value - 1].value.isValid(),
                myStepper.value.d_value,
            );
            submissionErrors.value = [];
            submitting.value = false;
        })
        .catch((error) => {
            console.log('error', error);
            submissionErrors.value.push(error);
            submitting.value = false;
        });
};
const submissionErrors = ref([] as ErrorMessage[]);
const activatePreviousStep = () => {
    setCurrentStepValid(
        steps[myStepper.value.d_value - 2].value.isValid(),
        myStepper.value.d_value - 1,
    );
    myStepper.value.d_value--;
};

function activateStep(step: number) {
    if (step > lastStep && !isValid(lastStep)) {
        myStepper.value.d_value = lastStep;
    } else {
        lastStep = step;
        setCurrentStepValid(steps[step - 1].value.isValid(), step);
    }
}

const stepStatuses: Ref<boolean[]> = ref([]);
const currentStepIsValid = computed(() => {
    return stepStatuses.value[currentStep.value - 1];
});
const setCurrentStepValid = function (isValid: boolean, stepNumber: number) {
    stepStatuses.value[stepNumber - 1] = isValid;
};
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
const steps: Ref[] = [];
let lastStep = 1;
const currentStep = computed(() => {
    return myStepper.value?.d_value;
});
const submitted = ref(false);
const submitting = ref(false);
const ipa: Ref<IPAType> = ref(getIPA());

provide('ipa', ipa);

const nextLabel = computed(() => {
    if (currentStep.value === 1) return 'Start';
    if (currentStep.value === steps.length) return 'Print';
    return currentStep.value < steps.length - 1 ? 'Next' : 'Submit';
});
const showPrevious = computed(() => {
    return !(currentStep.value === steps.length || currentStep.value === 1);
});

const showDebug = ref(false);

onMounted(() => {
    steps.push(step1, step2, step3, step4, step5, step6);
    stepStatuses.value[0] = true;
    getBlankIpa().then((response) => {
        ipa.value = response.aliased_data as unknown as typeof IPA;
    });
});
</script>

<template>
    <div
        v-if="submitting"
        class="submit-overlay"
    >
        <ProgressSpinner />
    </div>
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
                        <Step :value="3">Geology</Step>
                        <Step :value="4">Risk Assessment</Step>
                        <Step :value="5">Assessment Outcome</Step>
                        <Step :value="6">Submission Complete</Step>
                    </StepList>
                </div>
                <div class="bcgov-vertical-step-panels">
                    <h1 class="heading-black">Review New Project</h1>
                    <StepPanels>
                        <StepperNavigation
                            :step-number="currentStep"
                            :is-valid="currentStepIsValid"
                            :show-previous="showPrevious"
                            :next-label="nextLabel"
                            @next-click="activateNextStep"
                            @previous-click="activatePreviousStep"
                        >
                        </StepperNavigation>
                        <StepPanel :value="1">
                            <h3 class="heading-margin-bottom">
                                Submission Requirements
                            </h3>
                            <ReviewProjectStep1
                                ref="step1"
                            ></ReviewProjectStep1>
                        </StepPanel>
                        <StepPanel :value="2">
                            <h3 class="heading-margin-bottom">
                                Project Details
                            </h3>
                            <ReviewProjectStep2
                                ref="step2"
                                @update:step-is-valid="
                                    setCurrentStepValid($event, 2)
                                "
                            ></ReviewProjectStep2>
                        </StepPanel>
                        <StepPanel :value="3">
                            <h3 class="heading-margin-bottom">Geology</h3>
                            <ReviewProjectStep3
                                ref="step3"
                                @update:step-is-valid="
                                    setCurrentStepValid($event, 3)
                                "
                            ></ReviewProjectStep3>
                        </StepPanel>
                        <StepPanel :value="4">
                            <h3 class="heading-margin-bottom">
                                Risk Assessment
                            </h3>
                            <ReviewProjectStep4
                                ref="step4"
                                @update:step-is-valid="
                                    setCurrentStepValid($event, 4)
                                "
                            ></ReviewProjectStep4>
                        </StepPanel>
                        <StepPanel :value="5">
                            <h3 class="heading-margin-bottom">
                                Assessment Outcome
                            </h3>
                            <ReviewProjectStep5
                                ref="step5"
                                :submission-errors="submissionErrors"
                                @update:step-is-valid="
                                    setCurrentStepValid($event, 5)
                                "
                            ></ReviewProjectStep5>
                        </StepPanel>
                        <StepPanel :value="6">
                            <h3 class="heading-margin-bottom">
                                Submission Complete
                            </h3>
                            <ReviewProjectStep5
                                ref="step6"
                                :submission-errors="submissionErrors"
                                @update:step-is-valid="
                                    setCurrentStepValid($event, 6)
                                "
                            ></ReviewProjectStep5>
                        </StepPanel>
                        <StepperNavigation
                            :step-number="currentStep"
                            :is-valid="currentStepIsValid"
                            :show-previous="showPrevious"
                            :next-label="nextLabel"
                            @next-click="activateNextStep"
                            @previous-click="activatePreviousStep"
                        >
                        </StepperNavigation>
                    </StepPanels>
                </div>
            </div>
        </Stepper>
    </Panel>
</template>
<style>
@import url('@/bcgov_arches_common/css/arches_common.css');
</style>
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

.submit-overlay {
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.7;
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: white;
    z-index: 500;
    left: 0;
    top: 0;
}
</style>
