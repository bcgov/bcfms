<script setup lang="ts">
import { inject } from 'vue';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';

const ipa: typeof IPA = inject('ipa') as typeof IPA;
</script>

<template>
    <div class="step-title">Submission Details</div>
    <p class="p-margin-top-bottom">
        Please review the entered information prior to submitting the
        application:
    </p>
    <p class="p-underline-bold">Filling Details</p>
    <div class="div-grid-cols">
        <div>Submission Date</div>
        <div>
            {{ ipa.projectDetails.projectStartDate }}
        </div>
    </div>
    <div class="div-grid-cols">
        <div>Project Name</div>
        <div>
            {{ ipa.projectDetails.projectName }}
        </div>
    </div>
    <div class="div-grid-cols">
        <div>Initiator</div>
        <div>
            {{ ipa.projectDetails.projectInitiator }}
        </div>
    </div>
    <div class="div-grid-cols">
        <div>Industry Company / Individual / Organization</div>
        <div>
            {{ ipa.projectDetails.industryCompanyName }}
        </div>
    </div>
    <div class="div-grid-cols">
        <div>Authorizing Agency</div>
        <div>
            {{ ipa.projectDetails.projectAuthorizingAgency }}
        </div>
    </div>
    <div class="div-grid-cols">
        <div>Estimated Project Start / End Dates</div>
        <div>
            {{ ipa.projectDetails.projectStartDate }} -
            {{
                ipa.projectDetails.projectEndDate
                    ? ipa.projectDetails.projectEndDate
                    : ''
            }}
        </div>
    </div>
    <div class="div-grid-cols">
        <div>Project Type</div>
        <div>
            {{ ipa.projectDetails.projectType }}
        </div>
    </div>
    <div class="div-grid-cols">
        <div>Proposed Activity</div>
        <div>
            {{ ipa.projectDetails.proposedActivity }}
        </div>
    </div>
    <div class="div-grid-cols">
        <div>Location Description</div>
        <div>
            {{ ipa.projectDetails.locationDescription }}
        </div>
    </div>
    <div class="div-grid-cols">
        <div>Uploaded Files</div>
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
