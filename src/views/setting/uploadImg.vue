<template>
    <div id="uploadImg">
        <div class="upload">
            {{$t('table.picture')}}:
            <el-upload
                action="https://ai.caping.co.id/Start/uploadpic"
                list-type="picture-card"
                :before-upload="beforeUpload"
                :on-preview="handlePictureCardPreview">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl">
                <p>{{imgUrl}}</p>
            </el-dialog>
        </div>
        
        <div>
            <el-upload
                action="https://ai.caping.co.id/Start/uploadpic"
                :data="a"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
     data() {
      return {
        dialogImageUrl: '',
        imgUrl:'',
        dialogVisible: false,
        a:{
            imageType:1
        }
        
      };
    },
    methods: {
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      beforeUpload (file) {
          const isValidType = ['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) > -1
        // 目前设置为2M
        const isValidSize = file.size / 1024 / 1024 < 2
        if (!isValidType) {
          this.$message.error(this.$t('message.invalidFileType'))
        } else if (!isValidSize) {
          this.$message.error(this.$t('message.invalidFileSize'))
        }else{
            let fd = new FormData()
            fd.append('imageData', file)
            fd.append('imageType',this.a.imgeType)//其他参数
            axios.post("https://ai.caping.co.id/Start/uploadpic", fd).then((res)=>{
                console.log(res)
                const datas = res.data.Message.split(',')
                this.imgUrl = datas[2]
            })
        } 
      },
       handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }

}
</script>

<style scoped>
#uploadImg{
    margin-left: 70px;
}
</style>
