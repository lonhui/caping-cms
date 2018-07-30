<template>
  <div class="dashboard-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <h2>{{$t('route.userActive')}}</h2>
      <el-button-group>
        <el-button type="category" :class="{ active: active === 'dayActive' }" @click="active = 'dayActive'">{{$t('table.dayActive')}}</el-button>
        <el-button type="category" :class="{ active: active === 'dayAdd' }" @click="active = 'dayAdd'">{{$t('table.dayAdd')}}</el-button>
        <el-button type="category" :class="{ active: active === 'dayRegister' }" @click="active = 'dayRegister'">{{$t('table.dayRegister')}}</el-button>
      </el-button-group>
      <line-chart v-loading="loadingActiveData" :chart-data="lineChartData"></line-chart>
    </el-row>
  </div>
</template>

<script>
import { fetchActiveList } from '@/api/statistic'
import { parseTime, toActiveChartsData, toChartsDates } from '@/utils'
import LineChart from './components/LineChart'

export default {
  name: 'dashboard',
  components: {
    LineChart
  },
  data() {
    return {
      active: 'dayActive',
      loadingActiveData: false,
      listData: {
        pageNo: 1,
        pageSize: 10,
        begin_date: undefined,
        end_date: undefined
      },
      activeData: {
        categories: [],
        dayActive: {
          newData: [],
          oldData: []
        },
        dayAdd: {
          newData: [],
          oldData: []
        },
        dayRegister: {
          newData: [],
          oldData: []
        }
      },
      // TODO: 默认只查7天内的数据
      days: 7
    }
  },
  computed: {
    lineChartData() {
      // console.info(this.activeData.categories)
      return {
        // x轴显示的节点名
        categories: this.activeData.categories,
        // 近days天的数据
        newData: this.activeData[this.active].newData,
        // 与days天前的数据作比较
        oldData: this.activeData[this.active].oldData,
        name: this.$t('table.' + this.active),
        days: this.days
      }
    }
  },
  created() {
    // 查days*2天的数据，前一半与后一半作比较来显示提升或降低
    this.listData.begin_date = parseTime(new Date(Date.now() - 86400 * 1000 * this.days * 2), '{y}-{m}-{d}')
    this.listData.end_date = parseTime(new Date(), '{y}-{m}-{d}')
    // this.listData.begin_date = '2018-02-01'
    // this.listData.end_date = '2018-02-10'
    this.fetchActiveList()
  },
  methods: {
    async fetchActiveList() {
      try {
        this.loadingActiveData = true
        const resp = await fetchActiveList(this.listData)
        this.activeData = toActiveChartsData(resp.data, toChartsDates(this.listData.end_date, this.days * 2), this.days)
        this.activeData.categories = toChartsDates(this.listData.end_date, this.days)
        // console.info(this.activeData.categories)
        // console.info(this.activeData)
        // this.activeData = {
        //   dayActive: {
        //     newData: [3, 4, 5, 10, 20, 50, 100],
        //     oldData: [30, 1, 2, 24, 20, 48, 101]
        //   },
        //   dayAdd: {
        //     newData: [3000, 40, 5],
        //     oldData: [0, 11, 22]
        //   },
        //   dayRegister: {
        //     newData: [13, 14, 5],
        //     oldData: [0, 1, 12]
        //   }
        // }
        this.lineChartData.newData = this.activeData[this.active].newData
        this.lineChartData.oldData = this.activeData[this.active].oldData
        this.loadingActiveData = false
      } catch (error) {
        console.error(error)
        this.loadingActiveData = false
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;

    .active {
      color: #fff;
      background: #2896ff;
    }
  }
}
</style>
