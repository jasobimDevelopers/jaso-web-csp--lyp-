<template>
  <div class="app-container user-manage">
    <!-- filter -->
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" clearable class="filter-item" placeholder="真实姓名" v-model="listQuery.userName">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" clearable class="filter-item" placeholder="反馈内容" v-model="listQuery.content">
      </el-input>
     <el-input @keyup.enter.native="handleFilter" style="width: 200px;" clearable class="filter-item" placeholder="手机号或邮箱" v-model="listQuery.tel">
      </el-input>
      <el-date-picker
        v-model="listQuery.dates"
        align="right"
        type="date"
        placeholder="选择日期"
        class="filter-item"
        style="width: 200px;"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{$t('btn.search')}}</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" :disabled="multipleSelection.length === 0" @click="handleDeleteSelects">{{$t('btn.delete')}}</el-button>
    </div>
    <!-- /filter -->

    <!-- table -->
    <el-table
      :data="list"
      v-loading="listLoading"
      fit
      highlight-current-row
      style="width: 100%"
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
      :expand-row-keys="expandList"
      @row-click="toggleSelection"
      @expand-change="toggleSelection"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="序号" prop="index" width="50">
      </el-table-column>
      <el-table-column align="center" label="用户名" prop="userName" width="100">
      </el-table-column>
      <el-table-column align="center" label="邮箱/电话" prop="tel" width="200">
      </el-table-column>
      <el-table-column align="center" label="意见反馈" width="350">
        <template slot-scope="scope">
          <!--<span>{{scope.row.content}}</span>-->
          <div style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            {{scope.row.content}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="发布时间" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <div style="width: 100%;height: 100%;background-color: #f5f5f5">
            <el-form label-position="left" inline style="margin-left: 85px">
              <el-row :gutter="20" type="flex" style="height: 36px">
                <el-col :span="4">
                  <el-form-item label="用户名：">
                    <div>{{ props.row.userName }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="props.row.tel !== '' && props.row.tel !== null">
                  <el-form-item label="邮箱/电话：">
                    <div>{{ props.row.tel }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="发布时间：">
                    <div>{{ props.row.date }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="意见反馈：">
                    <div style="width: 800px">{{ props.row.content }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.operation')" width="100">
        <template slot-scope="scope">
          <div class="operation-btns">
            <!--<i @click="handleOmit(scope.row)" style="width: 18px;height: 18px;cursor:pointer"><svg-icon icon-class="展开" size="18" ></svg-icon></i>-->
            <i class="el-icon-delete" @click="handleDelete({ feedbackId: scope.row.id })"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- /table -->

    <!-- pagination -->
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
    <!-- /pagination -->
  </div>
</template>

<script>
import { getFeedbackList, deleteFeedback } from '@/api/feedback';

export default {
  name: 'FeedbackRecord',
  data() {
    return {
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        content: null,
        userName: null,
        tel: null,
        dates: null,
      },
      user: {
        id: null,
        userName: '',
        password: '',
        comfirmPassword: '',
        realName: '',
        email: '',
        tel: '',
        projectList: [],
        userIconUrl: '',
        departmentId: null,
        roleId: null,
        teamId: null,
        file: null,
        userType: '',
      },
      // upload file
      uploadFileSrc: null,
      // list
      list: null,
      listLoading: false,
      projectList: [],
      departmentList: [],
      roleList: [],
      teamList: [],
      // page
      totalNumber: 0,
      totalPage: 1,
      // multi select
      multipleSelection: [],
      // dialog
      dialogFormVisible: false,
      // dialog status
      dialogStatus: '',
      // userType Is Project
      userTypeIsProject: false,
      // pickerOptions
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          },
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - (3600 * 1000 * 24));
            picker.$emit('pick', date);
          },
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - (3600 * 1000 * 24 * 7));
            picker.$emit('pick', date);
          },
        }],
      },
      // expandList
      expandList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;

      getFeedbackList(this.listQuery).then((res) => {
        const { data, totalNumber, totalPage } = res;
        const dataList = [];
        for (const key in data) {
          if (key) {
            const temp = data[key];
            temp.index = Number(key) + 1 + (this.listQuery.pageSize * (this.listQuery.pageIndex - 1));
            dataList.push(temp);
          }
        }
        this.list = dataList;
        this.totalNumber = totalNumber;
        this.totalPage = totalPage;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageIndex = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDeleteSelects() {
      const list = [];
      this.multipleSelection.forEach((user) => {
        list.push(user.id);
      });
      this.handleDelete({
        feedbackId: list.join(','),
      });
    },
    handleDelete(params) {
      this.$confirm(this.$t('message.deleteFeedback'), this.$t('message.prompt'), {
        confirmButtonText: this.$t('btn.comfirm'),
        cancelButtonText: this.$t('btn.cancel'),
        type: 'warning',
      }).then(() => {
        // delete user
        deleteFeedback(params).then(() => {
          this.$message({
            type: 'success',
            message: this.$t('message.deleteOk'),
          });
          this.expandList = [];
          this.getList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.deleteCancel'),
        });
      });
    },
    // 获取row的key值
    getRowKeys(row) {
      return row.index;
    },
    toggleSelection(rows) {
      let flag = true;
      if (this.expandList.length > 0) {
        this.expandList.forEach((res, index) => {
          if (res === rows.index) {
            // this.expandList.remove(rows.index);
            this.expandList.splice(index, 1);
            flag = false;
          }
        });
      }
      if (flag) {
        this.expandList.push(rows.index);
      }
    },
  },
};
</script>

<style lang="scss">
  .user-manage {
    .el-table .cell {
      overflow: visible;

      img {
        object-fit: cover;
      }
    }
  }
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.app-container {
  margin: 24px 0;
  padding-top: 32px;
}

.filter-item {
  margin-right: 15px;
}
</style>
