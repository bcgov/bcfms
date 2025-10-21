<script setup lang="ts">
import FieldSet from 'primevue/fieldset';

const isValid = () => {
    return true;
};

defineExpose({ isValid });
</script>
<template>
    <FieldSet legend="Review submitted project"> </FieldSet>
</template>

<style>
li {
    color: unset;
    font-size: unset;
}
</style>
