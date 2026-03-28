<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getAllUsersList } from '@/service/api/dashboard';
import ParticipantsTable from '@/views/home/modules/participants-table.vue';

const data = ref([]);
const loading = ref(false);

async function getData() {
  loading.value = true;
  const res = await getAllUsersList();
  if (res) {
    data.value = res;
  }
  loading.value = false;
}

onMounted(() => getData());
</script>

<template>
  <ParticipantsTable :data="data" :loading="loading" @refresh="getData" />
</template>
