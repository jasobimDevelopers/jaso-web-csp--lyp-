<template>
  <div>
    <breadcrumb>
      <el-date-picker
        v-model="listQuery.date"
        type="month"
        value-format="yyyy-MM"
        placeholder="选择月"
        :clearable="false"
        @change="getList"
      >
      </el-date-picker>
    </breadcrumb>

    <div class="app-container">
      <!-- table -->
      <el-table
        :data="list"
        v-loading="listLoading"
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="姓名" prop="userName" width="100">
        </el-table-column>
        <el-table-column align="center" label="出勤天数" prop="workDays">
        </el-table-column>
        <el-table-column align="center" label="迟到" prop="lateNum">
        </el-table-column>
        <el-table-column align="center" label="早退" prop="leaveEarlyNum">
        </el-table-column>
        <el-table-column align="center" label="忘打卡" prop="forgetClockNum">
        </el-table-column>
        <el-table-column align="center" label="缺勤" prop="notWorkNum">
        </el-table-column>
        <el-table-column align="center" :label="$t('table.operation')" width="100">
          <template slot-scope="scope">
            <div class="operation-btns">
              <el-button type="primary" size="small" @click="particularsOpen(scope.row.userName,scope.row.userId,true)">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- /table -->
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogFormParticulars"
      width="700px"
    >
      <div style="height: 620px">
        <div slot="title" style=" margin-top:-25px;font-weight: bolder">
          {{username}}的考勤详情
          <el-button icon="el-icon-download" type="text"   class="topButton" style="float: right;margin-right:30px;margin-top: 0px;" >
            下载
          </el-button>
        </div>
        <hr noshade size="1px" style="margin-top: 10px;margin-bottom: 15px;color: #f5f7fa" >
        <div style="margin-left: 10px;margin-bottom: 10px">
          <span>选择日期 : </span>
          <el-date-picker
            v-model="startEndDate.start"
            type="month"
            value-format="yyyy-MM-dd"
            placeholder="选择月"
            :clearable="false"
            style="margin-right: auto;width: 200px"
          >
          </el-date-picker>
          <span style="margin-left: 10px;margin-right: 10px">至</span>
          <el-date-picker
            v-model="startEndDate.end"
            type="month"
            value-format="yyyy-MM-dd"
            placeholder="选择月"
            :clearable="false"
            style="margin-right: auto;width: 150px"
          >
          </el-date-picker>
          <el-button @click="particularsOpen(username,userid,false)" style="margin-left: 50px;background-color: #409EFF;color: white">查询</el-button>
        </div>
        <div style="height: 500px">
          <div v-show="true" id="myChart2" ref="myChart2" style="margin: auto;width: 500px; height: 500px;">
            <!--饼图-->
          </div>
          <div slot="footer" style="float: right;margin-right: 30px">
            <el-button @click="handleCancel">{{$t('btn.cancel')}}</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { zeroFull } from '@/utils/utils';
import { getAttenceLogList, getAttenceLogListForEcharts } from '@/api/attendance';

export default {
  name: 'Attendance',
  data() {
    const { params: { id } } = this.$route;
    const now = new Date();
    const date = `${now.getFullYear()}-${zeroFull(now.getMonth() + 1)}`;

    return {
      username: '',
      userid: -1,
      listQuery: {
        pageIndex: -1,
        projectId: id,
        date,
      },
      listLoading: false,
      dialogFormParticulars: false,
      list: null,
      barList: null,
      barDate: null,
      startEndDate: {
        start: null,
        end: null,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      const { projectId, date } = this.listQuery;
      const dateArr = date.split('-');
      this.barDate = new Date(dateArr[0], dateArr[1], 0).getDate();
      getAttenceLogList({
        projectId,
        year: dateArr[0],
        month: dateArr[1],
      }).then((res) => {
        const { data } = res;
        this.list = data;
        this.listLoading = false;
      });
    },
    handleCancel() {
      this.dialogFormParticulars = false;
    },
    startEndTime() {
      let { start, end } = this.startEndDate;
      if (new Date(end).getDate() === 1) {
        const endArr = end.split('-');
        const startDate = (new Date(start));
        const endDate = (new Date(new Date(`${endArr[0]}-${(Number(endArr[1]) + 1)}-${endArr[2]}`).getTime() - (1000 * 60 * 60 * 24)));// 获取当月最后一天日期
        start = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
        end = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;
        this.startEndDate.start = start;
        this.startEndDate.end = end;
      }
    },
    particularsOpen(userName, userId, falg) {
      this.dialogFormParticulars = true;
      if (falg) {
        this.username = userName;
        this.userid = userId;
        const startdate = `${this.listQuery.date}-1`;
        this.startEndDate.start = startdate;
        this.startEndDate.end = startdate;
        this.startEndTime();
      } else {
        this.startEndTime();
      }
      const { projectId } = this.listQuery;
      const { start, end } = this.startEndDate;
      getAttenceLogListForEcharts({
        projectId,
        start,
        end,
        userId,
      }).then((res) => {
        const { data } = res;
        this.barList = data;
        let falg2 = false;
        res.data.forEach((row) => {
          if (row.userName === this.username) {
            falg2 = true;
          }
        });
        if (falg2) {
          this.drawLineBar();
        } else {
          this.barList = [];
          this.drawLineBar();
        }
      });
    },
    drawLineBar() {
      let row = {};
      let timeDate = 1;
      if (this.barList.length !== 0) {
        row = this.barList[0];
        timeDate = row.workDays + row.notWorkNum;
      } else {
        row.workDays = 0;
        row.lateNum = 0;
        row.leaveEarlyNum = 0;
        row.forgetClockNum = 0;
        row.notWorkNum = 0;
      }
      this.$nextTick(() => {
        const charts2 = document.getElementById('myChart2');
        const myChart2 = this.$echarts.init(charts2);
        const options2 = {
          title: {
            text: '考勤数据',
            left: 160,
            top: 30,
            x: 'center',
            textStyle: {
              fontSize: 14,
            },
          },
          tooltip: {
            trigger: 'item',
            formatter(data) {
              const datatime = `${data.seriesName}<br/>${data.name}:  ${data.value}  (${((data.value / timeDate) * 100).toFixed(2)}%)`;
              return datatime;
            },
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 100,
            bottom: 20,
            data: ['出勤天数', '迟到', '早退', '忘打卡', '缺勤'],
          },
          series: [{
            name: '单位:天',
            type: 'pie',
            radius: '55%',
            center: ['40%', '50%'],
            data: [
              { value: row.workDays, name: '出勤天数' },
              { value: row.lateNum, name: '迟到' },
              { value: row.leaveEarlyNum, name: '早退' },
              { value: row.forgetClockNum, name: '忘打卡' },
              { value: row.notWorkNum, name: '缺勤' },
            ],
          }],
        };
        myChart2.setOption(options2);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
