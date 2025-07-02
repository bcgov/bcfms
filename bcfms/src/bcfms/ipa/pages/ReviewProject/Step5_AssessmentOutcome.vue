<script setup lang="ts">
import { inject } from 'vue';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';

const ipa: typeof IPA = inject('ipa') as typeof IPA;
</script>

<template>
    <div>
        <p class="underline font-bold">Project Assessment Details</p>
        <div display="flex flex-col">
            <div>Project Submission / Assessment Due</div>
            <div class="justify-self-center">
                {{ ipa.initialProjectReview.dateSubmitted }} -
                {{
                    ipa.initialProjectReview.assessmentDueDate
                        ? ipa.initialProjectReview.assessmentDueDate
                        : ''
                }}
            </div>
        </div>
        <div display="flex flex-col">
            <div>Intersects with important Fossil Area</div>
            <div class="justify-self-center">
                {{ ipa.initialProjectReview.intersectsIFA }}
            </div>
        </div>
        <div display="flex flex-col">
            <div>Proximity to Fossils</div>
            <div class="justify-self-center">
                {{ ipa.initialProjectReview.proximityToFossils }}
            </div>
        </div>
        <div display="flex flex-col">
            <div>Ground Disturbance</div>
            <div class="justify-self-center">
                {{ ipa.initialProjectReview.groundDisturbance }}
            </div>
        </div>
        <div display="flex flex-col">
            <div>Metamorphic Rock</div>
            <div class="justify-self-center">
                {{ ipa.initialProjectReview.metamorphicRock }}
            </div>
        </div>

        <div display="flex flex-col">
            <div>Igneous Rock</div>
            <div class="justify-self-center">
                {{ ipa.initialProjectReview.igneousRock }}
            </div>
        </div>
        <div display="flex flex-col">
            <div>Sedimentary Rock</div>
            <div class="justify-self-center">
                {{ ipa.initialProjectReview.sedimentaryRock }}
            </div>
        </div>
        <div display="flex flex-col">
            <div>Quaternary Sediments</div>
            <div class="justify-self-center">
                {{ ipa.initialProjectReview.quaternarySediments }}
            </div>
        </div>
        <div display="flex flex-col">
            <div>FRPR</div>
            <div class="justify-self-center">
                {{ ipa.initialProjectReview.FRPR }}
            </div>
        </div>
        <div display="flex flex-col">
            <div>Initial Review Level Of Risk</div>
            <div class="justify-self-center">
                {{ ipa.initialProjectReview.initialReviewLevelOfRisk }}
            </div>
        </div>
        <div display="flex flex-col">
            <div>Initial Review Internal Notes</div>
            <div class="justify-self-center">
                {{ ipa.initialProjectReview.initialReviewInternalNotes }}
            </div>
        </div>
    </div>
</template>
