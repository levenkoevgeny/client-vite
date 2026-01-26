<script>
export default {
  props: {
    column: { type: Object, required: true },
    slotProps: { type: Object, required: true },
  },
  name: "BodyTemplate",
}
</script>

<template>
  <template v-if="column.isBooleanField">
    <font-awesome-icon
      :icon="['fas', 'check']"
      v-if="slotProps.data[slotProps.field]"
    />
  </template>
  <template v-else> {{ slotProps.data[slotProps.field] }}</template>
</template>

<style scoped></style>
