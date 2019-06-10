<template>
  <div class="jasoShow">
    <div class="list-wrapper main">
      <div class="item" v-for="(item, index) in list" :key="index" >
        <div class="topDiv">
          <div class="leftDiv">
            <el-checkbox v-model="item.checked" class="checkbox"></el-checkbox>
          </div>
          <div class="rightDiv">
            <zooming-img v-if="item.id > 100" :src="item.picUrl | setFileRoot"/>
            <svg-icon v-else icon-class="文件夹" class="icon"></svg-icon>
          </div>
        </div>
        <div class="name">
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <!-- 图片轮播 -->
    <el-dialog
      title="缩略图轮播"
      :visible.sync="allDialogVisible"
      :close-on-click-modal="false"
      width="50%"
      :close="handleClose">
      <div class="block">
        <span class="demonstration">{{ fileName }}</span>
        <el-carousel :interval="4000" type="card" height="300px">
          <el-carousel-item v-for="item in 4" :key="item">
            <!--<h3>{{ item }}</h3>-->
            <img src="item">
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>

    <!-- 图片重命名 -->
    <el-dialog
      title="名称更改"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      width="50%"
      :close="handleClose">
      <div class="block">
        <el-form>
          <el-form-item>
            <el-input type="" v-model="name"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 文件移动 -->
  </div>
</template>

<script>
export default {
  name: 'jasoShow',
  props: {
    list: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      allDialogVisible: false,
      editDialogVisible: false,
      fileName: 'fileName',
      name: '',
      multipleSelectIds: [],
    };
  },
  created() {
  },
  methods: {
    getList() {
      /**
       *  用来展示图片；自动获取图片尺寸进行处理
       *  图片需要的操作： 图片；命名；操作
       *
       *
       *
       * */
    },
    handleImgShow(param) {
      this.$emit('imgShow', param);
    },
    handleDelete(param) {
      this.$emit('delete', param);
    },
    handleRemove(param) {
      this.$emit('remove', param);
    },
    handleRename(param) {
      this.$emit('rename', param);
    },
    handleClose() { },
  },
};
</script>

<style lang="scss" scoped>
  .jasoShow{
    .main{
      border-top: 1px solid #DEE1E6;
      margin-top: 10px;
    }
    .list-wrapper {
      display: flex;
      flex-wrap: wrap;

      .item {
        position: relative;
        margin-bottom: 10px;
        width: 153px;
        height: 149px;
        color: #ffffff;
        border-radius:5px;
        .topDiv {
          height: 114px;
          width: 100%;
          .leftDiv {
            width: 30px;
            height: 100%;
            float: left;
            .checkbox{
              margin-left: 10px;
              margin-top: 10px;
            }
          }
          .rightDiv {
            height: 100%;
            width: 117px;
            float: left;
          }
        }
        img{
          width: 93px;
          height: 75px;
          margin-top: 25px;
          /*margin-left: 45px;*/
          object-fit: cover;
        }
        .icon {
          width: 93px;
          height: 75px;
          margin-top: 25px;
          /*margin-left: 10px;*/
          object-fit: cover;
        }
        .name {
          position: absolute;
          width: 100%;
          bottom: 5px;
          text-align: center;
          color: black;
          height: 30px;
          margin-top: 5px;
        }
        &:hover {
          cursor: pointer;
          background: #EBEEF5;
          border-color: #DCDFE6;
        }
        &.selected {
          background: #EBEEF5;
          border: 1px solid #DCDFE6;

          .select {
            display: block;
            color: #409EFF;
          }
        }
      }
      .add-item {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        color: #409EFF;

        .action-name {
          margin-top: 15px;
        }
      }
    }

    .imgDiv{
      .imgBox{
        width: 160px;
        height: 180px;
        margin: 10px 10px 10px 10px;
        float: left;
        .imgBox_img{
          width: 100%;
          height: 160px;
        }
        .imgBox_imgName{
          width: 80%;
          margin-left: 10%;
          height: 20px;
          text-align: center;
          span{
          }
        }
      }
    }
  }
</style>
