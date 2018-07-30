<template>
  <div class="app-container calendar-list-container"  style="margin-top: 30px;">
    <div class="filter-container" style="min-width: 850px;">
      <el-select clearable style="width: 200px;margin-bottom: 0px" class="filter-item" v-model="listQuery.channel_id" :placeholder="$t('table.channelName')">
        <el-option v-for="item in channelList" :key="item.channel_id" :label="item.channel_name" :value="item.channel_id">
        </el-option>
      </el-select>
      <el-input style="width: 200px;margin-bottom: 0px" class="filter-item" :placeholder="$t('table.keyWord')" v-model="listQuery.key_words">
      </el-input>
      <el-button style="width: 8%;" type="primary" @click="getList()">{{$t('button.search')}}</el-button>
    </div>
    <el-table :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
              style="min-width: 950px;margin-top: 10px;">
      <el-table-column align="center" :label="$t('table.createTime')" style="max-width: 150px;min-width: 100px;">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column style="max-width: 150px;min-width: 100px;" align="center" :label="$t('table.channelID')">
        <template slot-scope="scope">
          <span>{{scope.row.channelID}}</span>
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
          <span>{{scope.row.keywords}}</span>
        </template>
      </el-table-column>
      <el-table-column style="max-width: 150px;min-width: 100px;" align="center" :label="$t('table.status')">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isPush | statusFilter">{{$t(`table.newsPush${scope.row.isPush}`)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="200px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleUpdate(scope.row)">{{$t('button.edit')}}
          </el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row)">{{$t('button.delete')}}
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
  import { fetchDraftsList, fetchChannelList, deleteDraft } from '@/api/news'
  import { parseTime } from '@/utils'
  export default {
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        channelList: [],
        listQuery: {
          page_no: 1,
          page_size: 10,
          channel_id: undefined,
          key_words: undefined
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
          // 1 已发布， 未发布
          1: 'success',
          2: 'warning'
        }
        return statusMap[status]
      },
      formatTime(time) {
        return parseTime(time)
      }
    },
    created() {
      this.fetchChannelList()
      this.getList()
    },
    methods: {
      async getList() {
        this.listLoading = true
        try {
          const response = await fetchDraftsList(this.listQuery)
          if (response.data) {
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
      async handleModifyStatus(row) {
        try {
          this.listLoading = true
          await deleteDraft(row.newsDraftsId)
          this.getList()
          this.listLoading = false
          this.$message({
            message: this.$t('message.changeStatusSucc'),
            type: 'success'
          })
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
        this.$store.dispatch('setDraftNewsId', row.newsDraftsId)
        this.$router.push('editDraftNews')
      }
    }
  }
</script>

<style scoped>

</style>

