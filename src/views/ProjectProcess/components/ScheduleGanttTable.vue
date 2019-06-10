<template>
  <div class="scheduleGanttTable">
    <div v-for="(item, index) in list" :key="index" class="table-group expand">
      <section class="table-cell flex-sb table-title">
        <span class="" style="width: 100%;">
          <div :style="`width:${item.startTime}px;height:20px;float: left;`"></div>
          <div :style="`width:${item.endTime}px;float: left;`">
            <el-tooltip class="item" effect="dark" :content="`计划周期：${item.startDate && item.startDate.length >= 10 ? item.startDate.substring(0,10) : ''} 至 ${item.endDate && item.endDate.length >=10 ? item.endDate.substring(0,10) : ''}`" placement="top">
              <div style="width: 100%;height: 10px;background-color: #C4F1C4;border-left: 1px solid grey;border-right: 1px solid grey;">
              </div>
            </el-tooltip>
          </div>
          <div style="float: left"></div>
        </span>
      </section>
      <div v-if="item.show && item.children.length > 0" class="table-children">
        <schedule-gantt-table :list="item.children"></schedule-gantt-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'scheduleGanttTable',
  props: {
    list: {
      type: Array,
      required: true,
    },
    msg: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  created() {
  },
  methods: {
    handleShow(param) {
      this.$emit('show', param);
    },
  },
};
</script>

<style lang="scss" scoped>
.scheduleGanttTable{
  .table-header {
    color: #909399;
    font-weight: bold;
  }
  .table-cell {
    height: 48px;
    color: #909399;
    text-align: center;
    border-bottom: 1px solid #ebeef5;
    font-size: 13px;
    span {
      i {
        margin-right: 8px;
        color: #409EFF;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .table-title{
    span {
      text-align: left;
      width: 190px;
    }
    span:nth-child(1){
      width: 350px;
    }
  }
}
</style>
