<template>
  <div class="ImageRecordRight" >
    <div v-if="theChart">
      <div class="leftTitle">
        <span>分部工程</span>
        <span>部位</span>
        <div v-if="buildingDataList.length !== 0"  v-for="(item, index) in floorListImageProgressList" :key="index">
          <span>{{item.projectPart}}</span>
          <span>{{item.unitPart}}</span>
        </div>
      </div>
      <div class="rightTitle" id="rightDiv" @mousedown="mousedown" @mousemove="mousemove" @mouseleave="mouseoutorup" @mouseup="mouseoutorup">
        <section v-if="!isMoreThan5 && floorListTitle.length !== 0" style="-moz-user-select:none;"  unselectable="on" onselectstart="return false;">
          <!--<section>-->
          <div v-for="(title, index) in floorListTitle" :key="index">
            {{title}}
          </div>
          <section  :style="`width: ${ floorListTitle.length * 100 }px;`" v-if="floorListTabulatedData.length !== 0">
            <div v-for="(item, index) in floorListTabulatedData" :key="index">
              {{buildingDataValues.type === 0 ? item : item + "%"}}
            </div>
          </section>
        </section>
        <section v-if="isMoreThan5 && floorListTitle2.length !== 0" style="-moz-user-select:none;"  unselectable="on" onselectstart="return false;">
          <!--<section>-->
          <div v-for="(title, index) in floorListTitle2" :key="index">
            {{title}}
          </div>
          <section  :style="`width: ${ floorListTitle2.length * 100 }px;`"  v-if="floorListTabulatedData2.length !== 0">
            <div v-for="(item, index) in floorListTabulatedData2" :key="index">
              {{buildingDataValues.type === 0 ? item : item === null ? item : item+"%"}}
            </div>
          </section>
        </section>
      </div>
    </div>
    <!--<div v-show="!theChart" id="isTheCharts" style="float: right;width: 710px;height: 500px;margin-top: 10px;background-color: #F2F6FC">-->
    <!--这里是图表-->
    <!--</div>-->
    <div v-show="!theChart" >
      <div class="visualSchedule" v-if="!theChart" >
        {{buildingDataValues.name}}形象进度
      </div>
      <div id="isTheCharts2" class="theCharts"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageRecordRight',
  props: {
    floorListData: {
      type: Array,
      required: false,
    },
    floorListTitle: {
      type: Array,
      required: true,
    },
    floorListTitle2: {
      type: Array,
      required: true,
    },
    floorListImageProgressList: {
      type: Array,
      required: true,
    },
    buildingDataList: {
      type: Array,
      required: true,
    },
    theChart: {
      required: true,
    },
    buildingDataValues: {
      required: true,
    },
    floorListTabulatedData: {
      type: Array,
      required: true,
    },
    floorListTabulatedData2: {
      type: Array,
      required: true,
    },
    isMoreThan5: {
      required: true,
    },
  },
  methods: {
    mousedown(e) {
      this.$emit('mousedown', e);
    },
    mousemove(e) {
      this.$emit('mousemove', e);
    },
    mouseoutorup(e) {
      this.$emit('mouseoutorup', e);
    },
  },
};
</script>

<style lang="scss" scoped>
  .ImageRecordRight {
    .leftTitle {
      float: left;
      width: 261px;
      border-left: 1px solid #EBEEF5;
      span {
        float: left;
        /*display: block;*/
        width: 130px;
        height: 48px;
        /*line-height: 48px;*/
        text-align: center;
        background-color: #F9F9F9;
        display: flex;
        align-items: center;
        /*justify-content: space-between;*/
        justify-content: center;
      }
      div {
        span {
          background-color: #ffffff;
          border-bottom: 1px solid #EBEEF5;
        }
      }
    }
    .rightTitle {
      /*cursor: e-resize;*/
      /*position: relative;*/
      float: right;
      margin-right: -48px;
      width: 500px;
      overflow-x: auto;
      /*overflow-x: hidden;*/
      /*overflow-y: hidden;*/
      section {
        width: 1000px;
        div {
          float:left;
          width: 100px;
          height: 48px;
          line-height: 48px;
          text-align: center;
          background-color: #F9F9F9;
          border-bottom: 1px solid #EBEEF5;
        }
        section {
          div {
            float:left;
            width: 100px;
            height: 48px;
            line-height: 48px;
            text-align: center;
            background-color: #ffffff;
          }
        }
      }
    }
    .theCharts {
      float: right;
      width: 700px;
      height: 700px;
      margin: 20px -20px 20px 10px;
      background-color: #F2F6FC;
    }
    .visualSchedule {
      height: 48px;
      background-color: #EBEEF5;
      margin-left: 193px;
      margin-right: -50px;
      text-align: center;
      line-height: 48px;
      font-size: 18px;
    }
  }
</style>
