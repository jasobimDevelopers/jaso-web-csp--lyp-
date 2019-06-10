<template>
  <div class="position">
    <header class="admin-header flex-sb">
      <div class="title">职务权限</div>
      <div>
        <el-button type="text" @click="handleSort" style="color: #606266;">{{ sortTableVisible ? '保存' : '排序'  }}</el-button>
        <el-button type="text" @click="handleAdd" >新建职务</el-button>
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

    <div v-else>
      <div class="info-wrapper">
        <section class="title">最高职务拥有以下特权：</section>
        <section>1、可以进入系统设置</section>
        <section>2、查看和编辑所有项目</section>
        <section>3、更新公司信息</section>
      </div>

      <div class="list-wrapper" >
        <edit-line
          v-for="item in list"
          :key="item.id"
          :editInfo="item"
          @onEdit="handleEdit"
          @onDelete="handleDelete"
        >
          <div class="role-item">
            <div class="name">{{ item.name }}</div>
            <div class="desc">{{ `共${item.menuList.length}项权限：${getMenuStr(item.menuList)}` }}</div>
          </div>
        </edit-line>
      </div>
    </div>

    <!-- dialog -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      @close="resetForm"
      width="435px"
    >
      <div slot="title" style="font-weight: bolder">
        {{ this.actionStatus === 'add' ? '新建职务' : '编辑职务' }}
      </div>
      <el-form :rules="rules" ref="dialogForm" :model="role" class="role-form">
        <el-form-item label="职务名称" prop="name">
          <el-input v-model="role.name" placeholder="请输入职务名称"></el-input>
        </el-form-item>
        <el-form-item label="职务权限" prop="name">
          <div class="menu-list">
            <el-checkbox-group v-model="role.menuList">
              <el-checkbox
                v-for="item in menuList"
                :key="item.id"
                :label="item.id"
              >{{ item.menuName }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="可编辑" prop="readState">
          <div style="display: inline-block">
            <el-switch v-model="role.readState">
            </el-switch>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" :disabled="role.name === '' || role.menuList.length === 0" @click="handleSave">{{$t('btn.save')}}</el-button>
      </div>
    </el-dialog>
    <!-- /dialog -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { addUserIndexList } from '@/api/sort';
import { getMenuListList } from '@/api/menu';
import { getRoleList, addRole, updateRole, deleteRole } from '@/api/role';

export default {
  name: 'Position',
  computed: {
    ...mapGetters({
      userMsg: 'userInfo',
    }),
  },
  data() {
    return {
      menuList: [],
      list: [],
      role: {
        name: '',
        readState: false,
        menuList: [],
      },
      // dialog
      dialogFormVisible: false,
      // action status
      actionStatus: 'add',
      // rules
      rules: {
        name: [{ required: true, message: `职务名称${this.$t('message.notEmpty')}`, trigger: 'blur' }],
      },
      sortTableVisible: false,
      col: [
        {
          label: '职务名称',
          prop: 'name',
        },
        {
          label: '权限数量',
          prop: 'menuListLength',
        },
      ],
      dropCol: [
        {
          label: '职务名称',
          prop: 'name',
        },
        {
          label: '权限数量',
          prop: 'menuListLength',
        },
      ],
      tableData: [],
    };
  },
  created() {
    getMenuListList().then((res) => {
      const menuList = res.data || [];

      this.menuList = menuList;
      this.getList();
    });
  },
  methods: {
    getList() {
      getRoleList().then((res) => {
        const { data } = res;

        data.forEach((menu) => {
          const menuList = this.getMenuList(menu.menuList);
          menu.menuList = menuList;
        });

        this.list = data;
      });
    },
    getMenuList(menuList) {
      const menuArr = [];

      menuList.forEach((menu) => {
        if (menu.children && menu.children.length > 0) {
          menu.children.forEach((childMenu) => {
            menuArr.push(childMenu);
          });
        }
      });

      return menuArr;
    },
    getMenuStr(list) {
      const menuArr = [];

      list.forEach((menu) => {
        menuArr.push(menu.name);
      });

      return menuArr.join(',');
    },
    checkMenu(menu) {
      const { menuList } = this.role;
      const menuIds = [];

      menuList.forEach((m) => {
        menuIds.push(m.id);
      });

      return menuIds.indexOf(menu.id) >= 0;
    },
    handleAdd() {
      this.actionStatus = 'add';
      this.dialogFormVisible = true;
    },
    handleEdit(item) {
      this.actionStatus = 'edit';
      const menuList = [];

      item.menuList.forEach((menu) => {
        menuList.push(Number(menu.id));
      });

      this.role = {
        id: item.id,
        name: item.name,
        menuList,
        readState: (item.readState === 1),
      };

      this.dialogFormVisible = true;
    },
    handleDelete(item) {
      const { id } = item;

      this.$confirm('此操作将永久删除该职务, 是否继续?', this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        // delete user
        deleteRole({ id }).then(() => {
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
    handleSave() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          const params = Object.assign(this.role, {
            readState: (this.role.readState ? 1 : 0),
            menuList: this.role.menuList.join(','),
          });

          if (this.actionStatus === 'add') {
            addRole(params).then(() => {
              this.dialogFormVisible = false;
              this.getList();
            });
          } else {
            updateRole(params).then(() => {
              this.dialogFormVisible = false;
              this.getList();
            });
          }
        }
      });
    },
    resetForm() {
      this.role = {
        name: '',
        readState: 0,
        menuList: [],
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
                aboutType: '1',
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
        getRoleList().then((res) => {
          const { data } = res;
          data.forEach((item) => {
            if (item.menuList !== null) {
              item.menuListLength = item.menuList.length;
            }
          });
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

<style lang="scss">
  .role-form {
    .menu-list {
      display: inline-block;
      padding: 8px 0;
      width: 100%;
      background: #F0F2F5;

      .el-checkbox {
        margin-left: 14px;
        width: 112px;
      }
    }
  }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .position .admin-header {
    border-bottom: none;
  }

  .info-wrapper {
    padding: 11px 15px;
    color: #909399;
    background: #F0F2F5;

    .title {
      margin-bottom: 5px;
    }
  }

  .list-wrapper {
    .edit-line {
      height: 72px;
    }

    .role-item {
      .desc {
        color: #909399;
      }
    }
  }
</style>
