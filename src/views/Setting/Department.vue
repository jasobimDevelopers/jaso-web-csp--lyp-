<template>
  <div class="department">
    <header class="admin-header flex-sb">
      <div class="title">组织架构</div>
      <div>
        <el-button type="text" @click="handleSort" style="color: #606266;">{{ sortTableVisible ? '保存' : '排序'  }}</el-button>
        <el-button type="text" @click="handleAdd" >新建部门</el-button>
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
      <edit-line
        v-for="item in list"
        :key="item.id"
        :editInfo="item"
        @onEdit="handleEdit"
        @onDelete="handleDelete"
      >
      {{ item.name }}
      </edit-line>
    </div>

    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      @close="resetForm"
      width="360px"
    >
      <div slot="title" style="font-weight: bolder">
        {{ this.actionStatus === 'add' ? '新建部门' : '编辑部门' }}
      </div>
      <el-form :rules="rules" ref="dialogForm" :model="department">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="department.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" :disabled="department.name === ''" @click="handleSave">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>
    <!-- /dialog -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getDepartmentList, addDepartment, deleteDepartment, updateDepartment } from '@/api/department';
import { addUserIndexList } from '@/api/sort';


export default {
  name: 'Department',
  computed: {
    ...mapGetters({
      userMsg: 'userInfo',
    }),
  },
  data() {
    return {
      list: [],
      department: {
        name: '',
      },
      // dialog
      dialogFormVisible: false,
      sortTableVisible: false,
      // action status
      actionStatus: 'add',
      // rules
      rules: {
        name: [{ required: true, message: `部门名称${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      col: [
        {
          label: '部门名称',
          prop: 'name',
        },
      ],
      dropCol: [
        {
          label: '部门名称',
          prop: 'name',
        },
      ],
      tableData: [],
    };
  },
  created() {
    this.getList();
  },
  // mounted() {
  //   this.rowDrop();
  //   this.columnDrop();
  // },
  methods: {
    getList() {
      getDepartmentList().then((res) => {
        const { data } = res;
        this.list = data;
      });
    },
    handleAdd() {
      this.actionStatus = 'add';
      this.dialogFormVisible = true;
    },
    handleSave() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          if (this.actionStatus === 'add') {
            addDepartment(this.department).then(() => {
              this.dialogFormVisible = false;
              this.getList();
            });
          } else {
            updateDepartment(this.department).then(() => {
              this.dialogFormVisible = false;
              this.getList();
            });
          }
        }
      });
    },
    handleEdit(item) {
      this.actionStatus = 'edit';
      this.department = {
        id: item.id,
        name: item.name,
      };
      this.dialogFormVisible = true;
    },
    handleDelete(item) {
      const { id } = item;

      this.$confirm('此操作将永久删除该部门, 是否继续?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        deleteDepartment({ id }).then(() => {
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
    resetForm() {
      this.department = {
        name: '',
      };

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
                aboutType: '0',
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
        msg.tableData = JSON.parse(JSON.stringify(msg.list));
        this.$nextTick(function () {
          this.rowDrop();
          this.columnDrop();
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
