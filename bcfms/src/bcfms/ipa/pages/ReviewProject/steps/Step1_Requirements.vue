<script setup lang="ts">
import FieldSet from 'primevue/fieldset';

const isValid = () => {
    return true;
};

defineExpose({ isValid });
</script>
<template>
    <FieldSet legend="Review submitted project">
        <div>
            To review submitted project, you will need the project location map
            open with the project footprint visible to examine the bedrock
            geology, FRPC layers, and collection events.
        </div></FieldSet
    >
</template>

<style>
li {
    color: unset;
    font-size: unset;
}
</style>
