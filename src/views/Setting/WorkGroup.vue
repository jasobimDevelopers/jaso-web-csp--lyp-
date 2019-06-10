<template>
  <div class="work-group">
    <header class="admin-header flex-sb">
      <div class="title">班组管理</div>
      <div>
        <el-button type="text" @click="handleSort" style="color: #606266;">{{ sortTableVisible ? '保存' : '排序'  }}</el-button>
        <el-button type="text" @click="handleAdd" >新建班组</el-button>
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

    <!-- dialog -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      @close="resetForm"
      width="360px"
    >
      <div slot="title" style="font-weight: bolder">
        {{ this.actionStatus === 'add' ? '新建班组' : '编辑班组' }}
      </div>
      <el-form :rules="rules" ref="dialogForm" :model="team">
        <el-form-item label="班组名称" prop="name">
          <el-input v-model="team.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" :disabled="team.name === ''" @click="handleSave">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>
    <!-- /dialog -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { addUserIndexList } from '@/api/sort';
import { getUserTeamList, addUserTeam, deleteUserTeam, updateUserTeam } from '@/api/team';

export default {
  name: 'WorkGroup',
  computed: {
    ...mapGetters({
      userMsg: 'userInfo',
    }),
  },
  data() {
    return {
      list: [],
      team: {
        name: '',
      },
      // dialog
      dialogFormVisible: false,
      // action status
      actionStatus: 'add',
      sortTableVisible: false,
      // rules
      rules: {
        name: [{ required: true, message: `部门名称${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      col: [
        {
          label: '班组名称',
          prop: 'name',
        },
      ],
      dropCol: [
        {
          label: '班组名称',
          prop: 'name',
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
      getUserTeamList().then((res) => {
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
            addUserTeam(this.team).then(() => {
              this.dialogFormVisible = false;
              this.getList();
            });
          } else {
            updateUserTeam(this.team).then(() => {
              this.dialogFormVisible = false;
              this.getList();
            });
          }
        }
      });
    },
    handleEdit(item) {
      this.actionStatus = 'edit';
      this.team = {
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
        // delete user
        deleteUserTeam({ id }).then(() => {
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
      this.team = {
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
                aboutType: '2',
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
        getUserTeamList().then((res) => {
          const { data } = res;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
