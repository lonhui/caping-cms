<template>
  <div class="app-container calendar-list-container"  style="margin-top: 30px;">
    <div class="filter-container" style="min-width: 850px;">
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
          <span>{{scope.row.create_time}}</span>
        </template>
      </el-table-column>
      <el-table-column style="max-width: 150px;min-width: 100px;" align="center" :label="$t('table.channelName')">
        <template slot-scope="scope">
          <span>{{scope.row.channel_name}}</span>
        </template>
      </el-table-column>
      <el-table-column style="max-width: 150px;min-width: 100px;" align="center" :label="$t('table.title')">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <!-- 说明 -->
      <el-table-column style="max-width: 180px;min-width: 130px;" align="center" :label="$t('table.desc')">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column style="max-width: 150px;min-width: 100px;" align="center" :label="$t('table.keyWord')">
        <template slot-scope="scope">
          <span>{{scope.row.keyword}}</span>
        </template>
      </el-table-column>
      <el-table-column style="max-width: 150px;min-width: 100px;" align="center" :label="$t('table.expireTime')">
        <template slot-scope="scope">
          <span>{{scope.row.expire_time}}</span>
        </template>
      </el-table-column>
      <el-table-column style="max-width: 150px;min-width: 100px;" align="center" :label="$t('table.status')">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{$t(`table.advStatus${scope.row.status}`)}}</el-tag>
          </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="288px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('button.edit')}}</el-button>
          <el-button v-if="scope.row.status!=1" size="mini" type="success" @click="handleModifyStatus(scope.row,1)">{{$t('button.enable')}}
          </el-button>
          <el-button v-else-if="scope.row.status!=0" size="mini" @click="handleModifyStatus(scope.row,0)">{{$t('button.disable')}}
          </el-button>
          <el-button v-if="scope.row.status!=-1" size="mini" type="danger" @click="handleModifyStatus(scope.row,-1)">{{$t('button.delete')}}
          </el-button>
          <a @click="rise(scope.row)"><svg-icon  class-name="arrow_icon" icon-class="Arrow_up" /></a>
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
  import { fetchList, deleteAdv, disableAdv, enableAdv } from '@/api/adv'
  export default {
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        dialogLoading: false,
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          begin_time: '',
          end_time: ''
        },
        expireTimeRegion: [],
        temp: {
          channel_name: '',
          title: '',
          keyword: '',
          expire_time: '',
          description: '',
          status: ''
        },
        bakTemp: {}
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          // 0 下线， 1 上线， 删除
          1: 'success',
          0: 'warning',
          '-1': 'danger'
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      async getList() {
        this.listLoading = true
        try {
          if (this.expireTimeRegion !== null) {
            this.listQuery.begin_time = this.expireTimeRegion[0]
            this.listQuery.end_time = this.expireTimeRegion[1]
          }
          const response = await fetchList(this.listQuery)
          if (response.data === null) {
            this.listLoading = false
            this.$message({
              message: this.$t('message.listDataIsNull'),
              type: 'warning'
            })
          }
          this.list = response.data.ads
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].description.length > 40) {
              this.list[i].description = this.list[i].description.substring(0, 20) + '……'
            }
            if (this.list[i].title.length > 40) {
              this.list[i].title = this.list[i].title.substring(0, 20) + '……'
            }
          }
          this.total = response.data.totalCount
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
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getList()
      },
      async handleModifyStatus(row, status) {
        try {
          if (row.status === status) return
          this.listLoading = true
          if (status === -1) {
            await deleteAdv(row.id)
            this.getList()
          }
          if (status === 0) {
            await disableAdv(row.id)
            this.getList()
          }
          if (status === 1) {
            await enableAdv(row.id)
            this.getList()
          }
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
        this.$store.dispatch('setAdv', row)
        this.$router.push('editAdv')
      },
      rise(row) {
        row.sort = row.sort + 1
        this.$axios.post('/adv/update', {
          id: row.id,
          sort: row.sort
        },
        {
          'header': { 'Content-Type': 'application/json' }
        }
        ).then(function(res) {
          console.log(res)
          this.getList()
        }, function(error) {
          console.log(error)
        })
      }
    }
  }
</script>

<style scoped>
.arrow_icon{
  font-size: 20px;
}
</style>

