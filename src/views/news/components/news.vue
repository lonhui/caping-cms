<template>
  <div class="app-container" style="width: 800px; margin-top: 40px;">
    <el-form :rules="rules" ref="dataForm" :model="newsInfo" label-width="150px">
      <div>
        <el-form-item class="add_layout" :label="$t('table.title')" prop="newsTitle">
          <el-input v-model="newsInfo.newsTitle"  style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item class="add_layout" :label="$t('table.publishDate')" prop="publishDate">
          <el-date-picker
          style="width: 220px"
          v-model="newsInfo.publishDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
        </el-form-item>
      </div>
      <div>
        <el-form-item class="add_layout" :label="$t('table.channelName')" prop="channelId">
          <el-select clearable style="width: 219px;margin-bottom: 2px" class="filter-item" v-model="newsInfo.channelId">
            <el-option v-for="item in channelList" :key="item.channel_id" :label="item.channel_name" :value="item.channel_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="add_layout" :label="$t('table.newSource')" prop="newsSource">
          <el-input v-model="newsInfo.newsSource" style="width: 220px"></el-input>
        </el-form-item>
      </div>
      <el-form-item class="add_layout" :label="$t('table.keyWord')">
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

      </el-form-item>
      <el-form-item :label="$t('table.newsIsLargePic')">
        <el-switch v-model="isLargePic"></el-switch>
      </el-form-item>
      <div class="upload-icon">
        <el-form-item  :label="$t('table.picture')" prop="pic1">
          <el-upload
            class="avatar-uploader"
            name="imageData"
            :data="a"
            action="https://ai.caping.co.id/Start/uploadpic"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarError1"
            :on-progress="handleAvatarProgress1">
            <img v-if="newsInfo.pic1 " :src="imgUrl1" class="avatar">
            <i v-else class="avatar-uploader-icon el-icon-plus" v-loading="iconUploading1"
               element-loading-text="Loading"></i>
          </el-upload>
        </el-form-item>
        <el-form-item prop="pic2">
          <el-upload
            style="margin-left: -100px"
            class="avatar-uploader"
            name="imageData"
            :data="a"
            action="https://ai.caping.co.id/Start/uploadpic"
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarError2"
            :on-progress="handleAvatarProgress2">
            <img v-if="newsInfo.pic2 " :src="imgUrl2" class="avatar">
            <i v-else class="avatar-uploader-icon el-icon-plus" v-loading="iconUploading2"
               element-loading-text="Loading"></i>
          </el-upload>
        </el-form-item>
        <el-form-item prop="pic3">
          <el-upload
            style="margin-left: -100px"
            class="avatar-uploader"
            name="imageData"
            :data="a"
            action="https://ai.caping.co.id/Start/uploadpic"
            :show-file-list="false"
            :on-success="handleAvatarSuccess3"
            :before-upload="beforeAvatarUpload"
            :on-error="handleAvatarError3"
            :on-progress="handleAvatarProgress3">
            <img v-if="newsInfo.pic3 " :src="imgUrl3" class="avatar">
            <i v-else class="avatar-uploader-icon el-icon-plus" v-loading="iconUploading3"
               element-loading-text="Loading"></i>
          </el-upload>
        </el-form-item>
      </div>
      <div style="height: 1px"></div>
      <el-form-item :label="$t('table.content')" prop="newsContent">
        <quill-editor v-model="newsInfo.newsContent"
                      ref="myQuillEditor"
                      :options="editorOption"
                      @blur="onEditorBlur($event)"
                      @focus="onEditorFocus($event)"
                      @ready="onEditorReady($event)">
        </quill-editor>
      </el-form-item>
      <el-form-item>
        <el-button  type="primary" @click="publish(false)">Publish</el-button>
        <el-button  type="primary" @click="saveDraft(true)">Save Drafts</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  /* eslint-disable */
  import { fetchChannelList, publishNews, getNewsInfo, getDraftNewsInfo, saveNews, saveDraft } from '@/api/news'
  import VueQuillEditor, { Quill } from 'vue-quill-editor'
  import { ImageDrop } from 'quill-image-drop-module'
  import ImageResize from 'quill-image-resize-module'
  Quill.register('modules/imageDrop', ImageDrop)
  Quill.register('modules/imageResize', ImageResize)

  export default {
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      isDraft: {
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
        newsInfo: {
          newsTitle: undefined,
          newsId: undefined,
          newsDraftsId: undefined,
          newsSource: undefined,
          channelId: undefined,
          channelID: undefined,
          channelName: undefined,
          pic1: undefined,
          pic2: undefined,
          pic3: undefined,
          realtionKeywords: undefined,
          addKeyWords: undefined,
          removeKeyWords: undefined,
          newsContent: undefined,
          publishDate: undefined,
          mangerUserID: undefined,
          keywords: undefined,
          isLargePic: undefined
        },
        channelList: [],
        iconUploading1: false,
        iconUploading2: false,
        iconUploading3: false,
        imgUrl1: '',
        imgUrl2: '',
        imgUrl3: '',
        isLargePic: false,
        newsKeyWords: [],
        removeKeyWords: [],
        addKeyWords: [],
        dynamicTags: [],
        removeTags: [],
        addTags: [],
        inputVisible: false,
        inputValue: '',
        rules: {
          newsTitle: [{ required: true, message: this.$t('message.valueRequired'), trigger: 'change' }],
          channelId: [{ required: true, message: this.$t('message.valueRequired'), trigger: 'change' }],
          newsSource: [{ required: true, message: this.$t('message.valueRequired'), trigger: 'change' }],
          pic1: [{ required: true, message: this.$t('message.valueRequired'), trigger: 'change' }],
          pic2: [{ required: true, message: this.$t('message.valueRequired'), trigger: 'change' }],
          pic3: [{ required: true, message: this.$t('message.valueRequired'), trigger: 'change' }],
          newsContent: [{ required: true, message: this.$t('message.valueRequired'), trigger: 'change' }],
          publishDate: [{ required: true, message: this.$t('message.valueRequired'), trigger: 'change' }]
        },
        appIconUploadUrl: '',
          a:{
            imageType:1,
        },
      }
    },
    async created() {
      this.appIconUploadUrl = process.env.BASE_API + '/adv/image/upload'
      if (this.$store.getters.channelList === undefined || this.$store.getters.channelList === null) {
        this.fetchChannelList()
      } else {
        this.channelList = this.$store.getters.channelList
      }
      // 是否编辑
      if (this.isEdit) {
        // 是否草稿
        if (this.isDraft) {
          this.getNewsInfo(this.$store.getters.draftNewsId, true)
        } else {
          this.getNewsInfo(this.$store.getters.newsId, false)
        }
      }
    },
    methods: {
      // 发布新闻
      publish() {
        this.$refs['dataForm'].validate(async valid => {
          if (valid) {
            if (this.dynamicTags.length < 1) {
              this.$message({
                message: this.$t('message.keyWordsRequired'),
                type: 'error'
              })
              return
            }
            this.newsInfo.isLargePic = this.isLargePic ? 1 : 2
            try {
              this.newsInfo.realtionKeywords = this.dynamicTags.join(',')
              if (!this.isEdit) {
                await publishNews(this.newsInfo)
                console.log(this.newsInfo)
              } else {
                if (this.addKeyWords.length >= 1) {
                  this.newsInfo.addKeyWords = this.addKeyWords.join(',')
                }
                if (this.removeKeyWords.length >= 1) {
                  this.newsInfo.removeKeyWords = this.removeKeyWords.join(',')
                }
                await saveNews(this.newsInfo)
                // alert(this.pic1)
              }
              this.$notify({
                title: this.$t('message.succ'),
                message: this.$t('message.createSucc'),
                type: 'success',
                duration: 2000
              })
              this.$router.go(-1)
            } catch (error) {
              console.error(error)
              this.$message({
                message: this.$t('message.updateInfoFail'),
                type: 'error'
              })
            }
          }
        })
      },
      // 保存草稿
      saveDraft() {
        if (this.dynamicTags.length < 1) {
          this.$message({
            message: this.$t('message.keyWordsRequired'),
            type: 'error'
          })
          return
        }
        this.$refs['dataForm'].validate(async valid => {
          this.draftNews = {
            newsDraftsId: undefined,
            channelID: this.newsInfo.channelId,
            lang: 'en',
            newsTitle: this.newsInfo.newsTitle,
            pic1: this.newsInfo.pic1,
            pic2: this.newsInfo.pic2,
            pic3: this.newsInfo.pic3,
            newsContent: this.newsInfo.newsContent,
            keywords: this.dynamicTags.join(','),
            isLargePic: this.isLargePic ? 1 : 2,
            newsSource: this.newsInfo.newsSource,
            publishDate: this.newsInfo.publishDate
          }
          if (valid) {
            try {
              if (this.isEdit && this.isDraft) {
                this.draftNews.channelID = this.newsInfo.channelID
                this.draftNews.newsDraftsId = this.newsInfo.newsDraftsId
              }
              await saveDraft(this.draftNews)
              this.$notify({
                title: this.$t('message.succ'),
                message: this.$t('message.createSucc'),
                type: 'success',
                duration: 2000
              })
              this.$router.go(-1)
            } catch (error) {
              console.error(error)
              this.$message({
                message: this.$t('message.updateInfoFail'),
                type: 'error'
              })
            }
          }
        })
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
      async getNewsInfo(newsId, isDraft) {
        try {
          let response
          if (isDraft) {
            response = await getDraftNewsInfo(newsId)
            for (const key in this.newsInfo) {
              this.newsInfo[key] = response.data[key]
            }
            this.newsInfo.channelId = this.newsInfo.channelID
            this.dynamicTags = this.newsInfo.keywords.split(',')
          } else {
            response = await getNewsInfo(newsId)
            for (const key in this.newsInfo) {
              this.newsInfo[key] = response.data.info[key]
            }
            this.newsKeyWords = response.data.list
            if (this.newsKeyWords) {
              // 组装keyword数组
              this.dynamicTags = this.newsKeyWords.map(item => item.keyword)
            }
          }
          this.isLargePic = this.newsInfo.isLargePic === 1
          this.imgUrl1 = this.newsInfo.pic1
          // alert(this.imgUrl1)
          // alert(this.newsInfo.pic1)
          this.imgUrl2 = this.newsInfo.pic2
          this.imgUrl3 = this.newsInfo.pic3
        } catch (error) {
          this.$router.go(-1)
          console.error(error)
          this.$message({
            message: this.$t('message.getInfoFail'),
            type: 'error'
          })
        }
      },
      handleAvatarSuccess1(res, file) {
        this.newsInfo.pic1 = res.Message
        this.imgUrl1 = file.url
        this.iconUploading1 = false
      },
      handleAvatarSuccess2(res, file) {
        this.newsInfo.pic2 = res.Message
        this.imgUrl2 = file.url
        this.iconUploading2 = false
      },
      handleAvatarSuccess3(res, file) {
        this.newsInfo.pic3 = res.Message
        this.imgUrl3 = file.url
        this.iconUploading3 = false
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
      handleAvatarError1(err, file) {
        this.$message.error(err)
        this.iconUploading1 = false
      },
      handleAvatarError2(err, file) {
        this.$message.error(err)
        this.iconUploading2 = false
      },
      handleAvatarError3(err, file) {
        this.$message.error(err)
        this.iconUploading3 = false
      },
      handleAvatarProgress1() {
        this.iconUploading1 = true
      },
      handleAvatarProgress2() {
        this.iconUploading2 = true
      },
      handleAvatarProgress3() {
        this.iconUploading3 = true
      },
      handleClose(tag) {
        this.newsKeyWords.map(item => {
          if (item.keyword === tag) {
            this.removeKeyWords.push(item.id)
          } else {
            this.addKeyWords.splice(this.addKeyWords.indexOf(tag), 1)
          }
        })
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      },
      showInput() {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm() {
        const inputValue = this.inputValue
        if (inputValue) {
          this.dynamicTags.push(inputValue)
          this.addKeyWords.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
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
  .upload-icon .el-form-item {
    display: inline-block;
  }
  .upload-icon .el-form-item__error {
    left: -100px;
  }
  .upload-icon>div:first-child .el-form-item__error{
    left: 0px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    height: 100px;
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
    vertical-align: middle;
  }
  .avatar {
    width: 100px;
    height: 100px;
    vertical-align: middle;
  }
  .add_layout{
    display: inline-block;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>

