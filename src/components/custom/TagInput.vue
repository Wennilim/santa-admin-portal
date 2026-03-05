<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  modelValue: string[];
  placeholder?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const inputValue = ref('');

const tags = ref<string[]>([...props.modelValue]);

watch(
  () => props.modelValue,
  val => {
    tags.value = [...val];
  }
);

// HEX color regex
const hexRegex = /^#([0-9A-Fa-f]{6})$/;

function addTag() {
  const value = inputValue.value.trim();

  if (!hexRegex.test(value)) {
    inputValue.value = '';
    return;
  }

  if (!tags.value.includes(value)) {
    const newTags = [...tags.value, value];
    tags.value = newTags;
    emit('update:modelValue', newTags);
  }

  inputValue.value = '';
}

function removeTag(tag: string) {
  const newTags = tags.value.filter(t => t !== tag);
  tags.value = newTags;
  emit('update:modelValue', newTags);
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 border rounded p-2">
    <NTag v-for="tag in tags" :key="tag" closable type="info" @close="removeTag(tag)">
      <div class="flex items-center gap-2">
        <span class="h-3 w-3 border rounded-full" :style="{ backgroundColor: tag }" />
        {{ tag }}
      </div>
    </NTag>

    <div class="flex items-center gap-2">
      <!-- preview dot -->
      <span
        v-if="inputValue.startsWith('#') && inputValue.length === 7"
        class="h-3 w-3 border rounded-full"
        :style="{ backgroundColor: inputValue }"
      />

      <NInput
        v-model:value="inputValue"
        size="small"
        class="w-120px border-none"
        :placeholder="placeholder || 'eg: #FFFFFF'"
        maxlength="7"
        @keydown.enter.prevent="addTag"
      />
    </div>
  </div>
</template>
