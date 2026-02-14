<!--
  HASHRATE CHART COMPONENT
  Renders a line chart showing hashrate over time using Chart.js.

  USAGE:
    <HashrateChart
      :labels="['12:00', '12:30', '13:00']"
      :data="[450000, 470000, 460000]"
      title="Pool Hashrate"
      color="#8B5CF6"
    />
-->

<template>
  <div class="bg-pool-card rounded-xl border border-pool-border p-5">
    <h3 class="text-pool-text font-heading font-semibold mb-4">{{ title }}</h3>

    <div class="h-64">
      <Line
        v-if="chartData.labels.length > 0"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="h-full flex items-center justify-center text-pool-text-dim text-sm">
        No performance data available yet
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
)

const props = defineProps<{
  title: string
  labels: string[]
  data: number[]
  color?: string
  formatValue?: (v: number) => string
}>()

const lineColor = props.color || '#8B5CF6'

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: props.title,
      data: props.data,
      borderColor: lineColor,
      backgroundColor: `${lineColor}15`,
      borderWidth: 2,
      fill: true,
      tension: 0.35,
      pointRadius: 0,
      pointHitRadius: 10,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1A1A2E',
      titleColor: '#E2E8F0',
      bodyColor: '#E2E8F0',
      borderColor: '#1E293B',
      borderWidth: 1,
      padding: 10,
      displayColors: false,
      callbacks: {
        label: (context: any) => {
          if (props.formatValue) {
            return props.formatValue(context.parsed.y)
          }
          return context.parsed.y.toLocaleString()
        },
      },
    },
  },
  scales: {
    x: {
      grid: { color: '#1E293B', drawBorder: false },
      ticks: { color: '#64748B', maxTicksLimit: 8, font: { family: 'Inter', size: 11 } },
    },
    y: {
      grid: { color: '#1E293B', drawBorder: false },
      ticks: {
        color: '#64748B',
        font: { family: 'Inter', size: 11 },
        callback: (value: any) => {
          if (props.formatValue) return props.formatValue(value)
          return value.toLocaleString()
        },
      },
    },
  },
}
</script>