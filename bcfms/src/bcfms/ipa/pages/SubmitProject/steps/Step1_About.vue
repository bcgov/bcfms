<script setup lang="ts">
import FieldSet from 'primevue/fieldset';

const isValid = () => {
    return true;
};

defineExpose({ isValid });
</script>
<template>
    <FieldSet legend="Before you begin">
        <p>The entire submission will need to be completed at once.</p>
        <p>You will need the following:</p>
        <ol class="ol-margin-left">
            <li>
                Project referral information giving the project name, contact
                information for the Industry initiator (individual and/or
                company), Authorizing Agency, if applicable and estimated start
                date (if known)
            </li>
            <li>Details about the project type and its proposed activity</li>
            <li>
                A brief description of the project location and associated KML
                or shapefile files
            </li>
            <li>
                Project documents (EAO AIR or Land Act documents), if applicable
            </li>
        </ol>
        <p>
            When you are ready to proceed, press the 'Start' button to start the
            submission.
        </p>
    </FieldSet>
</template>

<style>
li {
    color: unset;
    font-size: unset;
}
</style>
<style scoped>
.ol-margin-left {
    margin-left: 1rem;
}
</style>
