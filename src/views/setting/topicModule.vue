<template>
    <div class="custom-tree-container">
      <div class="button" v-show="show">
          <el-button type="primary" plain @click="addFu">{{$t('button.Addparentmodule')}}</el-button>
        </div>
      <div class="block" v-show="show">
        
          <el-tree
          :data="data"
          node-key="ChannelId"
          :props="defaultProps"
          :expand-on-click-node="false"
          v-loading="loading">
          <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label}}</span>
              <span>
              <el-button type="text" size="mini" @click="() => openEdit(data)">
                <i class="el-icon-edit"></i>
                {{$t('button.edit')}}
              </el-button>
              <el-button type="text" size="mini" @click="() => openAppend(data)">
                  <i class="el-icon-circle-plus-outline"></i>
                  {{$t('button.add')}}
              </el-button>
              <!-- 删除按钮 -->
              <!-- <el-button type="text" size="mini" @click="() => open7(node, data)">
                  <i class="el-icon-delete"></i> 
                  {{$t('button.delete')}}
              </el-button> -->
              </span>
          </span>
          </el-tree>
      </div>
      <div class="add" v-show="!show">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item :label="$t('table.channelName')">
            <el-input v-model="form.ChannelName" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.status')">
            <el-switch v-model="form.OnlineState" :active-text="$t('table.status1')" :inactive-text="$t('table.status0')"></el-switch>
          </el-form-item>
          <div class="up">
          <!-- ImageUrl -->
          <el-form-item :label="$t('table.picture')" class="upImg">
              <el-upload
                class="avatar-uploader"
                name="imageData"	
                :data="type_ImageUrl"
                :action="appIconUploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess_ImageUrl"
                :before-upload="beforeAvatarUpload"
                :on-error="handleAvatarError"
                :on-progress="handleAvatarProgress_ImageUrl">
                <img v-if="form.ImageUrl || updata" :src="ImageUrl" class="avatar">
                <i v-else class="avatar-uploader-icon el-icon-plus" v-loading="ImageUrlloading"
                  element-loading-text="Loading"></i>
              </el-upload>
          </el-form-item>
          <!-- icon -->
            <el-form-item :label="$t('table.icon')" class="upImg imgUp">
                <el-upload
                  class="avatar-uploader"
                  name="imageData"	
                  :data="type_icon"
                  :action="appIconUploadUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess_icon"
                  :before-upload="beforeAvatarUpload"
                  :on-error="handleAvatarError"
                  :on-progress="handleAvatarProgress_icon">
                  <img v-if="form.Icon || updata" :src="icon" class="avatar">
                  <i v-else class="avatar-uploader-icon el-icon-plus" v-loading="iconUploading"
                    element-loading-text="Loading"></i>
                </el-upload>
            </el-form-item>
            <!-- BackImgUrl -->
            <el-form-item :label="$t('table.backpicture')" class="upImg imgUp">
                <el-upload
                  class="avatar-uploader"
                  name="imageData"	
                  :data="type_BackImgUrl"
                  :action="appIconUploadUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess_BackImgUrl"
                  :before-upload="beforeAvatarUpload"
                  :on-error="handleAvatarError"
                  :on-progress="handleAvatarProgress_BackImgUrl">
                  <img v-if="form.BackImgUrl || updata" :src="BackImgUrl" class="avatar">
                  <i v-else class="avatar-uploader-icon el-icon-plus" v-loading="BackImgUrlloading"
                    element-loading-text="Loading"></i>
                </el-upload>
            </el-form-item>
          </div><br>
            <el-form-item :label="$t('table.versionNum')">
              <el-input v-model="form.MinVersion" style="width: 200px"></el-input>
            </el-form-item>
          <el-form-item label="DeepLink">
            <!-- <el-input v-model="form.DeepLink" style="width: 400px"></el-input> -->
            <el-cascader :options="options"  v-model="selectedOptions" :clearable='true' class="urlOrid" style="width: 380px"></el-cascader>
            <el-form-item :label='urlOrid' v-show="urlShow" class="urlOrid">
              <el-input v-model="url" style="width: 300px"></el-input>
            </el-form-item>
            <el-input v-model="form.DeepLink" :disabled="true" click="deeplink"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="console()">{{$t('button.cancel')}}</el-button>
            <el-button type="primary" @click="submit">{{$t('button.confirm')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
let id = 1000;

  export default {
    data() {
      const data = [];
      return {
        options: [{
          value: '1',
          label: this.$t('button.General'),
          children: [{
              value: '1024',
              label: this.$t('button.Specialtopic')
            }, {
              value: '2048',
              label: this.$t('button.Makecomplaints')
            }, {
              value: '3001',
              label: this.$t('button.Pointsdetails')
            }, {
              value: '3002',
              label: this.$t('button.Checkin')
            },{
              value: '3003',
              label: this.$t('button.Entercode')
            },{
              value: '3004',
              label: this.$t('button.Productlist')
            },{
              value: '3005',
              label: this.$t('button.Collection')
            },{
              value: '3006',
              label: this.$t('button.Setinterface')
            },{
              value: '3007',
              label: this.$t('button.Notificationinterface')
            },{
              value: '3008',
              label: this.$t('button.Helpinterface')
            }]
        },{
          value: '2',
          label: this.$t('button.JumpwebView'),
          children: [{
              value: '1024',
              label: this.$t('button.Specialtopic')
            }, {
              value: '2048',
              label: this.$t('button.Makecomplaints')
            }, {
              value: '3001',
              label: this.$t('button.Pointsdetails')
            }, {
              value: '3002',
              label: this.$t('button.Checkin')
            },{
              value: '3003',
              label: this.$t('button.Entercode')
            },{
              value: '3004',
              label: this.$t('button.Productlist')
            },{
              value: '3005',
              label: this.$t('button.Collection')
            },{
              value: '3006',
              label: this.$t('button.Setinterface')
            },{
              value: '3007',
              label: this.$t('button.Notificationinterface')
            },{
              value: '3008',
              label: this.$t('button.Helpinterface')
            }]
        }], 
        selectedOptions: [],
        data: JSON.parse(JSON.stringify(data)),
        defaultProps: {
          children: 'ChildChannel',
          label: 'ChannelName'
        },
        show: true,
        //表单提交数据
        form: {},
        // 图片上传
        appIconUploadUrl: 'https://ai.caping.co.id/Start/uploadpic', //请求地址
        type_ImageUrl:{
          imageType:8	
        },
         type_icon:{
          imageType:8
        },
         type_BackImgUrl:{
          imageType:8
        },
        loading:false,
        // 页面显示的图片
        updata:false,
        ImageUrl:'',
        icon:'',
        BackImgUrl:'',
        iconUploading:false,//上传时加载标
        BackImgUrlloading:false,
        ImageUrlloading:false,
        urlShow:false,
        urlOrid:'',
        url:null,
        // 必填项
        rules: {
          
        }

      }
    },
    beforeMount(){
      this.getData()
    },
    methods: {
      // 获取模块数据
      getData(){
        this.loading = true
        this.$axios.get('/channel/cms/list')
        .then ((res)=>{
          console.log(res)
          this.data = res.data.data
          this.loading = false
        })
        .catch((error)=>{
          this.loading = false
          console.log(error)
        })
      },
      // 添加父模块
      addFu(){
        this.form = {
          ParentId:0,
          ChannelName: '',
          OnlineState: true,
          ImageUrl:'', 
          Icon: '',
          BackImgUrl: '',
          DeepLink: '',
          MinVersion:'',
          appId:1
        }
        this.selectedOptions = []
        this.urlShow = false
        this.url = null
        this.show = false
      },
      // 添加
      openAppend(data) {
        this.form = {
          ParentId:data.ChannelId,
          ChannelName: '',
          OnlineState: true,
          ImageUrl:'', 
          Icon: '',
          BackImgUrl: '',
          DeepLink: '',
          MinVersion:''
        }
        this.selectedOptions = []
        this.urlShow = false
        this.url = null
        this.show = false
      },
      console(){
        this.show = true
        this.updata = false
      },
      // 添加或修改提交
      submit(){
        this.show = true
        if(this.form.OnlineState){
          this.form.OnlineState = 1
        }else{
          this.form.OnlineState = 2
        }
        this.$axios.post(
          '/channel/cms/save',
          this.form,
          {'header':{'Content-Type':'application/json'}}
        )
        .then ((res)=>{
          console.log(res)
          if(res.data.code===0){
             this.$message.success(this.$t('message.createSucc'))
             this.getData()
             return
          }else{
            this.$message.error(this.$t('message.updateInfoFail'))
          }
          this.updata = false
        })
        .catch((error)=>{
          console.log(error)
        })
      },
      // 删除
      remove(node, data) {
        console.log(data.ChannelId)
      },
      //编辑
      openEdit(data){
        this.selectedOptions = []
        this.urlShow = false
        this.url = null
        this.show = false
        this.form = {
          ChannelId: data.ChannelId,
          ChannelName: data.ChannelName,
          OnlineState: data.OnlineState,
          ImageUrl: null, 
          Icon: null,
          BackImgUrl: null,
          DeepLink: data.DeepLink,
          MinVersion: data.MinVersion
        }
        this.ImageUrl = data.ImageUrl
        this.icon = data.Icon
        this.BackImgUrl = data.BackImgUrl
        this.updata = true
        if (this.form.OnlineState === 1) {
          this.form.OnlineState = true
        }else{
          this.form.OnlineState = false
        }
        console.log(this.form)
        console.log(data)
      },
      // 图片上传
      handleAvatarSuccess_ImageUrl(res, file) {//上传成功后执行
        this.form.ImageUrl = res.Message
        this.ImageUrl = file.url
        this.ImageUrlloading = false
      },
      handleAvatarSuccess_icon(res, file) {//上传成功后执行
        this.form.Icon = res.Message
        this.icon = file.url
        this.iconUploading = false
      },
      handleAvatarSuccess_BackImgUrl(res, file) {//上传成功后执行
        this.form.BackImgUrl = res.Message
        this.BackImgUrl = file.url
        this.BackImgUrlloading = false
      },
      beforeAvatarUpload(file) {//判断图片格式及大小做出限制
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
        this.BackImgUrlloading = false
        this.ImageUrlloading = false
      },
      handleAvatarProgress_ImageUrl() {
        this.ImageUrlloading = true
      },
      handleAvatarProgress_icon() {
        this.iconUploading = true
      },
      handleAvatarProgress_BackImgUrl() {
        this.BackImgUrlloading = true
      },
      // 确认删除弹框
      open7(node, data) {
        this.$confirm(this.$t('message.deleteData'), this.$t('message.warn'), {
          confirmButtonText: this.$t('button.confirm'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning',
          center: true
        }).then(() => {
          this.remove(node, data)
          this.$message({
            type: 'success',
            message: this.$t('message.deletedSucc')
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.undelete')
          });
        });
      }
  },
  watch:{
    'url':function(){
      if(this.selectedOptions[0]==1){
          this.form.DeepLink = 'capingnews://m.caping.com?type='+this.selectedOptions[1]+'&id='+this.url
        }else if(this.selectedOptions[0]==2){
          this.form.DeepLink = 'capingnews://m.caping.com?type='+this.selectedOptions[1]+'&url='+this.url
        }
        
    },
    'selectedOptions':function(){
        if(this.selectedOptions[0]==1){
          this.urlOrid = 'ID'
          this.url = 0
          this.urlShow =true
        }else if(this.selectedOptions[0]==2){
          this.urlOrid = 'Url'
          this.url = ''
          this.urlShow =true
        }else{
          this.urlShow = false
          this.url = null
          this.form.DeepLink = null
        }
    }
  }
}
</script>

<style scoped>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
.block{
    width: 60%;
    margin: 20px auto 0;
}
.add{
  width: 700px;
  margin: 20px 0 0 50px;
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
.upImg{
  float: left;
}
.imgUp{
  margin-left: 50px;
}
.up{
  height: 120px;
}
.urlOrid{
  float: left
}
.deeplink{
  padding-top: 20px 
}
.button{
  width: 60%;
  height: 40px;
  margin: 20px auto 0;
}
.button button{
  float: right;
}
</style>
