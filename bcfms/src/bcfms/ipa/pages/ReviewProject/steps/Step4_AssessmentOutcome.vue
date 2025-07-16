<script setup lang="ts">
import { inject } from 'vue';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';

const ipa = inject<IPA>('ipa');
</script>

<template>
    <div>
        <p class="step-title">Project Assessment Details</p>
        <div class="div-grid-cols">
            <div>Project Submission / Assessment Due</div>
            <div class="justify-self-center">
                {{ ipa?.initialProjectReview.dateSubmitted }} -
                {{
                    ipa?.initialProjectReview.assessmentDueDate
                        ? ipa?.initialProjectReview.assessmentDueDate
                        : ''
                }}
            </div>
        </div>
        <div class="div-grid-cols">
            <div>Intersects with important Fossil Area</div>
            <div class="justify-self-center">
                {{ ipa?.initialProjectReview.intersectsIFA }}
            </div>
        </div>
        <div class="div-grid-cols">
            <div>Proximity to Fossils</div>
            <div class="justify-self-center">
                {{ ipa?.initialProjectReview.proximityToFossils }}
            </div>
        </div>
        <div class="div-grid-cols">
            <div>Ground Disturbance</div>
            <div class="justify-self-center">
                {{ ipa?.initialProjectReview.groundDisturbance }}
            </div>
        </div>
        <div class="div-grid-cols">
            <div>Metamorphic Rock</div>
            <div class="justify-self-center">
                {{ ipa?.initialProjectReview.metamorphicRock }}
            </div>
        </div>

        <div class="div-grid-cols">
            <div>Igneous Rock</div>
            <div class="justify-self-center">
                {{ ipa?.initialProjectReview.igneousRock }}
            </div>
        </div>
        <div class="div-grid-cols">
            <div>Sedimentary Rock</div>
            <div class="justify-self-center">
                {{ ipa?.initialProjectReview.sedimentaryRock }}
            </div>
        </div>
        <div class="div-grid-cols">
            <div>Quaternary Sediments</div>
            <div class="justify-self-center">
                {{ ipa?.initialProjectReview.quaternarySediments }}
            </div>
        </div>
        <div class="div-grid-cols">
            <div>FRPR</div>
            <div class="justify-self-center">
                {{ ipa?.initialProjectReview.FRPR }}
            </div>
        </div>
        <div class="div-grid-cols">
            <div>Initial Review Level Of Risk</div>
            <div class="justify-self-center">
                {{ ipa?.initialProjectReview.initialReviewLevelOfRisk }}
            </div>
        </div>
        <div class="div-grid-cols">
            <div>Initial Review Internal Notes</div>
            <div class="justify-self-center">
                <span
                    v-html="
                        ipa?.initialProjectReview.initialReviewInternalNotes
                    "
                >
                </span>
            </div>
        </div>
    </div>
</template>
<style scoped>
.step-title {
    margin-bottom: 1rem;
    font-size: 21px;
    font-weight: bold;
    line-height: inherit;
    color: #333;
}
.p-margin-top-bottom {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
}
.p-underline-bold {
    text-decoration: underline;
    font-weight: bold;
}
.div-grid-cols {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr) 1fr);
}
</style>
