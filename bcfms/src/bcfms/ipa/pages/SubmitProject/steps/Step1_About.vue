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
        <ol>
            <li>First thing</li>
            <li>Second thing</li>
            <li>Third thing</li>
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
