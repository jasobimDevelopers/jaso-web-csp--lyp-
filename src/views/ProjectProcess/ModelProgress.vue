<template>
  <div>
    <breadcrumb>
      <div class="flex-row topWork">
        <div><el-button type="text" @click="checkTheChart">{{isCheckTheChart ? '查看图表': '返回表单'}}</el-button></div>
      </div>
    </breadcrumb>
    <div v-if="isCheckTheChart">
      <el-table
        :data="modelProgressList"
        style="width: 924px;margin-left: 30px;margin-right: 30px"
        max-height="950"
        :default-sort = "{prop: 'professionType', order: 'descending'}"
      >
        <el-table-column
          prop="professionType"
          label="专业类型"
          sortable
          width="100">
          <template slot-scope="scope">
            <!--// 专业筛选（0、电气 1、暖通 2、给排水 3、消防）-->
            <!--<el-tag :type="handleColType(scope.row.professionType)" disable-transitions>-->
            {{scope.row.professionType === 0 ? '电气' : '' }}
            {{scope.row.professionType === 1 ? '暖通' : ''}}
            {{scope.row.professionType === 2 ? '给排水' : ''}}
            {{scope.row.professionType === 3 ? '消防' : ''}}
            {{scope.row.professionType === 6 ? '支吊架' : ''}}
            <!--</el-tag>-->
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          sortable
          width="120">
        </el-table-column>
        <el-table-column
          prop="serviceType"
          label="设备类型"
          sortable
          width="100">
        </el-table-column>
        <el-table-column
          prop="size"
          label="尺寸"
          sortable
          width="150">
        </el-table-column>
        <el-table-column
          prop="num"
          label="总量"
          sortable
          width="80">
        </el-table-column>
        <el-table-column
          prop="percent"
          label="已完成量"
          sortable
          width="130">
          <template slot-scope="scope">
            {{scope.row.percent}}
            <el-tag :type="handleColType(scope.row.percent)" disable-transitions>
              {{scope.row.percent === '100%' ? '正常' : '滞后'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="systemType"
          label="系统类型"
          sortable
          width="120">
        </el-table-column>
        <el-table-column
          label="进度详情"
          width="100">
          <template slot-scope="scope">
            <div class="operation-btns">
              <el-button type="primary"  size="small" @click="handleShowTask(scope.row)">进度详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="进度详情"
        :close-on-click-modal="false"
        :visible.sync="dialogStepsVisible"
        width="700px"
      >
        <div slot="title" style="font-weight: bolder">
          详情
        </div>
        <el-table
          :data="Progress"
          style="width: 600px;margin-left: 30px;margin-right: 30px"
          max-height="600"
        >
          <el-table-column
            prop="percent"
            label="完成度"
            width="120">
            <template slot-scope="scope">
              {{scope.row.percent + '%'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="actionDate"
            label="时间"
            width="250">
          </el-table-column>
          <el-table-column
            prop="realName"
            label="操作人"
            width="120">
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <div v-if="!isCheckTheChart" id="isCheckTheChart" style="height: 500px;width: 450px;float: left"></div>
    <div v-if="!isCheckTheChart" id="isCheckTheChart2" style="height: 500px;width: 450px;float: right;;"></div>
  </div>
</template>

<script>
import { getItemSelfPercent, getItemStateLogList } from '@/api/modelProgress';

export default {
  name: 'ModelProgress',
  data() {
    const { params: { id } } = this.$route;
    return {
      totalNumber: 0,
      modelProgressList: [],
      params: {
        projectId: id,
      },
      dialogStepsVisible: false,
      Progress: [],
      isCheckTheChart: true,
      lastNumList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      // 专业筛选（0、电气 1、暖通 2、给排水 3、消防）
      getItemSelfPercent(this.params).then((data) => {
        if (data) {
          // data.data.professionType === 0 ? "电气" : data.data.professionType === 1 ? "暖通" : data.data.professionType === 2 ? "给排水" : -1
          this.modelProgressList = data.data;
          // 各专业百分比
          // 电气 总量. 已完成量.
          let dqSum = 0;
          let ntSum = 0;
          let gpsSum = 0;
          let xfSum = 0;
          let zdjSum = 0;

          let dqNum = 0;
          let ntNum = 0;
          let gpsNum = 0;
          let xfNum = 0;
          let zdjNum = 0;
          this.modelProgressList.forEach((res) => {
            // 电气
            if (res.professionType === 0) {
              dqSum += 1;
              if (res.percent === '100%') {
                dqNum += 1;
              }
            }
            if (res.professionType === 1) {
              ntSum += 1;
              if (res.percent === '100%') {
                ntNum += 1;
              }
            }
            if (res.professionType === 2) {
              gpsSum += 1;
              if (res.percent === '100%') {
                gpsNum += 1;
              }
            }
            if (res.professionType === 3) {
              xfSum += 1;
              if (res.percent === '100%') {
                xfNum += 1;
              }
            }
            if (res.professionType === 6) {
              zdjSum += 1;
              if (res.percent === '100%') {
                zdjNum += 1;
              }
            }
          });
          dqSum = dqNum === 0 ? 1 : dqSum;
          ntSum = ntNum === 0 ? 1 : ntSum;
          gpsSum = gpsNum === 0 ? 1 : gpsSum;
          xfSum = xfNum === 0 ? 1 : xfSum;
          zdjSum = zdjNum === 0 ? 1 : zdjSum;
          // 获得各个专业已完成比
          this.lastNumList = [((dqNum / dqSum) * 100).toFixed(2),
            ((ntNum / ntSum) * 100).toFixed(2),
            ((gpsNum / gpsSum) * 100).toFixed(2),
            ((xfNum / xfSum) * 100).toFixed(2),
            ((zdjNum / zdjSum) * 100).toFixed(2)];
        }
      });
    },
    test() {
      getItemStateLogList();
    },
    checkTheChart() {
      if (this.isCheckTheChart) {
        this.isCheckTheChart = false;
        const option = {
          // title: {
          //   text: '多雷达图',
          // },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            x: 'center',
            data: ['各专业已完成情况(%)'],
          },
          radar: [
            {
              indicator: [
                { text: '电气', max: 100 },
                { text: '暖通', max: 100 },
                { text: '给排水', max: 100 },
                { text: '消防', max: 100 },
                { text: '支吊架', max: 100 },
              ],
              center: ['40%', '40%'],
              radius: 120,
              startAngle: 90,
              shape: 'circle',
              name: {
                formatter: '【{value}】',
                textStyle: {
                  color: '#72ACD1',
                },
              },
              // radius: 80
            },
          ],
          series: [
            {
              type: 'radar',
              tooltip: {
                trigger: 'item',
              },
              itemStyle: { normal: { areaStyle: { type: 'default' } } },
              data: [
                {
                  // value: [60, 73, 85, 40],
                  value: this.lastNumList,
                  name: '各专业已完成情况(%)',
                },
              ],
            },
          ],
        };
        const option2 = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999',
              },
            },
          },
          legend: {
            data: ['柱状(单位: %)', '折线(单位: %)'],
          },
          xAxis: [
            {
              type: 'category',
              data: ['电气', '暖通', '给排水', '消防', '支吊架'],
              axisPointer: {
                type: 'shadow',
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: '已完成(%)',
              min: 0,
              max: 100,
              interval: 20,
              axisLabel: {
                formatter: '{value} %',
              },
            },
          ],
          series: [
            {
              name: '柱状(单位: %)',
              type: 'bar',
              data: this.lastNumList,
            },
            {
              name: '折线(单位: %)',
              type: 'line',
              data: this.lastNumList,
            },
          ],
        };

        this.$nextTick(() => {
          const docm = document.getElementById('isCheckTheChart');
          const myChart = this.$echarts.init(docm);
          myChart.showLoading({
            text: '正在努力的读取数据中...',
          });
          myChart.clear();
          myChart.setOption(option);
          myChart.hideLoading();
          const docm2 = document.getElementById('isCheckTheChart2');
          const myChart2 = this.$echarts.init(docm2);
          myChart2.showLoading({
            text: '正在努力的读取数据中...',
          });
          myChart2.clear();
          myChart2.setOption(option2);
          myChart2.hideLoading();
        });
      } else {
        this.isCheckTheChart = true;
      }
    },
    handleColType(val) {
      let result = 'success';
      if (val === '100%') {
        result = 'success';
      } else {
        result = 'warning';
      }
      return result;
    },
    handleShowTask(row) {
      let lsdata = {
        projectId: this.params.projectId,
        idList: -1,
      };
      if (row.idList !== null) {
        lsdata = {
          projectId: this.params.projectId,
          idList: row.idList,
        };
      }
      getItemStateLogList(lsdata).then((data) => {
        if (data) {
          if (data.data !== null) {
            this.$nextTick(() => {
              this.Progress = data.data;
              this.dialogStepsVisible = true;
            });
          } else {
            this.$message({
              type: 'warning',
              message: '没有进度详情!',
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
