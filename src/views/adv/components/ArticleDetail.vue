<template>
  <div class="app-container" style="width: 745px; margin-top: 40px;">
    <el-form :rules="rules" ref="dataForm" :model="newAdv" label-width="150px">
      <div>
        <el-form-item class="add_layout" :label="$t('table.title')" prop="title">
          <el-input v-model="newAdv.title"  style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item class="add_layout" :label="$t('table.keyWord')" prop="keyword">
          <el-input v-model="newAdv.keyword" style="width: 200px"></el-input>
        </el-form-item>
      </div>
      <div>
        <el-form-item class="add_layout" :label="$t('table.channelName')">
          <el-input style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item class="add_layout" :label="$t('table.expireTime')"  prop="expire_time">
          <el-date-picker
            style="width: 200px"
            v-model="newAdv.expire_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :placeholder="$t('table.expireTime')">
          </el-date-picker>
        </el-form-item>
      </div>
      <el-form-item :label="$t('table.desc')" prop="description">
        <el-input v-model="newAdv.description" style="width: 555px"></el-input>
      </el-form-item>
      <el-form-item :label="$t('table.picture')">
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
          <img v-if="newAdv.img_url " :src="imgUrl" class="avatar">
          <i v-else class="avatar-uploader-icon el-icon-plus" v-loading="iconUploading"
             element-loading-text="Loading"></i>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('table.advVideoUrl')">
        <el-input v-model="newAdv.video_url" style="width: 410px"></el-input>
        <el-input v-model="newAdv.video_time" :placeholder="$t('table.advVideoTime')" style="width: 140px"></el-input>
      </el-form-item>
      <el-form-item :label="$t('table.advType')">
        <el-button-group>
          <el-button :class="{ active: active === 'web' }" @click="active = 'web'">Web</el-button>
          <el-button :class="{ active: active === 'app' }" @click="active = 'app'">App</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item v-if="active === 'web'" :label="$t('table.advWebUrl')">
        <el-input v-model="newAdv.web_url" style="width: 555px"></el-input>
      </el-form-item>
      <div v-else-if="active === 'app'">
        <el-form-item :label="$t('table.advAndroidMarketUri')">
          <el-input v-model="newAdv.android_market_url" style="width: 555px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.advAndroidShemeUri')">
          <el-input v-model="newAdv.android_sheme_uri" style="width: 555px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.advIOSMarketUri')">
          <el-input v-model="newAdv.ios_market_uri" style="width: 555px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.advIOSShemeUri')">
          <el-input v-model="newAdv.ios_sheme_uri" style="width: 555px"></el-input>
        </el-form-item>
      </div>
      <el-form-item :label="$t('table.content')" prop="content">
        <quill-editor v-model="newAdv.content"
                      ref="myQuillEditor"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)">
        </quill-editor>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="publish()">Publish</el-button>
        <el-button  type="primary" @click="preview()">Preview</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  /* eslint-disable */
  import { addAdv, updateAdv } from '@/api/adv'
  import VueQuillEditor, { Quill } from 'vue-quill-editor'
  import { ImageDrop } from 'quill-image-drop-module'
  import ImageResize from 'quill-image-resize-module'
  Quill.register('modules/imageDrop', ImageDrop)
  Quill.register('modules/imageResize', ImageResize)
  export default {
    name: 'articleDetail',
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image', 'video']
            ],
            history: {
              delay: 1000,
              maxStack: 50,
              userOnly: false
            },
            imageDrop: true,
            imageResize: {
              displayStyles: {
                backgroundColor: 'black',
                border: 'none',
                color: 'white'
              },
              modules: ['Resize', 'DisplaySize', 'Toolbar']
            }
          }
        },
        newAdv: {
          title: '',
          description: '',
          type: undefined,
          video_url: '',
          video_time: '',
          keyword: '',
          content: '',
          expire_time: '',
          img_url: '',
          web_url: '',
          android_sheme_uri: '',
          android_market_url: '',
          ios_market_uri: '',
          ios_sheme_uri: '',
          category: undefined
        },
        iconUploading: false,
        imgUrl: '',
        rules: {
          title: [{ required: true, message: this.$t('message.valueRequired'), trigger: 'change' }],
          description: [
            { required: true, message: this.$t('message.valueRequired'), trigger: 'change' }
          ],
          keyword: [
            { required: true, message: this.$t('message.valueRequired'), trigger: 'change' }
          ],
          expire_time: [
            { required: true, message: this.$t('message.valueRequired'), trigger: 'change' }
          ],
          content: [
            { required: true, message: this.$t('message.valueRequired'), trigger: 'change' }
          ]
        },
        active: '',
        // 图片上传
        appIconUploadUrl: '',
        a:{
          imageType:1
        },
        imgUrl: '',
      }
    },
    created() {
      this.appIconUploadUrl = 'https://ai.caping.co.id/Start/uploadpic'
      if (this.isEdit) {
        if (this.$store.getters.adv === undefined || this.$store.getters.adv === null) {
          this.$alert(this.$t('message.mustFromAdvList'), this.$t('message.warn'), {
            confirmButtonText: this.$t('button.confirm'),
            callback: action => {
              this.$router.push('list')
            }
          })
        } else {
          this.newAdv = Object.assign({}, this.$store.getters.adv)
          this.active = this.newAdv.category === 2 ? 'app' : 'web'
          this.imgUrl = this.newAdv.img_url
        }
      }
    },
    methods: {
      publish() {
        this.validateData()
        this.$refs['dataForm'].validate(async valid => {
          if (valid) {
            try {
              if (!this.isEdit) {
                await addAdv(this.newAdv)
                this.$notify({
                  title: this.$t('message.succ'),
                  message: this.$t('message.createSucc'),
                  type: 'success',
                  duration: 2000
                })
              } else {
                await updateAdv(this.newAdv)
                this.$notify({
                  title: this.$t('message.succ'),
                  message: this.$t('message.updateSucc'),
                  type: 'success',
                  duration: 2000
                })
              }
              this.dialogFormVisible = false
              this.$router.go(-1)
            } catch (error) {
              console.error(error)
            }
          }
        })
      },
      handleAvatarSuccess(res, file) {
        this.newAdv.img_url = res.Message
        this.imgUrl = file.url
        this.iconUploading = false
      },
      beforeAvatarUpload(file) {
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
      handleAvatarError(err, file) {
        this.$message.error(err)
        this.iconUploading = false
      },
      handleAvatarProgress() {
        this.iconUploading = true
      },
      validateData() {
        if (this.newAdv.video_url !== null && this.newAdv.video_url !== undefined && this.newAdv.video_url !== '') {
          this.newAdv.type = 1
          if (this.newAdv.video_time === null || this.newAdv.video_time === undefined || this.newAdv.video_time === '') {
            this.$message.error(this.$t('message.advVideoTimeRequired'))
            return
          }
        } else if (this.newAdv.img_url !== null && this.newAdv.img_url !== undefined && this.newAdv.img_url !== '') {
          this.newAdv.type = 2
        } else {
          this.$message.error(this.$t('message.advImgOrVideo'))
          return
        }
        if (this.active === '') {
          this.$message.error(this.$t('message.advTypeRequired'))
          return
        } else {
          if (this.active === 'app') {
            if (
              (!(!this.newAdv.android_market_url && this.newAdv.android_market_url.trim() !== '') && (!this.newAdv.android_sheme_uri && this.newAdv.android_market_url.trim() !== '')) &&
              (!(!this.newAdv.ios_market_uri && this.newAdv.ios_market_uri.trim() !== '') && (!this.newAdv.ios_sheme_uri && this.newAdv.ios_sheme_uri.trim() !== ''))
            ) {
              this.$message.error(this.$t('message.advTypeRequired'))
              return
            }
          } else if (this.active === 'web') {
            if (this.newAdv.web_url === undefined || this.newAdv.web_url === undefined || this.newAdv.web_url.trim() === '') {
              this.$message.error(this.$t('message.advTypeRequired'))
              return
            }
          }
          this.newAdv.category = this.active === 'web' ? 1 : 2
        }
      },
      onEditorBlur(editor) {
        //console.log('editor blur!', editor)
      },
      onEditorFocus(editor) {
        //console.log('editor focus!', editor)
      },
      onEditorReady(editor) {
        //console.log('editor ready!', editor)
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    mounted() {
    }
  }
</script>

<style lang="scss">
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
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .add_layout{
    display: inline-block;
  }

  .el-button.active {
    background: #2896ff;
    color: #fff;
  }
</style>

