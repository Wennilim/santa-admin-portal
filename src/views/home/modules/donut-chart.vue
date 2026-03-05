<script setup lang="ts">
import { watch } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'DonutChart'
});

const props = defineProps<{
  name: string;
  data: { name: string; value: number }[];
}>();

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    bottom: '1%',
    left: 'center',
    itemStyle: {
      borderWidth: 0
    }
  },
  series: [
    {
      color: ['#2D6A4F', '#E63946', '#fedc69', '#26deca'],
      name: props.name,
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12'
        }
      },
      labelLine: {
        show: false
      },
      data: props.data
    }
  ]
}));

watch(
  () => props.data,
  newData => {
    updateOptions(opts => {
      opts.series[0].name = props.name;
      opts.series[0].data = newData;
      return opts;
    });
  },
  { deep: true, immediate: true }
);

watch(
  () => props.name,
  newName => {
    updateOptions(opts => {
      opts.series[0].name = newName;
      return opts;
    });
  }
);
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <div class="text-xl font-bold">{{ props.name }}</div>
    <div ref="domRef" class="h-360px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>
