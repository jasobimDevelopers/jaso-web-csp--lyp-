<template>
  <div>
    <header class="admin-header flex-sb">
      <div>
        <el-button type="text" @click="returnToUpperLevel">返回上一级</el-button>
        <span> | {{itemTitle}} > 基础设置</span>
      </div>
      <el-button class="filter-item" type="text" @click="addNewData">新建检查项</el-button>
    </header>
    <div>
      <el-table :data="dataList" :show-header="false">
        <el-table-column align="left" prop="checkName"/>
        <el-table-column fixed="right">
          <template slot-scope="scope">
            <el-button
              @click="delData(scope.row)"
              type="text" size="small"
              style="float: right;margin-right: 10px;color: #F56C6C"
            >删除</el-button>
            <el-button
              @click="editData(scope.row)"
              type="text" size="small"
              style="float: right;margin-right: 10px"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :visible.sync="dialogFormVisible"
        @close="resetForm"
        width="360px">
        <div slot="title" style="font-weight: bolder">{{dialogTitle}}</div>
        <el-form ref="dialogForm">
          <el-form-item label="检查项名称:">
            <el-input v-model="queryAddList.checkName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="resetForm">{{$t('btn.cancel')}}</el-button>
          <el-button type="primary" @click="handleSave">{{$t('btn.comfirm')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCheckListTypesList, addCheckListTypes,
  deleteCheckListTypes, updateCheckListTypes } from '@/api/measured';

export default {
  // 实测实量 > 基础设置
  name: 'MeasuredRealQuantity',
  props: {
    itemTitle: {
      type: String,
      default: '实测实量',
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogTitle: '新建检查项',
      queryList: {
        // 0、实测实量检查项
        checkType: 0,
        pageIndex: 0,
        pageSize: 10,
      },
      queryAddList: {
        // 0、实测实量检查项
        id: null,
        checkType: 0,
        checkName: null,
        remark: null,
      },
      dataList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getCheckListTypesList(this.queryList).then((res) => {
        if (res) {
          const { data } = res;
          if (data && data.length > 0) {
            this.dataList = data;
          }
        }
      });
    },
    addNewData() {
      this.dialogTitle = '新建检查项';
      this.dialogFormVisible = true;
      this.$refs.dialogForm.resetFields();
    },
    editData(res) {
      this.queryAddList.id = res.checkId;
      this.queryAddList.checkName = res.checkName;
      this.dialogTitle = '编辑检查项';
      this.dialogFormVisible = true;
    },
    delData(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteCheckListTypes({ id: item.checkId }).then((res) => {
          if (res) {
            this.getList();
            this.$message({
              type: 'success',
              message: '检查项删除成功！',
            });
          }
        });
      });
    },
    handleSave() {
      if (this.dialogTitle === '新建检查项') {
        addCheckListTypes(this.queryAddList).then((res) => {
          if (res) {
            this.getList();
            this.dialogFormVisible = false;
            this.$message({
              type: 'success',
              message: this.$t('检查项新增成功!'),
            });
          }
        });
      } else {
        updateCheckListTypes({ checkId: this.queryAddList.id, checkName: this.queryAddList.checkName }).then((res) => {
          if (res) {
            this.getList();
            this.dialogFormVisible = false;
            this.$message({
              type: 'success',
              message: this.$t('检查项编辑成功!'),
            });
          }
        });
      }
    },
    resetForm() {
      this.$refs.dialogForm.resetFields();
      this.dialogFormVisible = false;
      this.queryAddList.checkName = null;
      this.queryAddList.id = null;
    },
    returnToUpperLevel() {
      this.$emit('returnToUpperLevel');
    },
  },
};
</script>

<style scoped>

</style>
