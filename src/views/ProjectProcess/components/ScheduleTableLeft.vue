<template>
  <div class="scheduleTableLeft">
    <div v-for="(item, index) in list" :key="index" class="table-group expand">
      <section class="table-cell flex-sb table-title">
        <span>
          <span :style="`padding-left:${item.level * 10}px`" class="iconStyle">
            <i class="el-icon-circle-plus" v-if="!item.show" @click="handleShow(item)"></i>
            <i class="el-icon-remove" v-if="item.show" @click="handleShow(item)"></i>
          </span>
          {{ item.taskName }}
        </span>
      </section>
      <div v-if="item.show && item.children.length > 0" class="table-children">
        <schedule-table-Left :list="item.children" @show="handleShow"></schedule-table-Left>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'scheduleTableLeft',
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
.scheduleTableLeft{
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
  .iconStyle{
    i {
      font-size: 14px;
    }
  }
}
</style>
