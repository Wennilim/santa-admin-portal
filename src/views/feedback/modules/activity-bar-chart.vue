<script setup lang="ts">
import { watch } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';

defineOptions({
  name: 'ActivityBarChart'
});

const props = defineProps<{
  name: string;
  activities: string[];
  satisfiedData: number[];
  neutralData: number[];
  dissatisfiedData: number[];
  satisfiedLabel: string;
  neutralLabel: string;
  dissatisfiedLabel: string;
}>();

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    bottom: '1%',
    left: 'center',
    data: [props.satisfiedLabel, props.neutralLabel, props.dissatisfiedLabel]
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '12%',
    top: '8%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: props.activities,
    axisLabel: {
      rotate: props.activities.length > 4 ? 30 : 0,
      fontSize: 11
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: props.satisfiedLabel,
      type: 'bar',
      stack: 'total',
      color: '#2D6A4F',
      barMaxWidth: 40,
      itemStyle: {
        borderRadius: [0, 0, 0, 0]
      },
      data: props.satisfiedData
    },
    {
      name: props.neutralLabel,
      type: 'bar',
      stack: 'total',
      color: '#F49D37',
      barMaxWidth: 40,
      itemStyle: {
        borderRadius: [0, 0, 0, 0]
      },
      data: props.neutralData
    },
    {
      name: props.dissatisfiedLabel,
      type: 'bar',
      stack: 'total',
      color: '#E63946',
      barMaxWidth: 40,
      itemStyle: {
        borderRadius: [4, 4, 0, 0]
      },
      data: props.dissatisfiedData
    }
  ]
}));

watch(
  () => [props.activities, props.satisfiedData, props.neutralData, props.dissatisfiedData],
  () => {
    updateOptions(opts => {
      opts.xAxis.data = props.activities;
      opts.xAxis.axisLabel.rotate = props.activities.length > 4 ? 30 : 0;
      opts.series[0].data = props.satisfiedData;
      opts.series[1].data = props.neutralData;
      opts.series[2].data = props.dissatisfiedData;
      opts.legend.data = [props.satisfiedLabel, props.neutralLabel, props.dissatisfiedLabel];
      opts.series[0].name = props.satisfiedLabel;
      opts.series[1].name = props.neutralLabel;
      opts.series[2].name = props.dissatisfiedLabel;
      return opts;
    });
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <div class="text-xl font-bold">{{ props.name }}</div>
    <div ref="domRef" class="h-360px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>
