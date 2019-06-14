<template>
  <div>
    <breadcrumb>
      <div class="flex-row topWork">
        <div><el-button type="text" @click="openDialog" >{{'上传图纸'}}</el-button></div>
      </div>
    </breadcrumb>
    <div>
      <el-table :data="dataList">
        <el-table-column align="center" prop="paperName" label="图纸名称"/>
        <el-table-column align="center" label="检查项">
          <template slot-scope="scope">
            <span>设备安装</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="measuredNum" label="测量点"/>
        <el-table-column align="center" prop="createDate" label="创建时间"/>
        <el-table-column align="center" prop="paperStatus" label="图纸状态">
          <template slot-scope="scope">
            <span v-if="scope.row.paperStatus === 0"> 未标注</span>
            <span v-if="scope.row.paperStatus === 1"> 已标注</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="markData(scope.row)"
              type="text" size="small"
            >标注</el-button>
            <!--<el-button-->
              <!--@click="delData(scope.row)"-->
              <!--type="text" size="small"-->
              <!--style="color: #F56C6C"-->
            <!--&gt;删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :visible.sync="dialogFormVisible"
        @close="resetForm"
        width="360px">
        <div slot="title" style="font-weight: bolder">上传图纸</div>
        <el-form ref="dialogForm">
          <el-form-item label="图纸名称:">
            <el-input v-model="queryList.paperName"></el-input>
          </el-form-item>
          <el-form-item label="图纸上传：" prop="fileList">
            <div class="upload-file-wrapper flex-column">
              <div class="flex-row">
                <el-button type="primary" style="margin-right: 15px;">
                  <input type="file" ref="picInput" multiple accept="image/*" @change="handleFileChange" />
                  <span>点击上传</span>
                </el-button>
                <span>{{ queryList.file.length > 0 ? `${queryList.file.length}个图纸` : '' }}</span>
              </div>
              <div style="font-size: 12px;">只能上传jpg/png文件，且不超过500kb</div>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="resetForm">取消</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { addPaperOfMeasured, deletePaperOfMeasured, getPaperOfMeasuredByProjectId } from '@/api/measuredDataPaper';

export default {
  name: 'MeasuredDataPaper',
  data() {
    const { params: { id } } = this.$route;
    return {
      dialogFormVisible: false,
      dataList: [],
      queryList: {
        projectId: id,
        file: [],
        paperName: null,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getPaperOfMeasuredByProjectId({ projectId: this.queryList.projectId }).then((res) => {
        if (res) {
          this.dataList = res.data;
        }
      });
    },
    openDialog() {
      this.dialogFormVisible = true;
    },
    handleFileChange(e) {
      if (this.queryList.file.length > 0) {
        this.queryList.file = [];
        this.$message({
          type: 'warning',
          message: '图纸数据已重置！',
        });
      }
      if (e.target.files && e.target.files.length > 0) {
        this.queryList.file.push(e.target.files[e.target.files.length - 1]);
      }
    },
    handleSave() {
      addPaperOfMeasured(this.queryList).then((res) => {
        if (res) {
          this.$message({
            type: 'success',
            message: '图纸上传成功！',
          });
          this.getList();
          this.dialogFormVisible = false;
        }
      });
    },
    resetForm() {
      this.dialogFormVisible = false;
      this.queryList = {
        projectId: this.queryList.projectId,
        file: [],
        paperName: null,
      };
    },
    // 标注
    markData() {

    },
    delData(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deletePaperOfMeasured({ id: item.paperId }).then((res) => {
          if (res) {
            this.getList();
            this.$message({
              type: 'success',
              message: '图纸删除成功！',
            });
          }
        });
      });
    },
  },
};
</script>

<style scoped>

</style>
