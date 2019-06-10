<template>
  <div class="bids">
    <header class="admin-header flex-sb">
      <div class="title">标段管理</div>
      <div>
        <el-button type="text" @click="handleSort" style="color: #606266;">{{ sortTableVisible ? '保存' : '排序'  }}</el-button>
        <el-button type="text" @click="handleAdd">新建标段</el-button>
      </div>
    </header>

    <div v-if="sortTableVisible" style="margin-top: 20px;width: 900px;">
      <div class="list-wrapper">
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
        <el-table-column align="center" label="序号" type="index" ></el-table-column>
        <el-table-column align="center" label="项目名称" prop="projectName" ></el-table-column>
        <el-table-column align="center" label="标段名称" prop="name" ></el-table-column>
        <el-table-column align="center" :label="$t('table.operation')">
          <template slot-scope="scope">
            <div class="operation-btns">
              <i class="el-icon-edit-outline" @click="handleEdit(scope.row)"></i>
              <i class="el-icon-delete"  @click="handleDelete({ id: scope.row.id })"></i>
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" :label="$t('table.operation')">-->
          <!--<template slot-scope="scope">-->
            <!--<div class="operation-btns">-->
              <!--<el-button-group>-->
                <!--<el-button type="primary" size="mini"  @click="handleEdit(scope.row)">编辑</el-button>-->
                <!--<el-button type="primary" size="mini" @click="handleDelete({ id: scope.row.id })">删除</el-button>-->
              <!--</el-button-group>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <div class="pagination-container">
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
      :visible.sync="dialogFormVisible"
      @close="resetForm"
      width="360px"
    >
      <div slot="title" style="font-weight: bolder">
        {{ this.actionStatus === 'add' ? '新建标段' : '编辑标段' }}
      </div>
      <el-form :rules="rules" ref="dialogForm" :model="bids">
        <el-form-item label="所属项目" prop="projectId">
          <el-select  placeholder="请选择项目" filterable  v-model = "bids.projectId" style="width: 100%">
            <el-option
              v-for="item in projectList"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标段名称" prop="name">
          <el-input placeholder="请输入标段名称" v-model="bids.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCancel">{{$t('btn.cancel')}}</el-button>
        <el-button type="primary"  @click="handleSave">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { addUserIndexList } from '@/api/sort';
import { getBidsList, getProjectList, addBids, editBids, delBids } from '@/api/bids';

export default {
  name: 'Bids',
  computed: {
    ...mapGetters({
      userMsg: 'userInfo',
    }),
  },
  data() {
    return {
      listQuery: {
        pageSize: 10,
        pageIndex: 1,
      },
      projectListQuery: {
      },
      list: null,
      projectList: null,
      listLoading: false,
      bids: {},
      totalNumber: 0,
      totalPage: 1,
      rules: {
        projectId: [{ required: true, message: `所属项目${this.$t('message.notEmpty')}`, trigger: 'blur' }],
        name: [{ required: true, message: `标段名称${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      dialogFormVisible: false,
      actionStatus: 'add',
      sortTableVisible: false,
      col: [
        {
          label: '项目名称',
          prop: 'projectName',
        },
        {
          label: '标段名称',
          prop: 'name',
        },
      ],
      dropCol: [
        {
          label: '项目名称',
          prop: 'projectName',
        },
        {
          label: '标段名称',
          prop: 'name',
        },
      ],
      tableData: [],
    };
  },
  created() {
    this.getProjectList();
  },
  methods: {
    getList() {
      const msg = this;
      msg.listLoading = true;
      getBidsList(this.listQuery).then((res) => {
        const { data, totalNumber, totalPage } = res;
        for (const key in data) {
          if (key) {
            for (const item in msg.projectList) {
              if (item && msg.projectList[item].projectId === data[key].projectId) {
                data[key].projectName = msg.projectList[item].projectName;
              }
            }
          }
        }
        msg.list = data;
        msg.totalNumber = totalNumber;
        msg.totalPage = totalPage;
        msg.listLoading = false;
      });
    },
    getProjectList() {
      const msg = this;
      msg.listLoading = true;
      getProjectList(msg.projectListQuery).then((res) => {
        msg.projectList = res.data;
        getBidsList(this.listQuery).then((resBids) => {
          const { data, totalNumber, totalPage } = resBids;
          for (const key in data) {
            if (key) {
              for (const item in msg.projectList) {
                if (item && msg.projectList[item].projectId === data[key].projectId) {
                  data[key].projectName = msg.projectList[item].projectName;
                }
              }
            }
          }
          msg.list = data;
          msg.totalNumber = totalNumber;
          msg.totalPage = totalPage;
          msg.listLoading = false;
        });
      });
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.actionStatus = 'add';
    },
    handleSave() {
      const msg = this;
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          if (msg.actionStatus === 'add') {
            addBids(msg.bids).then(() => {
              msg.$message({
                type: 'success',
                message: this.$t('message.operationSuccess'),
              });
              msg.dialogFormVisible = false;
              msg.resetForm();
              msg.getList();
            });
          } else {
            editBids(msg.bids).then(() => {
              msg.$message({
                type: 'success',
                message: msg.$t('message.operationSuccess'),
              });
              msg.dialogFormVisible = false;
              msg.resetForm();
              msg.getList();
            });
          }
        }
      });
    },
    handleEdit(item) {
      this.actionStatus = 'edit';
      this.bids = {
        id: item.id,
        projectId: item.projectId,
        name: item.name,
      };
      this.dialogFormVisible = true;
    },
    handleDelete(params) {
      this.$confirm('此操作将永久删除该标段, 是否继续?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        delBids(params).then(() => {
          this.getList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = Number(val);
      // this.listQuery.pageIndex = Number(val) - 1;
      this.getList();
    },
    handleCancel() {
      this.dialogFormVisible = false;
      this.resetForm();
    },
    resetForm() {
      this.bids = { };
      this.$refs.dialogForm.resetFields();
      this.$refs.dialogForm.$el.reset();
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
                aboutType: '5',
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
        getBidsList({ pageIndex: -1, pageSize: this.listQuery.pageSize }).then((res) => {
          const { data } = res;
          for (const key in data) {
            if (key) {
              for (const item in msg.projectList) {
                if (item && msg.projectList[item].projectId === data[key].projectId) {
                  data[key].projectName = msg.projectList[item].projectName;
                }
              }
            }
          }
          msg.tableData = JSON.parse(JSON.stringify(data));
        });
        // 加载排序
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
