<template>
  <div>
    <header class="admin-header flex-sb">
      <div>
        <el-button type="text" @click="returnToUpperLevel">返回上一级</el-button>
        <span> | {{itemTitle}} > 基础设置</span>
      </div>
      <el-button class="filter-item" type="text" @click="checkItemsOrNature">{{itemOrNature}}</el-button>
    </header>
    <div class="app-container" style="margin-top: 10px">
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="检查项" name="first">
          <div>
            <section class="table-cell flex-sb table-title-gantt">
              <span style="width: 350px;text-align: left;margin-left: 20px">检查项名称</span>
              <span style="width: 350px;text-align: right;margin-right: 100px">操作</span>
            </section>
            <security-item-left :list="itemListData" @show="handleShow" @getList="getList"></security-item-left>
            <el-dialog
              :visible.sync="itemDialogFormVisible"
              @close="resetItemForm"
              width="360px">
              <div slot="title" style="font-weight: bolder">{{itemAddOrEdit}}</div>
              <el-form ref="itemDialogForm">
                <el-form-item label="检查项名称:">
                  <el-input v-model="itemContent"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button @click="itemDialogFormVisible = false">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="itemHandleSave">{{$t('btn.comfirm')}}</el-button>
              </div>
            </el-dialog>
          </div>
        </el-tab-pane>
        <el-tab-pane label="检查性质" name="second">
          <div>
            <el-table :data="listData">
              <el-table-column align="left" label="检查性质名称" prop="content"></el-table-column>
              <el-table-column  align="center" label="操作" width="200">
                <template slot-scope="scope">
                  <el-button type="text" @click="editNature(scope.row)" >编辑</el-button>
                  <el-button type="text" @click="delNatureData(scope.row)" >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-dialog
              :visible.sync="dialogFormVisible"
              @close="resetForm"
              width="360px">
              <div slot="title" style="font-weight: bolder">{{natureAddOrEdit}}</div>
              <el-form ref="dialogForm">
                <el-form-item label="检查性质名称:">
                  <el-input v-model="content"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer">
                <el-button @click="dialogFormVisible = false">{{$t('btn.cancel')}}</el-button>
                <el-button type="primary" @click="handleSave">{{$t('btn.comfirm')}}</el-button>
              </div>
            </el-dialog>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getNatureList, deleteNature, addNature,
  updateNature, getCheckListsList, addCheckLists, closeList, handleShowChildren } from '@/api/quality';
import SecurityItemLeft from './components/SecurityItemLeft';
// import { questionTicketTypeList } from '@/filters';
// import { showGallery } from '@/utils/utils';

export default {
  name: 'SecurityInfrastructure',
  components: {
    SecurityItemLeft,
  },
  props: {
    itemTitle: {
      type: String,
      default: '安全管理',
    },
  },
  data() {
    const { params: { id } } = this.$route;
    return {
      projectId: id,
      dialogFormVisible: false,
      itemDialogFormVisible: false,
      activeName: 'first',
      natureAddOrEdit: '新增检查性质',
      itemAddOrEdit: '新增检查项',
      itemOrNature: '新增检查项',
      itemContent: null,
      itemContentId: null,
      content: null,
      contentId: null,
      listQuery: {
        pageIndex: -1,
        pageSize: 20,
        projectId: id,
        natureType: 1,
      },
      itemListQuery: {
        projectId: id,
        checkType: 1,
        pageSize: 20,
        pageIndex: 0,
      },
      listData: null,
      itemListData: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      // this.listLoading = true;
      getCheckListsList(this.itemListQuery).then((res) => {
        if (res) {
          const { data } = res;
          if (data && data.length > 0) {
            const listTemp = [];
            data.forEach((item) => {
              listTemp.push({
                children: [],
                show: false,
                edit: false,
                level: 1,
                ...item,
              });
            });
            this.itemListData = listTemp;
          }
        }
      });
    },
    handleSave() {
      if (this.natureAddOrEdit === '新增检查性质') {
        if (this.content === null || this.content === '') {
          this.$message({
            type: 'error',
            message: '检查性质名称不得为空!',
          });
        } else {
          addNature({ projectId: this.projectId, natureType: 1, content: this.content }).then((data) => {
            if (data) {
              this.getCheckTheProperties();
              this.$message({
                type: 'success',
                message: '检查性质新增成功!',
              });
              this.dialogFormVisible = false;
            }
          });
        }
      } else {
        updateNature({ id: this.contentId, content: this.content }).then((data) => {
          if (data) {
            this.getCheckTheProperties();
            this.$message({
              type: 'success',
              message: '检查性质修改成功!',
            });
            this.dialogFormVisible = false;
          }
        });
      }
    },
    itemHandleSave() {
      if (this.itemAddOrEdit === '新增检查项') {
        if (this.itemContent === null || this.itemContent === '') {
          this.$message({
            type: 'error',
            message: '检查项名称不得为空！',
          });
        } else {
          const parmts = {
            projectId: this.projectId,
            checkType: 1,
            content: this.itemContent,
          };
          addCheckLists(parmts).then((data) => {
            if (data) {
              this.getList();
              this.$message({
                type: 'success',
                message: '检查项新增成功!',
              });
              this.itemDialogFormVisible = false;
            }
          });
        }
      }
    },
    delNatureData(val) {
      this.$confirm('确定删除?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        deleteNature({ id: val.id }).then((data) => {
          if (data) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.getCheckTheProperties();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    resetForm() {
      this.$refs.dialogForm.resetFields();
      this.content = null;
      this.contentId = null;
    },
    resetItemForm() {
      this.$refs.itemDialogForm.resetFields();
      this.itemContent = null;
      this.itemContentId = null;
    },
    getCheckTheProperties() {
      getNatureList(this.listQuery).then((data) => {
        if (data) {
          this.listData = data.data;
        }
      });
    },
    checkItemsOrNature() {
      if (this.itemOrNature === '新增检查项') {
        this.itemDialogFormVisible = true;
        this.itemAddOrEdit = '新增检查项';
        //
      } else {
        this.dialogFormVisible = true;
        this.natureAddOrEdit = '新增检查性质';
      }
    },
    editNature(val) {
      this.natureAddOrEdit = '编辑检查性质';
      this.content = val.content;
      this.contentId = val.id;
      this.dialogFormVisible = true;
    },
    handleTabClick(tab) {
      switch (tab.index) {
        case '0': {
          this.itemOrNature = '新增检查项';
          this.getList();
          break;
        }
        case '1': {
          this.itemOrNature = '新增检查性质';
          this.getCheckTheProperties();
          break;
        }
        default:
      }
    },
    handleShow(param) {
      if (param.show) {
        closeList(this.itemListData, param);
      } else {
        getCheckListsList({ pid: param.id, ...this.itemListQuery }).then((res) => {
          if (res) {
            const { data } = res;
            const list = [];
            data.forEach((item) => {
              list.push({
                children: [],
                show: false,
                edit: false,
                level: param.level + 1,
                ...item,
              });
            });
            handleShowChildren(list, this.itemListData, param);
          }
        });
      }
    },
    returnToUpperLevel() {
      this.$emit('returnToUpperLevel');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .question-level {
    &-0 {
      color: #67C23A;
    }

    &-1 {
      color: #E6A23C;
    }

    &-2 {
      color: #F56C6C;
    }
  }

  .question-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
  }
</style>
