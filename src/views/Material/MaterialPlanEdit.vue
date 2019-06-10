<template>
  <div class="MaterialPlanEdit">
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
        <!-- 第一层级内容-->
        <table-tree-node-for-edit
          v-for="(item, index) in list"
          :node="item"
          :key = "index"
          :level="0"
          @insert="handleInsert(item)"
          @update="handleUpdate(item)"
          @delete="handleDelete(item.id)"
          @clear="handleClear(item)"
        >
          <div v-if="item.children && item.children.length > 0" class="table-children">
            <!-- 第二层级内容 -->
            <table-tree-node-for-edit
              v-for="(item1, index) in item.children"
              :node="item1"
              :key = "index"
              :level="1"
              @insert="handleInsertChildren(item1)"
              @update="handleUpdateChildren(item1)"
              @delete="handleDelete(item1.id)"
              @save="handleSaveEditPlan(item1)"
              @clear="handleClear(item1)"
            >
              <div v-if="item1.children && item1.children.length > 0" class="table-children">
                <!-- 第三层级内容-->
                <table-tree-node-for-edit
                  v-for="(item2, index) in item1.children"
                  :node="item2"
                  :key = "index"
                  :level="2"
                  @update="handleUpdateChildrens(item2)"
                  @delete="handleDelete(item2.id)"
                  @save="handleSaveEditPlan(item2)"
                  @clear="handleClear(item2)"
                >
                </table-tree-node-for-edit>
              </div>
            </table-tree-node-for-edit>
          </div>
        </table-tree-node-for-edit>
      </div>
    </div>

    <!-- import dialog -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      @close="resetForm"
      width="420px"
    >
      <div slot="title" style="font-weight: bolder">
        {{ remark === 'add' ? '新增材料计划' : '编辑材料计划' }}
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
        <el-button @click="dialogFormVisible = false">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" @click="handleSavePlan">{{$t('btn.comfirm')}}</el-button>
      </div>
    </el-dialog>
    <!-- /import dialog -->
  </div>
</template>

<script>

import { getMaterialPlanList, addMaterialPlan, deleteMaterialPlanById, updateMaterialPlanById, clearList } from '@/api/material';
import { zeroFull } from '@/utils/utils';
import TableTreeNodeForEdit from './components/TableTreeNodeForEdit';

export default {
  name: 'MaterialPlanEdit',
  components: {
    TableTreeNodeForEdit,
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
      list: [],
      listLoading: false,
      plan: {
        date: '',
        name: '',
      },
      editInfo: {},
      addingPlan: false,
      currentPid: null, // 显示最后一行
      dialogFormVisible: false,
      remark: 'add',
      remarkList: [],
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
        if (data && data.length > 0) {
          const listTemp = [];
          data.forEach((item) => {
            // 增加编辑属性 ,以及第几级，伏笔不确定级数
            item.level = 1;
            item.edit = false;
            if (item.children && item.children.length > 0) {
              item.children.forEach((children) => {
                children.edit = false;
                children.pid = item.id;
                children.level = 2;
                if (children.children && children.children.length > 0) {
                  children.children.forEach((grandson) => {
                    grandson.pid = children.id;
                    grandson.gid = item.id;
                    grandson.level = 3;
                    grandson.edit = false;
                  });
                } else {
                  children.children = [];
                }
              });
            } else {
              // 增加空children
              item.children = [];
            }
            listTemp.push(item);
          });
          this.list = listTemp;
        }
        this.listLoading = false;
      });
    },
    handleChangeDate() {
      this.selectDayIndex = 0;
      this.getList();
    },
    // 第一级插入子集
    handleInsert(param) {
      this.remark = 'add';
      this.remarkList = JSON.parse(JSON.stringify(this.list));
      if (this.list.length > 0) {
        const planTemp = {
          pid: param.id,
          id: -new Date().getTime(),
          level: 2,
          name: '',
          model: '',
          unit: '',
          standard: '',
          num: '',
          getTime: null,
          outPlace: '',
          usePlace: '',
          edit: true,
        };
        for (let i = 0; i < this.list.length; i += 1) {
          if (this.list[i].id === param.id) {
            if (this.list[i].children) {
              this.list[i].children.push(planTemp);
            } else {
              this.list[i].children = new Array(planTemp);
              this.$forceUpdate();
            }
            break;
          }
        }
      }
    },
    // 第一级编辑 模态框数据回显
    handleUpdate(param) {
      this.remark = 'edit';
      this.dialogFormVisible = true;
      this.plan = param;
    },
    handleClear(param) {
      this.remark = 'add';
      clearList(this.list, param);
      // this.list = JSON.parse(JSON.stringify(this.remarkList));
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
    handleSavePlan() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          const { date, name, id } = this.plan;
          if (this.remark === 'add') {
            addMaterialPlan({
              projectId: this.listQuery.projectId,
              name,
              start: date[0],
              end: date[1],
            }).then(() => {
              this.getList();

              this.dialogFormVisible = false;
            });
          } else {
            updateMaterialPlanById({
              projectId: this.listQuery.projectId,
              id,
              name,
              start: date[0],
              end: date[1],
            }).then(() => {
              this.getList();

              this.dialogFormVisible = false;
            });
          }
        }
      });
    },
    handleClose() {
      // this.$refs.dialogForm.resetFields();
      // this.$refs.dialogForm.$el.reset();
      this.dialogFormVisible = false;
      this.plan = { date: '', name: '' };
    },
    resetForm() {
      this.dialogFormVisible = false;
      this.plan = { date: '', name: '' };
    },
    handleSaveEditPlan(param) {
      const { name } = param;

      if (name.trim() === '') {
        this.$message({
          type: 'info',
          message: '材料名称不能为空',
        });

        return;
      }
      const obj = {
        name: param.name,
        model: param.model,
        standard: param.standard,
        unit: param.unit,
        num: param.num,
        getTime: param.getTime,
        outPlace: param.outPlace,
        usePlace: param.usePlace,
      };
      if (this.remark === 'add') {
        addMaterialPlan({
          pid: param.pid,
          projectId: this.listQuery.projectId,
          ...obj,
        }).then(() => {
          this.getList();
        });
      } else {
        updateMaterialPlanById({
          id: param.id,
          ...obj,
        }).then(() => {
          this.getList();
        });
      }
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
    handleInsertChildren(param) {
      this.remark = 'add';
      this.remarkList = JSON.parse(JSON.stringify(this.list));
      if (this.list.length > 0) {
        const planTemp = {
          pid: param.id,
          id: -new Date().getTime(),
          level: 3,
          name: '',
          model: '',
          unit: '',
          standard: '',
          num: '',
          getTime: null,
          outPlace: '',
          usePlace: '',
          edit: true,
        };
        for (let i = 0; i < this.list.length; i += 1) {
          if (param.pid === this.list[i].id) {
            for (let j = 0; j < this.list[i].children.length; j += 1) {
              if (this.list[i].children[j].id === param.id) {
                this.list[i].children[j].children.push(planTemp);
                break;
              }
            }
            break;
          }
        }
      }
    },
    handleUpdateChildren(param) {
      this.remark = 'edit';
      this.remarkList = JSON.parse(JSON.stringify(this.list));
      if (this.list.length > 0) {
        for (let i = 0; i < this.list.length; i += 1) {
          if (param.pid === this.list[i].id) {
            for (let j = 0; j < this.list[i].children.length; j += 1) {
              if (this.list[i].children[j].id === param.id) {
                this.list[i].children[j].edit = true;
                break;
              }
            }
            break;
          }
        }
      }
    },
    handleUpdateChildrens(param) {
      this.remark = 'edit';
      this.remarkList = JSON.parse(JSON.stringify(this.list));
      if (this.list.length > 0) {
        for (let i = 0; i < this.list.length; i += 1) {
          if (this.list[i].children && this.list[i].children.length > 0) {
            for (let j = 0; j < this.list[i].children.length; j += 1) {
              if (this.list[i].children[j].id === param.pid) {
                if (this.list[i].children[j].children && this.list[i].children[j].children.length > 0) {
                  for (let k = 0; k < this.list[i].children[j].children.length; k += 1) {
                    if (this.list[i].children[j].children[k].id === param.id) {
                      this.list[i].children[j].children[k].edit = true;
                      break;
                    }
                  }
                  break;
                }
              }
            }
          }
        }
      }
    },
  },
};
</script>

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
