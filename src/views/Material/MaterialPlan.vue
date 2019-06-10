<template>
  <div class="material-plan">
    <breadcrumb>
      <el-breadcrumb separator-class="el-icon-minus">
        <el-date-picker
          v-model="listQuery.dates"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月"
          :clearable="false"
          @change="handleChangeDate"
        >
        </el-date-picker>

        <el-button type="text" style="margin-left: 32px;" v-if="!disableEdit" :disabled="disableEdit" @click="dialogFormVisible = true">新建计划</el-button>
      </el-breadcrumb>
    </breadcrumb>

    <div class="app-container">
      <!-- table -->
      <div class="table-header flex-sb">
        <span>材料名称</span>
        <span>型号规格</span>
        <span>质量标准</span>
        <span>单位</span>
        <span>数量</span>
        <span>供货时间</span>
        <span>卸货地点</span>
        <span>用料地点</span>
        <span v-if="!disableEdit"></span>
      </div>

      <div class="table-body">
        <!-- 比较好的方式是把table-tree-node放到全局组建里面，自己调用自己来递归，这样来达到树状结构 -->
        <!-- 第一级 -->
        <table-tree-node
          v-for="item in list"
          :key="item.id"
          :node="item"
          :level="0"
          @insert="handleInsertPlan"
          @delete="handleDelete"
          @update="handleUpdatePlan"
        >
          <div v-if="item.children && item.children.length > 0" class="table-children">
            <!-- 第二级 -->
            <table-tree-node
              v-for="item2 in item.children"
              :key="item2.id"
              :node="item2"
              :level="1"
              @insert="handleInsertPlanChild"
              @update="handleUpdatePlanChild"
              @delete="handleDelete"
            >
              <div v-if="item2.children && item2.children.length > 0" class="table-children">
                <!-- 第三级 -->
                <table-tree-node
                  v-for="item3 in item2.children"
                  :key="item3.id"
                  :node="item3"
                  :level="2"
                  @insert="handleInsertPlanSecondChild"
                  @update="handleUpdatePlanSecondChild"
                  @delete="handleDelete"
                >
                </table-tree-node>
              </div>

              <table-edit
                v-if="planSecondChildEdit && currentPid === item2.id"
                :data="editInfo"
                @save="handleSaveEditPlan"
                @clear="handleRemoveEdit"
              >
              </table-edit>
            </table-tree-node>
          </div>
          <table-edit
            v-if="planChildEdit && currentPid === item.id"
            :data="editInfo"
            @save="handleSaveEditPlan"
            @clear="handleRemoveEdit"
          ></table-edit>
        </table-tree-node>
      </div>
      <!-- /table -->

      <!-- import dialog -->
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="dialogFormVisible"
        @close="resetForm"
        width="420px"
      >
        <div slot="title" style="font-weight: bolder">
          新增材料计划
        </div>
        <el-form :rules="rules" ref="dialogForm" :model="plan" :disabled="disableEdit" label-position="top">
          <el-form-item label="合约期限：" prop="date">
            <el-date-picker
              v-model="plan.date"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="分项名称：" prop="name">
            <el-input v-model="plan.name" placeholder="请输入分项名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="handleClose">{{$t('btn.cancel')}}</el-button>
          <el-button type="primary" @click="handleSave">{{$t('btn.comfirm')}}</el-button>
        </div>
      </el-dialog>
      <!-- /import dialog -->
    </div>
  </div>
</template>

<script>
import { getMaterialPlanList, addMaterialPlan, deleteMaterialPlanById } from '@/api/material';
import { zeroFull } from '@/utils/utils';
import TableTreeNode from './components/TableTreeNode';
import TableEdit from './components/TableEdit';

export default {
  name: 'MaterialPlan',
  components: {
    TableTreeNode,
    TableEdit,
  },
  data() {
    const { params: { id } } = this.$route;
    const now = new Date();
    const dates = `${now.getFullYear()}-${zeroFull(now.getMonth() + 1)}`;

    return {
      listQuery: {
        pageIndex: -1,
        projectId: id,
        dates,
      },
      plan: {
        date: '',
        name: '',
      },
      editInfo: {
        pid: 0,
        name: '',
        model: '',
        unit: '',
        standard: '',
        num: '',
        getTime: null,
        outPlace: '',
        usePlace: '',
      },
      // pid
      currentPid: 0,
      listLoading: false,
      list: null,
      dialogFormVisible: false,
      // add status
      addingPlan: false,
      // download path
      downloadPath: '',
      // eidt
      planChildEdit: false,
      planSecondChildEdit: false,
      // rules
      rules: {
        date: [{ required: true, message: `合约期限${this.$t('message.notEmpty')}`, trigger: 'change' }],
        name: [{ required: true, message: `分项名称${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;

      getMaterialPlanList({
        ...this.listQuery,
        dates: `${this.listQuery.dates}-01`,
      }).then((res) => {
        const { data } = res;
        this.list = data;

        this.listLoading = false;
      });
    },
    handleChangeDate() {
      // refresh days index
      this.selectDayIndex = 0;
      this.getList();
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该计划, 是否继续?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        // delete user
        deleteMaterialPlanById({
          id,
        }).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('message.deleteOk'),
          });

          this.getList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    handleRemoveEdit() {
      this.currentPid = 0;
      this.addingPlan = false;
    },
    handleSave() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          const { date, name } = this.plan;

          addMaterialPlan({
            projectId: this.listQuery.projectId,
            name,
            start: date[0],
            end: date[1],
          }).then(() => {
            this.getList();

            this.dialogFormVisible = false;
          });
        }
      });
    },
    handleSaveEditPlan() {
      const { name } = this.editInfo;

      if (name.trim() === '') {
        this.$message({
          type: 'info',
          message: '材料名称不能为空',
        });

        return;
      }

      addMaterialPlan({
        projectId: this.listQuery.projectId,
        ...this.editInfo,
      }).then(() => {
        this.addingPlan = false;
        this.resetEditInfo();
        this.getList();
      });
    },
    resetForm() {
      // this.$refs.dialogForm.resetFields();
      this.plan = { date: '', name: '' };
    },
    handleClose() {
      this.dialogFormVisible = false;
      // this.$refs.dialogForm.resetFields();
      this.plan = { date: '', name: '' };
    },
    resetEditInfo() {
      this.editInfo = {
        pid: 0,
        name: '',
        model: '',
        unit: '',
        standard: '',
        num: '',
        getTime: null,
        outPlace: '',
        usePlace: '',
      };
    },
    tableRowClassName({ row }) {
      if (row.type === 'edit') {
        return 'success-row';
      }
      return '';
    },
    // 第一级别插入
    handleInsertPlan(id) {
      this.resetEditInfo();
      this.currentPid = id;
      this.editInfo.pid = id;
      this.planChildEdit = true;
      // this.addingPlan = true;
    },
    // 第-级别编辑
    handleUpdatePlan(params) {
      this.dialogFormVisible = true;
      this.plan = params;
    },
    // 第二级别插入
    handleInsertPlanChild(id) {
      this.resetEditInfo();
      this.currentPid = id;
      this.editInfo.pid = id;
      this.planChildEdit = true;
      // 因为涉及到多个，所以还需要pid的等同
      // 新增需要pid，编辑也需要pid  -- 需要增加属性-- pid
    },
    handleUpdatePlanChild(params) {
      // this. 再加一个属性，两个planChildEdit
      this.planChildEdit = true;
      this.addingPlan = true;
      this.editInfo = params;
      this.currentPid = params.id;
    },
    handleInsertPlanSecondChild() {

    },
    handleUpdatePlanSecondChild(params) {
      this.addingPlan = true;
      this.currentPid = params.id;
      this.editInfo = params;
      this.planSecondChildEdit = true;
    },
  },
};
</script>

<style lang="scss">
  .material-plan .table-cell {
    .el-input__inner {
      padding-left: 10px;
      padding-right: 10px;
      border-style: dashed;
    }

    .el-date-editor .el-input__inner {
      padding-left: 30px;
    }
  }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .table-header {
    height: 48px;
    color: #909399;
    text-align: center;
    border-bottom: 1px solid #ebeef5;

    span {
      width: 80px;

      i {
        margin-right: 8px;
        color: #409EFF;

        &:hover {
          cursor: pointer;
        }
      }
    }

    span:nth-child(1) {
      width: 270px;
    }

    span:last-child {
      width: 88px;
    }
  }
</style>
