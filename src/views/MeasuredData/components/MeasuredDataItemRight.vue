<template>
  <div class="MeasuredDataItemRight" >
    <section>
      <el-table :data="areaList">
        <el-table-column align="center" prop="siteName" label="楼层区域"/>
        <el-table-column align="center" label="检查项">
          <template slot-scope="scope">
            <span>设备安装</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="paperOfMeasuredId" label="测试点">
          <template slot-scope="scope">
            <span v-for="item in paperOfMeasuredList" :key="item.paperId"
                  v-if="scope.row.paperOfMeasuredId === item.paperId">
              {{item.measuredNum}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="checkUser" label="检查人">
          <template slot-scope="scope">
            <span  v-for="item in userList" :key="item.paperId"
                   v-if="item.id === scope.row.checkUser">
              {{item.realName}}
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createDate" label="创建时间">
          <template slot-scope="scope">
            <span>
              {{ new Date(scope.row.createDate).getFullYear() + '-' + (new Date(scope.row.createDate).getMonth() + 1) + '-' + new Date(scope.row.createDate).getDate()}}
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              @click="openEditMeasuredSite(scope.row)"
              type="text" size="small"
            >编辑</el-button>
            <el-button
              type="text" size="small"
              style="color: #F56C6C"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script>
export default {
  name: 'MeasuredDataItemRight',
  props: {
    areaList: {
      type: Array,
      required: true,
    },
    paperOfMeasuredList: {
      type: Array,
      required: true,
    },
    userList: {
      type: Array,
      required: true,
    },
  },
  methods: {
    openEditMeasuredSite(item) {
      this.$emit('openEditMeasuredSite', item);
    },
  },
};
</script>

<style scoped>
  .MeasuredDataItemRight {
      float: left;
      width: 760px;
      border-left: 1px solid #EBEEF5;
  }
</style>
