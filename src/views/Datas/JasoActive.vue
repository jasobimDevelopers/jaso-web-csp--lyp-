<template>
  <div class="jasoActive">
    <breadcrumb></breadcrumb>
    <div class="app-container">
      <div class="action-wrapper flex-sb" style="margin-top: 20px;">
        <div class="flex-row">
          <el-dropdown style="margin-right: 10px">
            <el-button type="primary" :disabled="disableEdit" @click="handleUploadFile">上传</el-button>
            <el-dropdown-menu slot="dropdown" v-if="!disableEdit">
              <el-dropdown-item>
                <div class="upload-wrapper" @click="handleUploadFile">
                  <div>文件</div>
                  <input type="file" ref="file" @change="handleFilesChange($event)" />
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="upload-wrapper" @click="handleUploadFolder">
                  <div>文件夹</div>
                  <input type="file" ref="fileFolder" directory webkitdirectory @change="handleFilesChange($event)" />
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button :disabled="disableEdit" @click="dialogFolderVisible = true">新建文件夹</el-button>
          <el-button :disabled="multipleSelection.length === 0" @click="handleDownloadSelects">下载</el-button>
          <el-button :disabled="multipleSelection.length === 0 || disableEdit" @click="handleDeleteSelects">删除</el-button>
          <el-button :disabled="multipleSelection.length != 1 || disableEdit" @click="handleRename(multipleSelection[0])">重命名</el-button>
          <el-button :disabled="multipleSelection.length != 1 || disableEdit" @click="handleRemove(multipleSelection[0])">移动到</el-button>
        </div>

        <div class="flex-row">
          <el-input
            placeholder="请输入内容"
            v-model="listQuery.name"
            @keyup.enter.native="getSearchList"
            @clear="handleClearSearch"
            clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <!-- <div class="btn-item">
            <svg-icon icon-class="排序"></svg-icon>
          </div> -->
          <div @click="toggleShowType" style="margin-left: 10px;">
            <div class="btn-item" v-if="showType === 'list'">
              <svg-icon icon-class="缩略图"></svg-icon>
            </div>
            <div class="btn-item" v-else>
              <svg-icon icon-class="列表"></svg-icon>
            </div>
          </div>
        </div>
      </div>
      <!-- 文件层级展示 -->
      <div class="file-nav">
        <span v-if="actionStatus === 'search'">搜索文件</span>
        <div v-else>
          <span v-if="navList.length === 0">全部文件</span>
          <div v-else class="flex-row">
            <div class="nav-back">
              <el-button type="text" @click="handleBackNav">返回上一级</el-button>
            </div>
            <div class="nav-list">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item><el-button type="text" @click="handleBackToAll">全部文件</el-button></el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item, i) in navList" :key="i">
                  <span @click="handleNavFile(item, i)">{{ item.name }}</span>
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showType !== 'list'">
        <div style="margin-top: 20px;margin-left: 20px;">
          <el-checkbox v-model="checkedAll" class="checkbox" @click="handleSelectAll">{{ '全选' }}</el-checkbox>
        </div>
        <div class="jasoShow">
          <jaso-show :list="list"></jaso-show>
        </div>
      </div>
      <div v-else>
        <!-- 类型2 -->
      </div>

    </div>

    <!--&lt;!&ndash; 单张图片预览 同一个路径，显示的大小不一样而已；&ndash;&gt;-->
    <el-dialog
      title="缩略图预览"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="50%"
      :close="handleClose">
      <img src="" width="399px;" height="399px;"/>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectList } from '@/api/projectManage';
import JasoShow from './components/JasoShow';

export default {
  name: 'jasoActive',
  components: {
    JasoShow,
  },
  data() {
    return {
      list: [],
      dialogVisible: false,
      showImg: null,
      searchQuery: {
        name: '',
      },
      listQuery: {
        name: '',
      },
      dialogFolderVisible: false,
      multipleSelection: false,
      showType: 'thumbnail ', // list
      actionStatus: 'list',
      navList: [],
      multipleSelectIds: [],
      checkedAll: false,
    };
  },
  created() {
    this.handleList();
  },
  methods: {
    getList() {
      const listTemp = [];
      const children = {
        id: '',
        fileType: '',
        imgPath: '',
        imgName: '',
      };
      // selected
      for (const key in 5) {
        if (key) {
          listTemp.push(children);
        }
      }
      // 可以通过new Array() 的方式解耦
      this.list = listTemp;
      /**
       *  1： 需要显示层级 2： 缩略图展示部分 3： 文件移动 4： 层级跳转  6: 显示问题（分类： 各种文件后缀等）
       *  分层显示：label value  显示名字；id绑定最上层
       *  文件层级问题；  主要发生在文件移动上
       * 5: 各类文件上传(在层级当中能够有个加号)
       * 1: 主数组的展示：
       * 2：
       *
       * */
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleList() {
      getProjectList({ pageIndex: -1 }).then((res) => {
        if (res) {
          const { data } = res;
          const listTemp = [];
          data.forEach((item) => {
            listTemp.push({ fileType: 'img', checked: false, ...item });
          });
          this.list = listTemp;
        }
      });
    },
    handleUploadFile() {},
    handleFilesChange() {},
    handleDownloadSelects() {},
    handleRemove() {},
    handleRename() {},
    handleDeleteSelects() {},
    handleUploadFolder() {},
    handleClearSearch() {},
    toggleShowType() {},
    handleBackNav(param) {
      // 根据param去查找
      this.temp = param;
    },
    handleBackToAll() {
      this.getList();
    },
    handleSelectAll() {
      let remark = false;
      this.list.forEach((item) => {
        if (!item.select) {
          remark = false;
          item.select = true;
        }
      });
      if (!remark) {
        this.list.forEach((item) => {
          item.select = false;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.jasoActive {
  .jasoShow {
    width:100%;
  }
  .file-nav {
    margin-top: 15px;
    color: #909399;

    .nav-back {
      &:after {
        margin-left: 7px;
        margin-right: 7px;
        content: "|";
      }
    }
  }
}
</style>
