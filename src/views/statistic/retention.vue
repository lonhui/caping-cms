<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="-"
        :start-placeholder="$t('table.startDate')"
        :end-placeholder="$t('table.endDate')"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('button.search')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
      style="width: 100%">
      <el-table-column min-width="100px" align="center" :label="$t('table.date')">
        <template slot-scope="scope">
          <span>{{scope.row.date | date}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.dayAdd')">
        <template slot-scope="scope">
          <span>{{scope.row.day_0000}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.day1')">
        <template slot-scope="scope">
          <span>{{scope.row.day_0001}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.day2')">
        <template slot-scope="scope">
          <span>{{scope.row.day_0002}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.day3')">
        <template slot-scope="scope">
          <span>{{scope.row.day_0003}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.day4')">
        <template slot-scope="scope">
          <span>{{scope.row.day_0004}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.day5')">
        <template slot-scope="scope">
          <span>{{scope.row.day_0005}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.day6')">
        <template slot-scope="scope">
          <span>{{scope.row.day_0006}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.day7')">
        <template slot-scope="scope">
          <span>{{scope.row.day_0007}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.day15')">
        <template slot-scope="scope">
          <span>{{scope.row.day_0015}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.day30')">
        <template slot-scope="scope">
          <span>{{scope.row.day_0030}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listData.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { fetchRetentionList } from '@/api/statistic'
import { parseTime } from '@/utils'

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listData: {
        pageNo: 1,
        pageSize: 10,
        begin_date: undefined,
        end_date: undefined
      },
      dateRange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t('button.latestWeek'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$t('button.latestMonth'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: this.$t('button.latest3Months'),
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  filters: {
    date: date => parseTime(new Date(date), '{y}-{m}-{d}')
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const resp = await fetchRetentionList(this.listData)
        this.list = resp.data.list
        this.total = resp.data.totalCount
        this.listLoading = false
      } catch (error) {
        console.error(error)
        this.listLoading = false
      }
    },
    handleFilter() {
      if (this.dateRange === null || this.dateRange.length === 0) {
        this.listData.begin_date = undefined
        this.listData.end_date = undefined
      } else {
        this.listData.begin_date = parseTime(this.dateRange[0], '{y}-{m}-{d}')
        this.listData.end_date = parseTime(this.dateRange[1], '{y}-{m}-{d}')
      }
      this.getList()
    },
    handleCurrentChange(val) {
      this.listData.pageNo = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listData.pageSize = val
      this.getList()
    }
  }
}
</script>
