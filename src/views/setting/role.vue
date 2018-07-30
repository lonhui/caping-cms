<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.account')" v-model="listData.account">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('button.search')}}</el-button> -->
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('button.add')}}</el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
      style="width: 100%">
      <el-table-column align="center" :label="$t('table.roleName')">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" min-width="150px" :label="$t('table.comment')">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" :label="$t('table.status')" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{$t(`table.status${scope.row.status}`)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('button.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,0)">{{$t('button.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listData.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div> -->

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-loading="dialogLoading" element-loading-text="Loading">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.roleName')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.comment')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="$t('table.pleaseInput')" v-model="temp.description">
          </el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'update'" :label="$t('table.status')">
          <el-select class="filter-item" v-model="temp.status" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="$t('table.status' + item)" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.menu')">
          <el-tree
            :data="menus"
            show-checkbox
            node-key="id"
            ref="tree"
            @check-change="handleCheckChange"
            :props="defaultProps">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('button.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('button.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('button.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, create, update, detail } from '@/api/sys/role'
import { deepCopy } from '@/utils'
import menus from '@/config/menus'

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
      statusOptions: [0, 1],
      temp: {
        id: undefined,
        name: '',
        description: '',
        menuIds: '',
        status: 1
      },
      bakTemp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('button.edit'),
        create: this.$t('button.add')
      },
      rules: {
        name: [{ required: true, message: this.$t('message.keyRequired'), trigger: 'change' }]
      },
      defaultProps: {
        children: 'children',
        label: data => this.$t('route.' + data.label)
      },
      menus,
      authorizedMenus: []
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        // 0 无效， 1 有效
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 拉取所有角色
    async getList() {
      this.listLoading = true
      try {
        console.info(this.listData)
        const response = await fetchList(this.listData)
        this.list = response.data.roles
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
    // TODO: 需要角色查询接口
    handleFilter() {
      this.listData.page = 1
      this.getList()
    },
    handleBind(row) {
      console.info(row.account_id)
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        description: '',
        menuIds: '',
        status: 1
      }
      this.authorizedMenus = []
    },
    // FIXME: 目前无法关闭展开的节点
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs['tree'].setCheckedKeys(this.authorizedMenus)
      })
    },
    createData() {
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          this.temp.menuIds = this.authorizedMenus.join(',') + ',' + this.$refs.tree.getHalfCheckedKeys().join(',')
          try {
            this.dialogLoading = true
            await create(this.temp)
            this.dialogLoading = false
            this.$notify({
              title: this.$t('message.succ'),
              message: this.$t('message.createSucc'),
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            this.getList()
          } catch (error) {
            console.error(error)
            this.dialogLoading = false
          }
        }
      })
    },
    // 修改角色时需要先将该角色所有的菜单列表查询出来
    async handleUpdate(row) {
      try {
        this.listLoading = true
        const resp = await detail(row)
        this.listLoading = false
        this.authorizedMenus = resp.data.menus === null ? [] : resp.data.menus.filter(item => { return item.parent_id !== 0 ? item : null }).map(item => item.id)
        // this.authorizedMenus = resp.data.menus === null ? [] : resp.data.menus.map(item => item.id)
        this.temp = Object.assign({}, row)
        this.temp.menuIds = this.authorizedMenus.join(',')
        // 深拷贝备份下数据，避免无修改提交
        this.bakTemp = deepCopy(this.temp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
          this.$refs['tree'].setCheckedKeys(this.authorizedMenus)
        })
      } catch (error) {
        console.error(error)
        this.listLoading = false
        this.$message({
          message: this.$t('message.fetchRoleInfoFail'),
          type: 'error'
        })
      }
    },
    // 更新通用配置
    updateData() {
      this.$refs['dataForm'].validate(async valid => {
        this.temp.menuIds = this.authorizedMenus.join(',') + ',' + this.$refs.tree.getHalfCheckedKeys().join(',')
        if (valid && JSON.stringify(this.temp) !== JSON.stringify(this.bakTemp)) {
          try {
            this.dialogLoading = true
            await update(this.temp)
            this.dialogLoading = false
            this.$notify({
              title: this.$t('message.succ'),
              message: this.$t('message.updateSucc'),
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            this.getList()
          } catch (error) {
            console.error(error)
            this.dialogLoading = false
          }
        }
      })
    },
    /**
     * 菜单选中状态变化监听
     * @param data 传递给 data 属性的数组中该节点所对应的对象
     * @param checked 节点本身是否被选中
     * @param indeterminate 节点的子树中是否有被选中的节点
     */
    handleCheckChange(data, checked, indeterminate) {
      const index = this.authorizedMenus.indexOf(data.id)
      // 节点被取消选中
      if (!checked && index > -1) {
        this.authorizedMenus.splice(index, 1)
      }
      // 选中节点
      if (checked && index < 0) {
        this.authorizedMenus.push(data.id)
        if (data.children && data.children.length > 0) {
          data.children.forEach(item => {
            if (this.authorizedMenus.indexOf(item.id) < 0) {
              this.authorizedMenus.push(item.id)
            }
          })
        }
        // sort是为了 无修改提交时的比较
        this.authorizedMenus.sort((a, b) => a - b)
      }
    },
    async handleModifyStatus(row, status) {
      try {
        console.info(row)
        if (row.status === status) return
        this.listLoading = true
        row.status = status
        await update(row)
        this.listLoading = false
        this.$message({
          message: this.$t('message.changeStatusSucc'),
          type: 'success'
        })
      } catch (error) {
        console.error(error)
        this.listLoading = false
      }
    }
  }
}
</script>
