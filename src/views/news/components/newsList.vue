<template>
  <div class="app-container calendar-list-container"  style="margin-top: 30px;">
    <div class="filter-container" style="min-width: 950px;">
      <el-select clearable style="max-width: 200px;margin-bottom: 2px" class="filter-item" v-model="listQuery.channel_id" :placeholder="$t('table.channelName')">
        <el-option v-for="item in channelList" :key="item.channel_id" :label="item.channel_name" :value="item.channel_id">
        </el-option>
      </el-select>
      <el-input style="max-width: 200px;margin-bottom: 2px" class="filter-item" :placeholder="$t('table.keyWord')" v-model="listQuery.key_words">
      </el-input>
      <el-date-picker
        v-model="expireTimeRegion"
        type="datetimerange"
        range-separator="-"
        value-format="yyyy-MM-dd HH:mm:ss"
        :start-placeholder="$t('table.startDate')"
        :end-placeholder="$t('table.endDate')">
      </el-date-picker>
      <el-button style="width: 8%;" type="primary" @click="getList()">{{$t('button.search')}}</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
              style="min-width: 950px;margin-top: 10px;">
      <el-table-column align="center" :label="$t('table.createTime')" style="max-width: 150px;min-width: 100px;">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column style="max-width: 150px;min-width: 100px;" align="center" :label="$t('table.channelName')">
        <template slot-scope="scope">
          <span>{{scope.row.channelName}}</span>
        </template>
      </el-table-column>
      <el-table-column style="max-width: 150px;min-width: 100px;" align="center" :label="$t('table.title')">
        <template slot-scope="scope">
          <span>{{scope.row.newsTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column style="max-width: 180px;min-width: 130px;" align="center" :label="$t('table.newSource')">
        <template slot-scope="scope">
          <span>{{scope.row.newsSource}}</span>
        </template>
      </el-table-column>
      <el-table-column style="max-width: 150px;min-width: 100px;" align="center" :label="$t('table.keyWord')">
        <template slot-scope="scope">
          <span>{{scope.row.realtionKeywords}}</span>
        </template>
      </el-table-column>
      <el-table-column style="max-width: 150px;min-width: 100px;" align="center" :label="$t('table.status')">
        <template slot-scope="scope">
          <el-tag :type="status | statusFilter">{{$t(`table.newsStatus${status}`)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="200px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="status == 2 || status == 4 || status == 32 || status == 1" size="mini" type="primary" @click="handleUpdate(scope.row)">{{$t('button.edit')}}
          </el-button>
          <el-button v-if="status == 8" size="mini" type="warning" @click="handleModifyStatus(scope.row)">{{$t('button.disable')}}
          </el-button>
          <el-button v-if="status == 1 || status == 4 || status == 32" size="mini" type="danger" @click="handleModifyStatus(scope.row)">{{$t('button.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10,20,30, 50]" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { fetchNewsList, fetchChannelList, deleteNews } from '@/api/news'
  import { parseTime } from '@/utils'
  export default {
    name: 'news-list',
    props: {
      status: {
        type: '',
        default: '1'
      }
    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        dialogLoading: false,
        channelList: [1, 2, 4, 8, 32],
        expireTimeRegion: [],
        statusList: [],
        listQuery: {
          page_no: 1,
          page_size: 10,
          channel_id: undefined,
          key_words: undefined,
          begin_date: undefined,
          end_date: undefined,
          new_state: ''
        },
        temp: {
          channel_name: '',
          title: '',
          keyword: '',
          description: '',
          status: ''
        },
        bakTemp: {}
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          // 1.待审核 2.已删除 4.已驳回 8.已发布 32.待发布
          8: 'success',
          2: 'danger',
          1: 'primary',
          4: 'warning',
          32: 'primary'
        }
        return statusMap[status]
      },
      formatTime(time) {
        return parseTime(time)
      }
    },
    created() {
      if (this.$store.getters.channelList === undefined || this.$store.getters.channelList === null) {
        this.fetchChannelList()
      } else {
        this.channelList = this.$store.getters.channelList
      }
      this.getList()
    },
    methods: {
      async getList() {
        this.listLoading = true
        try {
          if (this.expireTimeRegion !== null) {
            this.listQuery.begin_date = this.expireTimeRegion[0]
            this.listQuery.end_date = this.expireTimeRegion[1]
          }
          this.listQuery.new_state = this.status
          const response = await fetchNewsList(this.listQuery)
          if (response.data !== null) {
            this.list = response.data.list
            this.total = response.data.totalCount
          }
          this.listLoading = false
        } catch (error) {
          console.error(error)
          this.listLoading = false
          this.$message({
            message: this.$t('message.fetchListFail'),
            type: 'error'
          })
        }
      },
      async fetchChannelList() {
        try {
          const response = await fetchChannelList()
          this.channelList = response.data
          this.$store.dispatch('setChannelList', this.channelList)
        } catch (error) {
          console.error(error)
          this.$message({
            message: this.$t('message.fetchListFail'),
            type: 'error'
          })
        }
      },
      handleSizeChange(val) {
        this.listQuery.page_size = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page_no = val
        this.getList()
      },
      async handleModifyStatus(row, status) {
        try {
          // 删除和下线
          await deleteNews(row.newsId)
          this.$message({
            message: this.$t('message.changeStatusSucc'),
            type: 'success'
          })
          this.getList()
        } catch (error) {
          console.error(error)
          this.listLoading = false
          this.$message({
            message: this.$t('message.updateInfoFail'),
            type: 'error'
          })
        }
      },
      handleUpdate(row) {
        this.$store.dispatch('setNewsId', row.newsId)
        this.$router.push('editNews')
      }
    }
  }
</script>

<style scoped>

</style>

