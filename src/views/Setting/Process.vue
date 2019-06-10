<template>
  <div class="process">
    <header class="admin-header flex-sb">
      <div class="title">流程管理</div>
      <div>
        <el-button type="text" @click="handleSort" style="color: #606266;">{{ sortTableVisible ? '保存' : '排序'  }}</el-button>
        <el-button type="text" @click="handleAdd" >新建流程</el-button>
      </div>
    </header>

    <div class="app-container" v-if="isTheRefresh">
      <el-tabs v-model="activeName"   type="card" style="margin-top: 15px;" @tab-click="handleTabClick">
        <el-tab-pane v-for="items in processTypeList" :label="items.name" :key="items.id" :name="items.name">
          <!--数据-->
          <!--<div v-if="processTypeTableVisible" style="width: 99%;">-->
          <div v-if="items.tableVisible" style="width: 99%;">
            <el-table :data="items.processTypeData"
                      border
                      row-key="id"
                      align="center">
              <el-table-column align="center" label="序号" type="index"> </el-table-column>
              <el-table-column align="center" label="节点名称" prop="name" ></el-table-column>
              <el-table-column align="center" label="项目名称" prop="projectName" ></el-table-column>
              <el-table-column align="center" label="节点个数" prop="itemNum" ></el-table-column>
              <el-table-column align="center" :label="$t('table.operation')">
                <template slot-scope="scope">
                  <div class="operation-btns">
                    <i class="el-icon-info" @click="handleEdit(scope.row)" style="color:#03A9F4;"></i>
                    <i class="el-icon-delete"  @click="handleDelete({ id: scope.row.id })"></i>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--排序-->
          <!--style="width: 100%;-moz-user-select:none;"-->
          <!--unselectable="on"-->
          <!--onselectstart="return false;"-->
          <el-table
            :data="buildList"
            v-loading="buildListLoading"
            :id="`table_${initialProcessTypeId}`"
            fit
            highlight-current-row
            style="width: 100%;"
            v-if="!items.tableVisible && isTheRefreshTable"
            align="left"
          >
            <!--<el-table-column label="序号" type="index" ></el-table-column>-->
            <el-table-column v-for="(item, index) in col"
                             :key="`col_${index}`"
                             :prop="dropCol[index].prop === 'index' ? '' : dropCol[index].prop"
                             :type="item.prop === 'index' ? 'index' : ''"
                             :label="item.label">
            </el-table-column>
            <!--<el-table-column align="center" :label="$t('table.operation')">-->
            <!--<template slot-scope="scope">-->
            <!--<div class="operation-btns">-->
            <!--<el-button type="primary" size="mini" @click="handleProcessEdit(scope.row)">详情</el-button>-->
            <!--</div>-->
            <!--</template>-->
            <!--</el-table-column>-->
          </el-table>
          <!--分页-->
          <div v-if="!sortTableVisible" class="pagination-container">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="ListQuery.pageIndex"
              :page-sizes="[5, 10, 20, 40]"
              :page-size="ListQuery.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="TotalNumber">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--新建流程-->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="360px"
    >
      <div slot="title" style="font-weight: bolder">
        {{ this.actionStatus === 'add' ? '新建流程' : '查看流程' }}
      </div>
      <el-form :rules="rules" ref="dialogForm" :model="process">
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="process.name" placeholder="请输入" :disabled = "actionStatus === 'edit'" ></el-input>
        </el-form-item>
        <el-form-item label="选择项目"  prop="projectId">
          <el-select
            v-model="process.projectId"
            filterable
            placeholder="请选择"
            :disabled = "actionStatus === 'edit'"
            style="width: 100%"
          >
            <el-option
              v-for="(item, i) in projectList"
              :key="i"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程类别" prop="type">
          <el-select
            v-model="process.type"
            filterable
            placeholder="请选择"
            :disabled = "actionStatus === 'edit'"
            style="width: 100%"
            @change="handleProcessChange"
          >
            <el-option
              v-for="(item, i) in processType"
              :key="i"
              :label="item.name"
              :value="item.id">
            </el-option>
            <el-option value = "000" label="新增类别">
              <i class="el-icon-circle-plus-outline" style="color: blue"></i>
              <span style="margin-left: 10px;color: blue" >新增类别</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程节点个数" prop="itemNum">
          <el-input-number v-model="process.itemNum" :min="1"  :max="10"  label="节点个数" style="width: 100%;" @change="handleItemNumChange" :disabled = "actionStatus === 'edit'" ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button   @click="handleCancel">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary"  @click="handleNextStep">{{$t('btn.nextStep')}}</el-button>
      </div>
    </el-dialog>
    <!--查看流程-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogNextStepFormVisible"
      width="360px"
    >
      <div slot="title" style="font-weight: bolder">
        {{ this.actionStatus === 'add' ? '新建流程' : '查看流程' }}
      </div>
      <el-form :rules="rulesNext" ref="dialogSecondForm" :model="processNode">
        <el-form-item
          :label="item.name"
          :key="i"
          :prop="item.rule"
          v-for="(item, i) in processStep ">
          <el-select
            v-model="item.value"
            placeholder="请选择"
            :disabled = "actionStatus === 'edit'"
            style="width: 100%"
            @change="handleProcessChange"
          >
            <el-option
              v-for="(nodeListItem, i) in nodeList"
              :key="i"
              :label="nodeListItem.name"
              :value="nodeListItem.id">
            </el-option>
            <el-option value = "000" label="新增类别">
              <i class="el-icon-circle-plus-outline" style="color: blue"></i>
              <span style="margin-left: 10px;color: blue" >新增类别</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button  @click="handleLastStep">{{$t('btn.lastStep')}}</el-button>
        <el-button type="primary" :disabled = "actionStatus === 'edit'"   @click="handleSave">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>
    <!--流程类别新增-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogProcessFormVisible"
      width="420px"
      @close="resetProcessForm"
    >
      <div slot="title" style="font-weight: bolder;">
        {{'添加类别' }}
      </div>
      <hr noshade size="1px" style="margin-top: -10px; margin-bottom: 10px;color: rgba(220,223,230,1);" >
      <el-form :rules="processRules" ref="dialogProcessForm" :model="newProcess" :disabled="disableEdit" label-position="left">
        <el-form-item label="类别名：" prop="name">
          <el-input v-model.trim="newProcess.name" placeholder="请输入类别名:"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="resetProcessForm">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary" :disabled="disableEdit" @click="handleProcessSave">{{$t('btn.comfirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { addUserIndexList } from '@/api/sort';
import { getProcessList, addProcess, delProcess, handleNumUp,
  addProcessItem, getProcessMsg, addProcessDataType, getProcessDataTypeList } from '@/api/process';
import { getNodeList } from '@/api/node';
import { getProjectList } from '@/api/projectManage';
// import { processType } from '@/filters';

export default {
  name: 'Process',
  computed: {
    ...mapGetters({
      userMsg: 'userInfo',
    }),
  },
  data() {
    return {
      process: {
        name: '',
        itemNum: 1,
        projectId: null,
        processType: null,
      },
      processNode: {},
      projectQuery: {
        pageIndex: -1,
        pageSize: 20,
      },
      nodeListQuery: {
        pageIndex: -1,
        pageSize: 20,
      },
      ListQuery: {
        pageIndex: 1,
        pageSize: 20,
        type: 0,
      },
      payListQuery: {
        pageIndex: 0,
        pageSize: 20,
        type: 1,
      },
      buildList: [],
      payList: [],
      // dialog
      dialogFormVisible: false,
      dialogNextStepFormVisible: false,
      // action status
      actionStatus: 'add',
      // rules
      rules: {
        name: [{ required: true, message: `流程名称${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        projectId: [{ required: true, message: `项目${this.$t('message.notEmpty')}`, trigger: 'change' }],
        type: [{ required: true, message: `流程类别${this.$t('message.notEmpty')}`, trigger: 'change' }],
        itemNum: [{ required: true, message: `流程节点个数${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      rulesNext: {},
      activeName: '',
      buildListLoading: false,
      payListLoading: false,
      // 项目数组
      projectList: [],
      // 流程类型数组
      processType: [],
      // 生成的下拉框数据
      processStep: [{ id: '1', name: '第一节点', value: null }],
      // 节点数组
      nodeList: [],
      temp: null,
      TotalNumber: 0,
      TotalPage: 1,
      payTotalNumber: 0,
      payTotalPage: 1,
      sortTableVisible: false,
      TableVisible: false,
      buildTaskSortTableVisible: false,
      paySortTableVisible: false,
      buildTaskTableData: [],
      payTableData: [],
      col: [
        {
          label: '序号',
          prop: 'index',
        },
        {
          label: '节点名称',
          prop: 'name',
        },
        {
          label: '项目名称',
          prop: 'projectName',
        },
        {
          label: '节点个数',
          prop: 'itemNum',
        },
      ],
      dropCol: [
        {
          label: '序号',
          prop: 'index',
        },
        {
          label: '节点名称',
          prop: 'name',
        },
        {
          label: '项目名称',
          prop: 'projectName',
        },
        {
          label: '节点个数',
          prop: 'itemNum',
        },
      ],
      dialogProcessFormVisible: false,
      newProcess: {
        name: '',
      },
      processRules: {
        name: [{ required: true, message: `类别名称${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      processTypeList: [],
      processTypeData: [],
      // processTypeTableVisible: false,
      isTheRefresh: true,
      isTheRefreshTable: true,
      initialProcessTypeId: 1,
    };
  },
  created() {
    // 获取所有项目
    getProjectList(this.projectQuery).then((res) => {
      const { data } = res;
      this.projectList = data;
      // 获得所有的流程类别
      this.handlegetProcessDataTypeList();
    });
    // 获取所有节点
    getNodeList(this.nodeListQuery).then((res) => {
      const { data } = res;
      this.nodeList = data;
    });
  },
  methods: {
    getList(val) {
      const processListQuery = {
        pageIndex: this.ListQuery.pageIndex - 1,
        pageSize: this.ListQuery.pageSize,
        typeId: val,
      };
      getProcessList(processListQuery).then((res) => {
        const { data, totalNumber, totalPage } = res;
        const projectListTemp = this.projectList;
        const dataListTemp = [];
        for (const key in data) {
          if (key) {
            const dataTemp = data[key];
            for (const pro in projectListTemp) {
              if (pro && projectListTemp[pro].id && dataTemp.projectId === projectListTemp[pro].id.toString()) {
                dataTemp.projectName = projectListTemp[pro].name;
                dataListTemp.push(dataTemp);
              }
            }
          }
        }
        // dataListTemp.sort((a, b) => b.id - a.id);
        this.TotalNumber = totalNumber;
        this.TotalPage = totalPage;
        this.processTypeList.forEach((res2) => {
          if (res2.id === val) {
            res2.processTypeData = dataListTemp;
            this.buildList = JSON.parse(JSON.stringify(dataListTemp));
          }
        });
      });
    },
    handleAdd() {
      this.processStep = [{ id: '1', name: '第一节点', value: null, node: 'node1' }];
      this.actionStatus = 'add';
      this.dialogFormVisible = true;
      this.processNode = {};
      if (this.$refs.dialogForm !== undefined) {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            this.resetForm();
          }
        });
      }
    },
    handleProcessEdit(item) {
      this.actionStatus = 'edit';
      this.process = {
        id: item.id,
        name: item.name,
        itemNum: item.itemNum,
        projectId: Number(item.projectId),
        type: 1,
      };
      this.dialogFormVisible = true;
      getProcessMsg({ id: item.id }).then((res) => {
        if (res !== undefined && res !== null && res.data !== null && res.data.length > 0) {
          const { data } = res;
          const itemList = [];
          for (const key in data) {
            if (key) {
              const tempSize = data[key].which;
              let stepTemp = '第';
              stepTemp += handleNumUp(tempSize);
              stepTemp += '节点';
              const stepTempList = { id: tempSize.toString(), name: stepTemp, value: data[key].id };
              itemList.push(stepTempList);
            }
          }
          this.processStep = itemList;
        }
      });
    },
    handleEdit(item) {
      this.actionStatus = 'edit';
      this.process = {
        id: item.id,
        name: item.name,
        itemNum: item.itemNum,
        projectId: Number(item.projectId),
        type: this.initialProcessTypeId,
      };
      this.dialogFormVisible = true;
      getProcessMsg({ id: item.id }).then((res) => {
        const { data } = res;
        const itemList = [];
        for (const key in data) {
          if (key) {
            const tempSize = data[key].which;
            let stepTemp = '第';
            stepTemp += handleNumUp(tempSize);
            stepTemp += '节点';
            const stepTempList = { id: tempSize.toString(), name: stepTemp, value: data[key].id };
            itemList.push(stepTempList);
          }
        }
        this.processStep = itemList;
      });
    },
    handleNextStep() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          this.dialogNextStepFormVisible = true;
        }
      });
    },
    handleLastStep() {
      this.dialogFormVisible = true;
      this.dialogNextStepFormVisible = false;
    },
    handleSave() {
      // 判断
      const msg = this;
      for (const key in msg.processStep) {
        if (key) {
          if (msg.processStep[key].value === null) {
            let logMsg = msg.processStep[key].name;
            logMsg += '不能为空';
            this.$message({
              type: 'error',
              message: logMsg,
            });
            return;
          }
        }
      }
      const params = {
        name: msg.process.name,
        itemNum: msg.process.itemNum,
        projectId: msg.process.projectId,
        typeId: msg.process.type,
      };
      addProcess(params).then((res) => {
        const processIdNew = res.data.data.id;
        if (processIdNew) {
          for (const key in msg.processStep) {
            if (key) {
              const itemParams = {
                processId: processIdNew,
                itemId: msg.processStep[key].value,
                which: Number(key) + 1,
              };
              addProcessItem(itemParams).then(() => {});
            }
          }
          msg.dialogNextStepFormVisible = false;
          msg.dialogNextStepFormVisible = false;
          msg.getList(msg.process.type);
        }
      });
    },
    handleDelete(params) {
      this.$confirm('此操作将永久删除该流程, 是否继续?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        delProcess(params).then(() => {
          this.getList(this.initialProcessTypeId);
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    handleCancel() {
      this.dialogFormVisible = false;
      this.resetForm();
    },
    resetForm() {
      this.process = {
        name: '',
        itemNum: 1,
        projectId: null,
        processType: null,
      };
      this.processNode = {};
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.$el.reset();
    },
    handleTabClick(tab) {
      // 内容复原问题；默认回到原样
      this.sortTableVisible = false;
      this.processTypeList.forEach((res) => {
        res.tableVisible = true;
        if (res.name === tab.label) { // 选中的数据
          this.activeName = res.name;
          this.initialProcessTypeId = res.id;
          this.ListQuery.pageIndex = 1;
          this.ListQuery.pageSize = 20;
          this.getList(res.id);
        }
      });
    },
    handleItemNumChange(val) {
      const itemList = [];
      for (let i = 1; i <= val;) {
        let stepTemp = '第';
        stepTemp += handleNumUp(i);
        stepTemp += '节点';
        let rules = 'node';
        rules += i;
        const stepTempList = { id: i.toString(), name: stepTemp, value: null, rule: rules };
        itemList.push(stepTempList);
        i += 1;
      }
      this.processStep = itemList;
    },
    handleSizeChange(val) {
      this.ListQuery.pageSize = val;
      this.getList(this.initialProcessTypeId);
    },
    handleCurrentChange(val) {
      this.ListQuery.pageIndex = Number(val);
      // this.ListQuery.pageIndex = Number(val - 1);
      this.getList(this.initialProcessTypeId);
    },
    // 行拖拽
    rowDrop() {
      // const tbody = document.querySelector('.el-table__body-wrapper tbody');
      const tbody = document.querySelector(`#table_${this.initialProcessTypeId} tbody`);
      const msg = this;
      this.$Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          // this.processTypeList.forEach((res) => {
          //   if (res.id === this.initialProcessTypeId) {
          //     const currRow = res.processTypeData.splice(oldIndex, 1)[0];
          //     res.processTypeData.splice(newIndex, 0, currRow);
          //     this.buildList = res.processTypeData;
          //   }
          // });
          if (msg.buildList && msg.buildList.length > 0) {
            const currRow = msg.buildList.splice(oldIndex, 1)[0];
            msg.buildList.splice(newIndex, 0, currRow);
            const newArray = msg.buildList.slice(0);
            msg.buildList = [];
            // this.isTheRefresh = false;
            msg.$nextTick(() => {
              msg.buildList = newArray;
            });
          }
        },
      });
    },
    handleSort() {
      const msg = this;
      msg.ListQuery.pageIndex = 0;
      msg.ListQuery.pageSize = 1000;
      msg.getList(this.initialProcessTypeId);
      msg.processTypeList.forEach((res) => {
        if (res.id === msg.initialProcessTypeId) { // 当前的流程类别
          if (res.tableVisible && !msg.sortTableVisible) {
            msg.sortTableVisible = true;
            res.tableVisible = false;
            // this.isTheRefreshTable = false;
            msg.$nextTick(() => {
              msg.rowDrop();
              // this.isTheRefreshTable = true;
            });
          } else { // 提交保存排序
            this.sortTableVisible = false;
            res.tableVisible = true;
            if (this.buildList.length > 0) {
              const sortResult = [];
              for (const key in this.buildList) {
                if (key) {
                  const temp = {
                    userId: this.userMsg.id,
                    aboutId: String(this.buildList[key].id),
                    aboutType: '4',
                    indexs: `${(Number(key) + 1)}`,
                  };
                  sortResult.push(temp);
                }
              }
              addUserIndexList({ newList: JSON.stringify(sortResult) }).then(() => {
                // 获取所有数据
                this.ListQuery.pageIndex = 1;
                this.ListQuery.pageSize = 20;
                this.getList(this.initialProcessTypeId);
                this.$message({
                  type: 'success',
                  message: this.$t('message.operationSuccess'),
                });
              });
            }
          }
        }
      });
    },
    handleProcessChange(val) {
      if (val === '000') {
        this.dialogProcessFormVisible = true;
      } else {
        this.dialogProcessFormVisible = false;
      }
    },
    resetProcessForm() {
      this.process.type = '';
      this.dialogProcessFormVisible = false;
      // this.dialogFormVisible = false;
      this.$refs.dialogProcessForm.resetFields();
      this.$refs.dialogProcessForm.$el.reset();
    },
    handleProcessSave() {
      this.$refs.dialogProcessForm.validate((valid) => {
        if (valid) {
          let flag = true;
          if (this.processTypeList) {
            this.processTypeList.forEach((res) => {
              if (this.newProcess.name === res.name) {
                flag = false;
              }
            });
          }
          if (flag) {
            addProcessDataType({ name: this.newProcess.name }).then((data) => {
              if (data) {
                this.resetProcessForm();
                this.resetForm();
                // this.dialogNextStepFormVisible = false;
                this.dialogFormVisible = false;
                this.handlegetProcessDataTypeList();
                this.isTheRefresh = false;
                this.$nextTick(() => {
                  this.isTheRefresh = true;
                });
                this.$message({
                  type: 'success',
                  message: '流程类别新增成功!',
                });
              }
            });
          } else {
            this.$message({
              type: 'warning',
              message: `流程类别[${this.newProcess.name}]已存在!`,
            });
          }
        }
      });
    },
    handlegetProcessDataTypeList() {
      // 获得所有的流程类别
      getProcessDataTypeList().then((data) => {
        if (data) {
          this.processType = [];
          const lsData = [];
          data.data.forEach((res, index) => {
            res.processTypeData = [];
            res.tableVisible = true;
            lsData.push(res);
            this.processType.push({ id: res.id, name: res.name });
            if (index === 0) {
              this.initialProcessTypeId = res.id;
              this.activeName = res.name;
            }
          });
          this.processTypeList = lsData;
        }
        this.getList(this.initialProcessTypeId);
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
