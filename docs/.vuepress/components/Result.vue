<script setup lang="ts" name="Result">
import {useSlots} from 'vue'

const slot = useSlots()
</script>

<template>
  <CodeGroup>
    <CodeGroupItem title="Sql" active>
      <slot name="sql"></slot>
    </CodeGroupItem>
    <CodeGroupItem v-if="slot.data" title="Data">
      <slot name="data"></slot>
    </CodeGroupItem>
  </CodeGroup>
</template>

<style scoped lang="scss"></style>
