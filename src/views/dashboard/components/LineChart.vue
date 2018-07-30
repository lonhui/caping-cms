<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import { debounce } from '@/utils'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize()
        }
      }, 100)
      window.addEventListener('resize', this.__resizeHanlder)
    }

    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHanlder)
    }

    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)

    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  methods: {
    setOptions({ newData, oldData, categories, name, days } = {}) {
      this.chart.setOption({
        xAxis: {
          data: categories,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10],
          backgroundColor: 'rgba(245, 245, 245, 0.8)',
          borderWidth: 1,
          borderColor: '#ccc',
          textStyle: {
            color: '#000'
          },
          extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);',
          formatter: params => {
            const weeks = ['Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thur.', 'Fri.', 'Sat.']
            const months = [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sept',
              'Oct',
              'Nov',
              'Dec'
            ]
            let now = new Date(params[0].name)
            let before = new Date(now.getTime() - 86400 * 1000 * Number(days))
            now = `${weeks[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`
            before = `${weeks[before.getDay()]} ${before.getDate()} ${months[before.getMonth()]}`
            let span = ''
            const nowCount = Number(params[0].value)
            const beforeCount = Number(params[1].value)
            // console.info(nowCount, beforeCount)
            if (beforeCount === 0) {
              span = '<span style="font-weight: bole;color: green;margin-left: 5px;">↑ NaN</span>'
            } else {
              const rate = ((nowCount - beforeCount) / beforeCount * 100).toFixed(2)
              // console.info(rate)
              span = `<span style="font-weight: bole;color: ${
                rate < 0 ? 'red' : 'green'
              };margin-left: 5px;">${rate > 0 ? '↑' : rate < 0 ? '↓' : ''} ${nowCount === beforeCount ? '-' : rate + '%'}</span>`
            }
            return `
              <p style="font-size: 12px;color: #666;">${now} vs ${before}</p>
              <p>
                <span style="color: #444;">${name}</span>
                <span style="font-weight: bold;margin-left: 10px;">${nowCount}</span>
                ${span}
              </p>
            `
          }
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          show: false
        },
        series: [
          {
            name,
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: newData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name,
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  type: 'dashed',
                  color: '#3888fa',
                  width: 1
                }
              }
            },
            data: oldData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      })
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    }
  }
}
</script>
