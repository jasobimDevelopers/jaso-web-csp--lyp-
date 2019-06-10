<template>
  <div class="node">
    <header class="admin-header flex-sb">
      <div class="title">节点管理</div>
      <div>
        <el-button type="text" @click="handleSort" style="color: #606266;">{{ sortTableVisible ? '保存' : '排序'  }}</el-button>
        <el-button type="text" @click="handleAdd" >新建节点</el-button>
      </div>
    </header>

    <div v-if="sortTableVisible" style="margin-top: 20px;width: 900px;">
      <div class="list-wrapper">
        <!--<div class="list-wrapper" style="width: 900px;">-->
        <el-table :data="tableData"
                  border
                  row-key="id"
                  align="left">
          <el-table-column label="序号" type="index"> </el-table-column>
          <el-table-column v-for="(item, index) in col"
                           :key="`col_${index}`"
                           :prop="dropCol[index].prop"
                           :label="item.label">
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="list-wrapper" v-else>
      <el-table
        :data="list"
        v-loading="listLoading"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" type="index"> </el-table-column>
        <el-table-column align="center" label="节点名称" prop="name" ></el-table-column>
        <el-table-column align="center" label="岗位名称" prop="workNameStr" ></el-table-column>
        <el-table-column align="center" label="指定人员" prop="approveUser" ></el-table-column>
        <!--<el-table-column align="center" :label="$t('table.operation')">-->
          <!--<template slot-scope="scope">-->
            <!--<div class="operation-btns">-->
              <!--<i class="el-icon-delete" v-if="!disableEdit" @click="handleDelete({ id: scope.row.id })"></i>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="approvWorkerQuery.pageIndex"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="approvWorkerQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      @close="resetForm"
      width="360px"
    >
      <div slot="title" style="font-weight: bolder">
        {{ this.actionStatus === 'add' ? '新建节点' : '编辑节点' }}
      </div>
      <el-form :rules="rules" ref="dialogForm" :model="node">
        <el-form-item label="节点名称" prop="name">
          <el-input v-model="node.name" placeholder="请输入">节点名称</el-input>
        </el-form-item>
        <el-form-item label="岗位名称" prop="workName">
          <el-select
            filterable
            v-model="node.workName"
            placeholder="请选择岗位"
            @change="handleWorkNameChange"
            style="width: 100%"
          >
            <el-option
              v-for="(item, i) in stepTaskType"
              :key="i"
              :label="item"
              :value="i">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指定人员" prop="approveUser">
          <el-select
            filterable
            v-model="node.approveUser"
            placeholder="请选择指定人员"
            style="width: 100%"
          >
            <el-option
              v-for="(item, i) in approveUserList"
              :key="i"
              :label="item.realName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary"  @click="handleSave">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { addUserIndexList } from '@/api/sort';
import { getNodeList, addNode, editNode, delNode } from '@/api/node';
import { stepTaskType } from '@/filters';
import { getUserList } from '@/api/userManage';

export default {
  name: 'Node',
  computed: {
    ...mapGetters({
      userMsg: 'userInfo',
    }),
  },
  data() {
    return {
      approvWorkerQuery: {
        pageIndex: 1,
        pageSize: 20,
        userName: '',
        realName: '',
        email: '',
        tel: '',
      },
      nodeListQuery: {
        pageIndex: 0,
        pageSize: 10,
      },
      node: {
        id: null,
        name: '',
        approveUser: null,
        workName: null,
      },
      list: [],
      listLoading: false,
      // dialog
      dialogFormVisible: false,
      // action status
      actionStatus: 'add',
      // rules
      rules: {
        name: [{ required: true, message: `节点名称${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        workName: [{ required: true, message: `岗位名称${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        approveUser: [{ required: true, message: `指定人员${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      stepTaskType,
      approveUserList: [],
      totalNumber: 0,
      totalPage: 1,
      sortTableVisible: false,
      col: [
        {
          label: '节点名称',
          prop: 'name',
        },
        {
          label: '岗位名称',
          prop: 'workNameStr',
        },
        {
          label: '指定人员',
          prop: 'approveUser',
        },
      ],
      dropCol: [
        {
          label: '节点名称',
          prop: 'name',
        },
        {
          label: '岗位名称',
          prop: 'workNameStr',
        },
        {
          label: '指定人员',
          prop: 'approveUser',
        },
      ],
      tableData: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getNodeList(this.nodeListQuery).then((res) => {
        const { data, totalNumber, totalPage } = res;
        for (const key in data) {
          if (key && data[key].workName) {
            data[key].workNameStr = stepTaskType[Number(data[key].workName)];
          }
        }
        this.list = data;
        this.totalNumber = totalNumber;
        this.totalPage = totalPage;
      });
      this.listLoading = false;
    },
    handleAdd() {
      this.actionStatus = 'add';
      this.dialogFormVisible = true;
    },
    handleSave() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          if (this.actionStatus === 'add') {
            addNode(this.node).then(() => {
              this.dialogFormVisible = false;
              this.getList();
            });
          } else {
            editNode(this.node).then(() => {
              this.dialogFormVisible = false;
              this.approveUserList = [];
              this.getList();
            });
          }
        }
      });
    },
    handleDelete(item) {
      const params = [{ id: item.id }];
      delNode(params).then((res) => {
        const { data } = res;
        this.list = data;
      });
    },
    handleWorkNameChange(val) {
      this.node.approveUser = null;
      this.approvWorkerQuery.workName = stepTaskType[val];
      getUserList(this.approvWorkerQuery).then((res) => {
        const { data } = res;
        this.approveUserList = data;
      });
    },
    resetForm() {
      this.node = {
        id: null,
        name: '',
        approveUser: null,
        workName: null,
      };
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.$el.reset();
      this.approveUserList = [];
    },
    handleSizeChange(val) {
      this.nodeListQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.nodeListQuery.pageIndex = Number(val) - 1;
      this.getList();
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody');
      const msg = this;
      this.$Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = msg.tableData.splice(oldIndex, 1)[0];
          msg.tableData.splice(newIndex, 0, currRow);
        },
      });
    },
    // 列拖拽
    columnDrop() {
      const wrapperTr = document.querySelector('.el-table__header-wrapper tr');
      this.sortable = this.$Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: (evt) => {
          const oldItem = this.dropCol[evt.oldIndex];
          this.dropCol.splice(evt.oldIndex, 1);
          this.dropCol.splice(evt.newIndex, 0, oldItem);
        },
      });
    },
    handleSort() {
      const msg = this;
      if (msg.sortTableVisible) {
        if (msg.tableData.length > 0) {
          const sortResult = [];
          for (const key in msg.tableData) {
            if (key) {
              const temp = {
                userId: msg.userMsg.id,
                aboutId: String(msg.tableData[key].id),
                aboutType: '3',
                indexs: (Number(key) + 1),
              };
              sortResult.push(temp);
            }
          }
          addUserIndexList({ newList: JSON.stringify(sortResult) }).then(() => {
            this.getList();
            this.$message({
              type: 'success',
              message: this.$t('message.operationSuccess'),
            });
          });
        }
        msg.sortTableVisible = false;
      } else {
        msg.sortTableVisible = true;
        // 获取所有数据
        getNodeList({ pageIndex: -1, pageSize: this.nodeListQuery.pageSize }).then((res) => {
          const { data } = res;
          for (const key in data) {
            if (key && data[key].workName) {
              data[key].workNameStr = stepTaskType[Number(data[key].workName)];
            }
          }
          msg.tableData = JSON.parse(JSON.stringify(data));
        });
        this.$nextTick(function () {
          this.rowDrop();
          this.columnDrop();
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
