<script setup lang="ts">
import { inject } from 'vue';
import type { IPA } from '@/bcfms/ipa/schema/IPASchema.ts';

const ipa: typeof IPA = inject('ipa') as typeof IPA;
</script>

<template>
    <div>
        <p>Site Names</p>
        <div display="div-flex-col">
            <div>Submission Date</div>
            <div class="justify-self-center">
                {{ ipa.projectDetails.projectStartDate }}
            </div>
        </div>
        <div display="div-flex-col">
            <div>Project Name</div>
            <div class="justify-self-center">
                {{ ipa.projectDetails.projectName }}
            </div>
        </div>
        <div display="div-flex-col">
            <div>Initiator</div>
            <div class="justify-self-center">
                {{ ipa.projectDetails.projectInitiator }}
            </div>
        </div>
        <div display="div-flex-col">
            <div>Industry Company / Individual / Organization</div>
            <div class="justify-self-center">
                {{ ipa.projectDetails.industryCompanyName }}
            </div>
        </div>
        <div display="div-flex-col">
            <div>Authorizing Agency</div>
            <div class="justify-self-center">
                {{ ipa.projectDetails.projectAuthorizingAgency }}
            </div>
        </div>
        <div display="div-flex-col">
            <div>Estimated Project Start / End Dates</div>
            <div class="justify-self-center">
                {{ ipa.projectDetails.projectStartDate }} -
                {{
                    ipa.projectDetails.projectEndDate
                        ? ipa.projectDetails.projectEndDate
                        : ''
                }}
            </div>
        </div>
        <div display="div-flex-col">
            <div>Project Type</div>
            <div class="justify-self-center">
                {{ ipa.projectDetails.projectType }}
            </div>
        </div>
        <div display="div-flex-col">
            <div>Proposed Activity</div>
            <div class="justify-self-center">
                {{ ipa.projectDetails.proposedActivity }}
            </div>
        </div>
        <div display="div-flex-col">
            <div>Location Description</div>
            <div class="justify-self-center">
                {{ ipa.projectDetails.locationDescription }}
            </div>
        </div>
        <div display="div-flex-col">
            <div>Uploaded Files</div>
        </div>
    </div>
</template>
<style scoped>
.div-flex-col {
    display: flex;
    flex-direction: column;
}
.div-justify-center {
    justify-self: center;
}
</style>
