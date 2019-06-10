<template>
  <div class="standard">
    <breadcrumb>
    <div style="width: 400px;">
      <div style="width: 90px;float: right;margin-top: 10px;">
        <el-button @click= "handleFileUp" type="text">上传规范</el-button>
      </div>
      <el-input placeholder="请输入文件名" class="input-with-select" style="width: 250px;float: right;margin-right: 20px;">
        <el-button slot="append" v-model="listQuery.content" icon="el-icon-search" @click ="handleSearch"></el-button>
      </el-input>
    </div>
  </breadcrumb>
    <div class="app-container">
      <el-tabs v-model="listQuery.studyType"   type="card"  style="margin-top: 15px;" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="(item, i) in standardType"
          :key="i"
          :label="item"
          :name="String(i)"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="app-container" style="margin-top: -10px;">
      <el-table
        :data="list"
        v-loading="listLoading"
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="序号" type="index"></el-table-column>
        <el-table-column align="center" label="文件名" prop="fileNameList"></el-table-column>
        <el-table-column align="center" label="文件大小" prop="size"></el-table-column>
        <el-table-column align="center" label="上传时间" prop="submitDate"></el-table-column>
        <el-table-column align="center" :label="$t('table.operation')" width="150">
          <template slot-scope="scope">
            <div class="operation-btns">
              <el-button-group>
                <el-button type="primary" @click="handleDownload(scope.row)" size="small">下载</el-button>
                <el-button type="primary" @click="handleDelete({ id: scope.row.id })" size="small">删除</el-button>
              </el-button-group>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="text-align: left">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.pageIndex"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogAddVisible"
      width="340px"
      @close="resetAddForm"
    >
      <div slot="title" style="font-weight: bolder">上传规范</div>
      <hr style="margin-top: -10px; margin-bottom: 10px;height:2px;border:none;border-top:2px;dotted:#185598;"/>
      <el-form :rules="addRules" ref="dialogForm" :model="normativefiles">
        <el-form-item label="规范类别：" prop="fileType">
          <el-select v-model="normativefiles.studyType" style="width: 100%">
            <el-option
              v-for="(item, i) in standardType"
              :key="i"
              :label="item"
              :value="String(i)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择文件：" prop="fileList">
          <div class="upload-file-wrapper flex-row" style="width: 100%">
            <el-button type="primary" style="width: 100px">
              <input type="file" ref="file" @change="handleFileChange" multiple accept="pdf/*" />
              <span>上传</span>
            </el-button>
            <span style="margin-left: 10px;">{{ imgFileName }}</span>
          </div>
        </el-form-item>
      </el-form>
      <table>
        <tr v-for="(item, i) in imgFileNameList" :key="i" class="nameShowTr">
          <!--<td class="tdIndex">{{ i+1 }}</td>-->
          <td class="tdName"><p>{{ item }}</p></td>
          <td class="tdRemove"><i class="el-icon-delete" @click = "handleImgRemove(i)"></i></td>
        </tr>
      </table>
      <div slot="footer">
        <el-button  @click="handleCancel">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary"   @click="handleSave" >{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { standardType, setFileRootForDownload } from '@/filters';
import { getNormativefilesLists, addNormativefiles } from '@/api/standard';

export default {
  name: 'standard',
  data() {
    return {
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        studyType: 0,
        content: null,
      },
      list: [],
      totalNumber: 0,
      listLoading: false,
      standardType,
      dialogAddVisible: false,
      normativefiles: {
        fileType: 0,
        fileList: [],
        studyType: null,
      },
      imgFileName: '未选择任何文件',
      imgFileNameList: [],
      addRules: {
        fileType: [{ required: true, message: `姓名${this.$t('message.notEmpty')}`, trigger: 'change' }],
        // fileList: [{ required: true, validator: `文件${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getNormativefilesLists(this.listQuery).then((res) => {
        const { data, totalNumber } = res;
        if (data !== null && data.length > 0) {
          data.forEach((item) => {
            item.submitDate = item.submitDate.substring(0, (item.submitDate.length - 3));
          });
        }
        this.list = data;
        this.totalNumber = totalNumber;
      });
      this.listLoading = false;
    },
    handleTabClick() {
      this.getList();
    },
    handleDownload(param) {
      let url = '/';
      url += param.fileUrlList;
      window.open(setFileRootForDownload(url));
    },
    handleDelete(params) {
      getNormativefilesLists(params).then((res) => {
        const { data } = res;
        this.list = data;
        this.listLoading = false;
      });
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.getList();
    },
    handleFileUp() {
      this.dialogAddVisible = true;
    },
    handleSearch() {
      this.listQuery.pageSize = 10;
      this.listQuery.pageIndex = 1;
      if (this.listQuery.content === '') {
        this.listQuery.content = null;
      }
      this.getList();
    },
    handleFileChange(e) {
      const files = e.target.files;
      if (files !== null && files.length > 0) {
        this.normativefiles.fileList = files;
        const imgNameList = [];
        for (const key in files) {
          if (key) {
            if (Number(key) < files.length) {
              imgNameList.push(files[key].name);
            }
          }
        }
        this.imgFileNameList = imgNameList;
      } else {
        this.normativefiles.fileList = [];
        this.imgFileNameList = [];
      }
      this.imgFileName = files.length > 0 ? `${files.length}个文件` : '未选择任何文件';
    },
    handleImgRemove(val) {
      const imgNameList = [];
      const fileList = [];
      for (const key in this.imgFileNameList) {
        if (key) {
          if (key !== String(val)) {
            imgNameList.push(this.imgFileNameList[key]);
            fileList.push(this.normativefiles.fileList[key]);
          }
        }
      }
      this.imgFileNameList = imgNameList;
      this.normativefiles.fileList = fileList;
      this.imgFileName = imgNameList.length > 0 ? `${imgNameList.length}个文件` : '未选择任何文件';
    },
    resetAddForm() {
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.$el.reset();
      this.normativefiles.fileType = null;
      this.normativefiles.fileList = [];
      this.imgFileNameList = [];
      this.imgFileName = '未选择任何文件';
    },
    handleCancel() {
      this.dialogAddVisible = false;
      this.resetAddForm();
    },
    handleSave() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          addNormativefiles(this.normativefiles).then(() => {
            this.handleCancel();
            this.listQuery.studyType = this.normativefiles.fileType;
            this.listQuery.pageSize = 10;
            this.listQuery.pageIndex = 1;
            this.getList();
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .standard{
    width: 100%;
    .app-container{
      width: 950px;
    }
    .top-pane{
      border: 1px solid;
      /*overflow: auto;*/
    }
    .nameShowTr{
      height: 30px;
      text-align: left;
      .tdIndex{
        width: 20px;
      }
      .tdName{
        width: 250px;
        p{
          width: 250px;
          overflow: hidden;
        }
      }
      .tdRemove{
        width: 30px;
        i:hover{
          color:red;
        }
      }
    }
  }
</style>
