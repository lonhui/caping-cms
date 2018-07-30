<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('button.add')}}</el-button>
    </div>
    <!-- 应用管_配置 -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row
      style="width: 100%">
      <el-table-column width="200px" align="center" :label="$t('table.key')">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.config_key}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" :label="$t('table.value')">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.config_value}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="150px" :label="$t('table.comment')">
        <template slot-scope="scope">
          <span>{{scope.row.config_comment}}</span>
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

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listData.pageNo" :page-sizes="[10,20,30, 50]" :page-size="listData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <!-- 编辑 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-loading="dialogLoading" element-loading-text="Loading">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('table.key')" prop="config_key">
          <el-input v-model="temp.config_key"></el-input>
        </el-form-item>
        <!-- 图 -->
        <el-form-item :label="$t('table.picture')" v-if="temp.config_key ==='splashImg'">
          <el-upload
            class="avatar-uploader"
            name="imageData"
            :data="a"
            :action="appIconUploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarError"
            :on-progress="handleAvatarProgress">
            <img v-if="img_url " :src="imgUrl" class="avatar">
            <i v-else class="avatar-uploader-icon el-icon-plus" v-loading="iconUploading"
              element-loading-text="Loading"></i>
          </el-upload>
      </el-form-item>
        <!-- 值 -->
        <el-form-item :label="$t('table.value')" prop="config_value" v-else>
          <el-input v-model="temp.config_value"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'update'" :label="$t('table.status')">
          <el-select class="filter-item" v-model="temp.status" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="$t('table.status' + item)" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.comment')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" :placeholder="$t('table.pleaseInput')" v-model="temp.config_comment">
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
import { fetchList, create, update } from '@/api/config'
import { deepCopy } from '@/utils'

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      dialogLoading: false,
      listData: {
        pageNo: 1,
        pageSize: 20,
        app_id: Number(this.$store.getters.appConfigId)
      },
      statusOptions: [0, 1],
      temp: {
        id: undefined,
        app_id: Number(this.$store.getters.appConfigId),
        config_key: '',
        config_value: '',
        config_comment: '',
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
        config_key: [{ required: true, message: this.$t('message.keyRequired'), trigger: 'change' }],
        config_value: [
          { required: true, message: this.$t('message.valueRequired'), trigger: 'change' }
        ]
      },
      appIconUploadUrl: 'https://ai.caping.co.id/Start/uploadpic',
      a: {
        imageType: 8
      },
      imgUrl: '',
      img_url: '',
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
    // 若不是从『应用管理』点击进来，则跳到『应用管理』去
    if (!this.$store.getters.appConfigId) {
      this.$alert(this.$t('message.mustFromAppManage'), this.$t('message.warn'), {
        confirmButtonText: this.$t('button.confirm'),
        callback: action => {
          this.$router.push({ path: '/setting/app' })
        }
      })
    } else {
      console.info(this.listData)
      this.getList()
    }
  },
  methods: {
    // 拉取应用所有配置
    async getList() {
      this.listLoading = true
      try {
        const response = await fetchList(this.listData)
        this.list = response.data.configList
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
        app_id: Number(this.$store.getters.appConfigId),
        config_key: '',
        config_value: '',
        config_comment: '',
        status: 1
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // /图片上传
    handleAvatarSuccess(res, file) {
      this.img_url = res.Message
      this.imgUrl = file.url
      this.iconUploading = false
      this.temp.config_value = this.img_url
    },
    beforeAvatarUpload(file) {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) > -1
      const isValidSize = file.size / 1024 / 1024 < 2
      if (!isValidType) {
        this.$message.error(this.$t('message.invalidFileType'))
      } else if (!isValidSize) {
        this.$message.error(this.$t('message.invalidFileSize'))
      }
      return isValidType && isValidSize
    },
    handleAvatarError(err, file) {
      this.$message.error(err)
      this.iconUploading = false
    },
    handleAvatarProgress() {
      this.iconUploading = true
    },
    // 创建配置
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
            this.getList()
          } catch (error) {
            console.error(error)
            this.dialogLoading = false
          }
        }
      })
    },
    // 删除配置，目前是通过修改状态来逻辑删除
    async handleModifyStatus(row, status) {
      try {
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

<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>

