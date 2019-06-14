<template>
  <div class="MeasuredDataItemLeft" v-if="buildingDataList">
    <div><!--@mousedown="rowDrop" id="haulSection"-->
      <section class="leftDiv">
        <!--<section class="leftDiv" id="triggerHaulSection">-->
        <div class="buildingIsNotClickable">
          楼栋数据
        </div>
        <div id="triggerHaulSection">
          <div v-for="(item, index) in buildingDataList"
               :key="index" class="itemClass">
            <el-button type="primary"
                       plain
                       size="medium"
                       :id = "`building_${index}`"
                       :style="`backgroundColor: ${ index === nowSelectd ? '#409EFF':'' };
                       color: ${ index === nowSelectd ? '#FFFFFF':'' };`"
                       @click="SwitchBuilding(item)"
            >
              {{item.bName}}
              <i class="el-icon-arrow-right"></i>
            </el-button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeasuredDataItemLeft',
  props: {
    buildingDataList: {
      type: Array,
      required: true,
    },
    nowSelectd: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // dropCol: [
      //   {
      //     prop: 'name',
      //   },
      // ],
    };
  },
  methods: {
    SwitchBuilding(item) {
      this.$emit('listData', item);
      this.$emit('nowItem', item);
      // 按钮切换变色控制
      this.buildingDataList.forEach((res, index) => {
        if (res.bfmId === item.bfmId) {
          const nowButton = document.getElementById(`building_${index}`);
          nowButton.style.backgroundColor = '#409EFF';
          nowButton.style.color = '#F2F6FC';
        } else {
          const otherButton = document.getElementById(`building_${index}`);
          // otherButton.style.backgroundColor = '#F2F6FC';
          otherButton.style.backgroundColor = '';
          // otherButton.style.color = '#606266';
          otherButton.style.color = '';
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .MeasuredDataItemLeft {
    margin-left: 30px;
    .leftDiv {
      float: left;
      width: 163px;
      .itemClass{
        float: left;
        height: 40px;
        margin-top: 4px;
        margin-bottom: 4px;
        button {
          width: 163px;
          height: 40px;
          /*cursor: pointer;*/
          color: #606266;
          background-color: #F2F6FC;
          border-color: #F2F6FC;
          text-align: left;
          i {
            float: right;
            color: #F5F7FA;
            margin-right: -20px;
            /*margin-top: 0px;*/
          }
          &:hover {
            /*color: #FFFFFF;*/
            background-color: gainsboro;
            i {
              color: #FFFFFF;
            }
          }
        }
      }
      .buildingIsNotClickable {
        float: left;
        width: 163px;
        height: 48px;
        line-height: 48px;
        background-color: gainsboro;
        text-align: center;
      }
    }
  }
</style>
