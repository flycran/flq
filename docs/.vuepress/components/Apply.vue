<script setup lang="ts" name="Apply">
import {useSlots} from 'vue'

const slot = useSlots()
</script>

<template>
  <CodeGroup>
    <CodeGroupItem title="Query" active>
      <slot name="query"></slot>
    </CodeGroupItem>
    <CodeGroupItem v-if="slot.model" title="Model">
      <slot name="model">
      </slot>
    </CodeGroupItem>
  </CodeGroup>
</template>

<style scoped lang="scss"></style>
