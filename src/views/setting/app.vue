<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('button.add')}}</el-button>
    </div>
    <!-- 应该管理 -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
      style="width: 100%">
      <!-- <el-table-column align="center" :label="$t('table.id')" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="200px" align="center" :label="$t('table.appId')">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" :label="$t('table.appName')">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.app_name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="$t('table.desc')">
        <template slot-scope="scope">
          <span>{{scope.row.comment}}</span>
          <!-- <el-tag>{{scope.row.type | typeFilter}}</el-tag> -->
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
          <el-button size="mini" type="success" @click="handleConfig(scope.row.id)">{{$t('button.config')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listData.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-loading="dialogLoading" element-loading-text="Loading">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.appName')" prop="app_name">
          <el-input v-model="temp.app_name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.appIcon')" prop="icon">
          <el-upload class="app-icon-uploader" 
            :action="appIconUploadUrl" 
            name="image" 
            :show-file-list="false" 
            :on-success="handleAppIconSuccess" 
            :on-error="handleAppIconError" 
            :before-upload="beforeAppIconUpload" 
            :on-progress="handleAppIconProgress" 
            v-loading="iconUploading" 
            element-loading-spinner="el-icon-loading">
            <img alt="" class="app-icon" v-if="imageUrl" :src="imageUrl">
            <i class="el-icon-plus app-icon-uploader-icon" v-else></i>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'update'" :label="$t('table.status')">
          <el-select class="filter-item" v-model="temp.status" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="$t('table.status' + item)" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.comment')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.comment">
          </el-input>
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
import { fetchList, create, update } from '@/api/app'
import { deepCopy } from '@/utils'

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
        pageSize: 20
      },
      statusOptions: [0, 1],
      temp: {
        id: undefined,
        app_name: '',
        icon: '',
        comment: '',
        status: 1
      },
      bakTemp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: this.$t('button.edit'),
        create: this.$t('button.add')
      },
      // FIXME: 增加对图片的检查
      rules: {
        app_name: [
          { required: true, message: this.$t('message.appNameRequired'), trigger: 'blur' }
        ],
        icon: [{ required: true, message: this.$t('message.appIconRequired') }]
      },
      appIconUploadUrl: '',
      imageUrl: '',
      iconUploading: false
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
    this.appIconUploadUrl = process.env.BASE_API + '/adv/image/upload'
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const response = await fetchList(this.listData)
        this.list = response.data.apps
        this.total = response.data.totalCount
        this.listLoading = false
      } catch (error) {
        console.error(error)
        this.listLoading = false
      }
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        app_name: '',
        icon: '',
        comment: '',
        status: 1
      }
      this.imageUrl = ''
      this.iconUploading = false
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
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
            this.imageUrl = ''
            this.getList()
          } catch (error) {
            console.error(error)
            this.dialogLoading = false
          }
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.imageUrl = this.temp.icon
      this.bakTemp = deepCopy(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新配置
    updateData() {
      this.$refs['dataForm'].validate(async valid => {
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
            this.imageUrl = ''
            this.getList()
          } catch (error) {
            console.error(error)
            this.dialogLoading = false
          }
        }
      })
    },
    // 跳转到应用配置页面
    handleConfig(id) {
      this.$store.dispatch('setAppConfigId', id)
      this.$router.push('app-config')
    },
    handleCurrentChange(val) {
      this.listData.pageNo = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listData.pageSize = val
      this.getList()
    },
    // 文件上传前对类型、大小的检验
    beforeAppIconUpload(file) {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) > -1
      // 目前设置为2M
      const isValidSize = file.size / 1024 / 1024 < 2
      if (!isValidType) {
        this.$message.error(this.$t('message.invalidFileType'))
      } else if (!isValidSize) {
        this.$message.error(this.$t('message.invalidFileSize'))
      }
      return isValidType && isValidSize
    },
    handleAppIconSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.temp.icon = res.data
      this.iconUploading = false
    },
    handleAppIconProgress() {
      this.iconUploading = true
    },
    // TODO: 针对文件上传失败后的更多处理
    handleAppIconError(err, file) {
      this.$message.error(err)
      this.iconUploading = false
    }
  }
}
</script>

<style lang="scss">
.app-icon-uploader {
  display: inline-block;

  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #409eff;
    }
  }
}
.app-icon-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.app-icon {
  width: 80px;
  height: 80px;
  display: block;
}
</style>

