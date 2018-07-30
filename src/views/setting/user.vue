<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.account')" v-model="listData.account">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('button.search')}}</el-button> -->
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" :label="$t('table.account')">
        <template slot-scope="scope">
          <span>{{scope.row.account_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.fullName')">
        <template slot-scope="scope">
          <span>{{scope.row.real_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.mobileNumber')">
        <template slot-scope="scope">
          <span>{{scope.row.user_phone}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.role')">
        <template slot-scope="scope">
          <span>{{scope.row.role_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.createTime')">
        <template slot-scope="scope">
          <span>{{scope.row.create_time}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.relatedApp')">
        <template slot-scope="scope">
          <span>{{scope.row.app_name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.app_name" type="primary" size="mini" @click="handleBind(scope.row)">{{$t('button.relateApp')}}</el-button>
          <el-button v-if="!scope.row.role_name" type="success" size="mini" @click="handleAssign(scope.row)">{{$t('button.assignRole')}}</el-button>
          <span v-if="scope.row.app_name && scope.row.role_name">/</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listData.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-loading="dialogLoading" element-loading-text="Loading">
      <el-table height="300" ref="singleTable" :data="tableData" highlight-current-row @current-change="handleCurrentChoose">
        <el-table-column property="id" label="#" width="100" align="center"></el-table-column>
        <el-table-column :property="dialogStatus === 'relateApp' ? 'app_name' : 'name'" :label="dialogStatus === 'relateApp' ? $t('table.appName') : $t('table.roleName')" width="200"></el-table-column>
        <el-table-column :property="dialogStatus === 'relateApp' ? 'comment' : 'description'" :label="dialogStatus === 'relateApp' ? $t('table.comment') : $t('table.desc')"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('button.cancel')}}</el-button>
        <el-button type="primary" @click="updateData(dialogStatus)">{{$t('button.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, bindApp, assignRole } from '@/api/sys/user'
import { fetchList as fetchRole } from '@/api/sys/role'
import { fetchList as fetchApp } from '@/api/app'

// TODO: 目前server不支持覆盖角色与app，因此「绑定应用」与「分配角色」按钮在绑定过后会隐藏
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      dialogLoading: false,
      listData: {
        pageNo: 1,
        pageSize: 20,
        account: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        relateApp: this.$t('button.relateApp'),
        assignRole: this.$t('button.assignRole')
      },
      rules: {
        config_key: [
          { required: true, message: this.$t('message.keyRequired'), trigger: 'change' }
        ],
        config_value: [
          { required: true, message: this.$t('message.valueRequired'), trigger: 'change' }
        ]
      },
      tableData: [],
      currentRow: null,
      user_id: undefined
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 拉取所有用户
    async getList() {
      this.listLoading = true
      try {
        const response = await fetchList(this.listData)
        this.list = response.data.users
        this.total = response.data.totalCount
        this.listLoading = false
      } catch (error) {
        console.error(error)
        this.listLoading = false
      }
    },
    handleCurrentChange(val) {
      this.listData.pageNo = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listData.pageSize = val
      this.getList()
    },
    // TODO: 需要用户查询接口
    handleFilter() {
      this.listData.page = 1
      this.getList()
    },
    // 绑定应用
    async handleBind(row) {
      this.dialogStatus = 'relateApp'
      this.listLoading = true
      this.user_id = row.account_id
      try {
        // TODO: 目前此处先不作分页，先多拉点数据出来
        const resp = await fetchApp({
          pageNo: 1,
          pageSize: 100
        })
        this.tableData = resp.data.apps
        this.listLoading = false
        this.dialogFormVisible = true
      } catch (error) {
        console.error(error)
        this.listLoading = false
        this.$message({
          message: this.$t('message.fetchAppFail'),
          type: 'error'
        })
      }
    },
    // 分配角色，角色拉取目前server并没有分页
    async handleAssign(row) {
      this.dialogStatus = 'assignRole'
      this.listLoading = true
      this.user_id = row.account_id
      try {
        const resp = await fetchRole()
        this.tableData = resp.data.roles
        this.listLoading = false
        this.dialogFormVisible = true
      } catch (error) {
        console.error(error)
        this.listLoading = false
        this.$message({
          message: this.$t('message.fetchRoleFail'),
          type: 'error'
        })
      }
    },
    async updateData(dialogStatus) {
      if (this.currentRow === null) {
        this.$message({
          message: this.$t('message.mustSelectOneData'),
          type: 'error'
        })
      } else {
        const data = { user_id: this.user_id }
        const notify = {
          title: this.$t('message.succ'),
          message: this.$t('message.updateSucc'),
          type: 'success',
          duration: 2000
        }
        this.dialogLoading = true
        if (dialogStatus === 'relateApp') {
          data.app_id = this.currentRow.id
          try {
            await bindApp(data)
            this.dialogLoading = false
            this.$notify(notify)
            this.dialogFormVisible = false
            this.getList()
          } catch (error) {
            console.error(error)
            this.dialogLoading = false
          }
        } else if (dialogStatus === 'assignRole') {
          data.role_id = this.currentRow.id
          try {
            await assignRole(data)
            this.dialogLoading = false
            this.$notify(notify)
            this.dialogFormVisible = false
            this.getList()
          } catch (error) {
            console.error(error)
            this.dialogLoading = false
          }
        }
      }
    },
    handleCurrentChoose(val) {
      this.currentRow = val
    }
  }
}
</script>
