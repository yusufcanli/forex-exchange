<template>
    <div class="chart">
        <v-chart v-if="show" :option="option" autoresize />
    </div>
</template>
  
<script setup lang="ts">
import { useStore } from 'vuex'
import { ref, watchEffect } from 'vue'
import { graphic } from 'echarts'
import VChart from 'vue-echarts'

const store = useStore()
const option = ref({
    color: ["#8acc40"],
    tooltip: {
        show: true,
        trigger: "axis",
        axisPointer: {
            type: "line"
        }
    },
    grid: {
        left: 0,
        right: 0,
        height: 200,
        bottom: 0,
        top: 0,
        containLabel: false
    },
    xAxis: [{
        show: false,
        type: "category",
        data: [''],
        boundaryGap: false,
        splitArea: {
            areaStyle: {
                shadowOffsetX: 0,
                shadowBlur: 0.5
            }
        }
    }],
    yAxis: [{
        show: false,
        type: "value",
        min: 0,
        max: 0
    }],
    series: [{
        name: "forex-exchange",
        type: "line",
        areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
                {
                    offset: 0,
                    color: '#8fcc4a'
                },
                {
                    offset: 1,
                    color: '#8fcc4a8c'
                }]),
            opacity: 0.5
        },
        data: [0]
    }]
})

const show = ref(false)

watchEffect(() => {
    let data = store.getters.chartData;
    show.value = false
    if (data === null || data.length === 0) return;

    data = data.quotes
    let xAxis: string[] = []
    data.forEach((data: { date: string }) => {
        xAxis.push(data.date)
    })

    let yAxis: number[] = []
    data.forEach((data: { open: string }) => {
        yAxis.push(parseFloat(data.open))
    })
    option.value.series[0].data = yAxis
    option.value.xAxis[0].data = xAxis
    option.value.yAxis[0].min = Math.min(...yAxis)
    option.value.yAxis[0].max = (Math.max(...yAxis))
    show.value = true
})
</script>