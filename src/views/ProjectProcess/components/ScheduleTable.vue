<template>
  <div class="scheduleTable">
    <div v-for="(item, index) in list" :key="index" class="table-group expand">
      <div v-if="item.edit">
        <section class="table-cell flex-sb table-title">
          <span>
            <span :style="`padding-left:${item.level * 10}px`" class="iconStyle">
              <el-input v-model="item.taskName" placeholder="计划名称" :style="`width:${340 - item.level * 10}px`"/>
            </span>
          </span>
          <span>
            {{ item.durationDate }}
            <!--<el-input v-model="item.durationDate" type="number" placeholder="工期(天)" style="width: 100px;"/>-->
          </span>
          <span>
            <el-date-picker
              v-model="item.startDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始时间"
              style="width: 149px;"
              @change="handleBeginDateChange(item)"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </span>
          <span>
            <el-date-picker
              v-model="item.endDate"
              selectableRange="[]"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"
              style="width: 149px;"
              @change="handleEndDateChange(item)"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </span>
          <span>
            <i class="el-icon-check hover-cursor" @click="handleSave(item)"></i>
            <i class="el-icon-close hover-cursor" @click="handleCancel(item)"></i>
          </span>
        </section>
      </div>
      <div v-else>
        <section class="table-cell flex-sb table-title">
          <span>
            <span :style="`padding-left:${item.level * 10}px`" class="iconStyle">
              <i class="el-icon-circle-plus" v-if="!item.show" @click="handleShow(item)"></i>
              <i class="el-icon-remove" v-if="item.show" @click="handleShow(item)"></i>
            </span>
            {{ item.taskName }}
          </span>
          <span>{{ item.durationDate }}</span>
          <span>{{ item.startDate ? item.startDate.substring(0,10) : '' }}</span>
          <span>{{ item.startDate ? item.endDate.substring(0,10) : '' }}</span>
          <span>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleInsert(item)">插入子列</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleUpdate(item)">编辑</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleDelete(item)">删除</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </section>
      </div>
      <div v-if="item.show && item.children.length > 0" class="table-children">
        <schedule-table
          :list="item.children"
          :msg="msg"
          :fatherObj="item"
          @show="handleShow"
          @insert="handleInsert"
          @update="handleUpdate"
          @delete="handleDelete"
          @save="handleSave"
          @cancel="handleCancel"
        ></schedule-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'scheduleTable',
  props: {
    list: {
      type: Array,
      required: true,
    },
    msg: {
      type: Object,
      required: false,
    },
    fatherObj: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      paramTemp: {},
      pickerOptions: {},
    };
  },
  mounted() {
    const obj = JSON.parse(JSON.stringify(this.fatherObj));
    const temp = {
      disabledDate(time) {
        if (obj !== undefined && obj !== null) {
          const itemStartDate = new Date(obj.startDate);
          return time.getTime() < itemStartDate.setDate(itemStartDate.getDate() - 1) || time.getTime() > new Date(obj.endDate);
        }
        return false;
      },
    };
    this.pickerOptions = temp;
  },
  beforeCreate() {
  },
  created() {
  },
  methods: {
    handleShow(param) {
      this.$emit('show', param);
    },
    handleInsert(param) {
      this.$emit('insert', param);
    },
    handleUpdate(param) {
      this.paramTemp = JSON.parse(JSON.stringify(param));
      this.$emit('update', param);
    },
    handleDelete(param) {
      this.$emit('delete', param);
    },
    handleSave(param) {
      if (param.startDate && param.endDate) {
        this.$emit('save', param);
      } else {
        this.$message({
          type: 'error',
          message: '请选择时间',
        });
      }
    },
    handleCancel(param) {
      if (param.id > 0) {
        param.taskName = this.paramTemp.taskName;
        param.durationDate = this.paramTemp.durationDate;
        param.startDate = this.paramTemp.startDate;
        param.endDate = this.paramTemp.endDate;
      }
      this.$emit('cancel', param);
    },
    // 增加一个不能超出父区间的判定 -- 如何直接给子赋值区间
    handleBeginDateChange(param) {
      // 获取父id的值，如果没有pid，则不会处理;需要使用递归;清空不生效
      if (param.startDate && param.endDate) {
        const start = new Date(param.startDate).getTime();
        const end = new Date(param.endDate).getTime();
        if (end < start) {
          param.beginDate = '';
          this.$message({
            type: 'error',
            message: '结束时间早于开始时间',
          });
        } else {
          param.durationDate = (((end - start) / 86400000) + 1).toFixed(0);
          param.endTime = (end - start) / this.msg.denominator;
          param.startTime = (start - this.msg.start.getTime()) / this.msg.denominator;
        }
      }
    },
    handleEndDateChange(param) {
      if (param.startDate && param.endDate) {
        const start = new Date(param.startDate).getTime();
        const end = new Date(param.endDate).getTime();
        if (end < start) {
          param.endDate = '';
          this.$message({
            type: 'error',
            message: '结束时间早于开始时间',
          });
        } else {
          param.durationDate = (((end - start) / 86400000) + 1).toFixed(0);
          param.endTime = (end - start) / this.msg.denominator;
          param.startTime = (start - this.msg.start.getTime()) / this.msg.denominator;
        }
      }
    },
    // <!--:picker-options = disabledDate(time) { return time.getTime() > Date.now();}-->
    handlPickerOptions() {
      // 每层都有一个唯一的值，可以利用这个为突破口解决
      // 如果没有pid 怎不用处理； 有pid ；怎根据pid的值获取；放到msg中可以
    },
  },
};
</script>

<style lang="scss" scoped>
.scheduleTable{
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
      width: 160px;
    }
    span:nth-child(1){
      width: 350px;
    }
    span:nth-child(2){
      width: 90px;
    }
    span:nth-child(5){
      width: 100px;
    }
  }
  .iconStyle{
    i {
      font-size: 14px;
    }
  }
}
</style>
