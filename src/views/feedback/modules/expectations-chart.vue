<script setup lang="ts">
defineOptions({
  name: 'ExpectationsChart'
});

const props = defineProps<{
  name: string;
  data: string[];
}>();
</script>

<template>
  <NCard :bordered="false" class="flex flex-col card-wrapper">
    <div class="mb-4 text-xl font-bold">{{ props.name }}</div>
    <div class="flex-1 overflow-hidden">
      <NScrollbar class="max-h-320px">
        <div v-if="props.data.length" class="flex flex-col gap-3">
          <div
            v-for="(item, index) in props.data"
            :key="index"
            class="rounded-lg bg-gray-50 p-4 transition-colors dark:bg-dark/20 hover:bg-gray-100"
          >
            <div class="flex items-start gap-3">
              <span class="mt-1 text-primary">
                <SvgIcon icon="mdi:comment-quote" class="text-xl" />
              </span>
              <p class="text-14px leading-relaxed">{{ item }}</p>
            </div>
          </div>
        </div>
        <NEmpty v-else :description="name" />
      </NScrollbar>
    </div>
  </NCard>
</template>

<style scoped></style>
