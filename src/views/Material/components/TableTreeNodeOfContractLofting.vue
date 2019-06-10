<template>
  <div class="" style="width: 920px;">
    <div class="table-header flex-sb">
      <div style="width: 300px;float:left;">
        <div>
          <div class="table-group expand">
            <section class="table-cell flex-sb">
              <span style="padding-left: 12px;width: 50px;"></span>
              <span class="demo1" style="width: 50px;">序号</span>
              <span class="demo1" style="width: 200px;padding-left: 0px;">名称</span>
              <span class="demo1">单价</span>
            </section>
          </div>
          <div class="table-group expand"  v-for="(item, index) in list " :key="index">
            <section class="table-cell flex-sb">
              <span class="name" style="padding-left: 12px;width: 20px;">
                <i class="el-icon-circle-plus" v-if="!item.show" @click="handleShow(item)"></i>
                <i class="el-icon-remove" v-if="item.show" @click="handleShow(item)"></i>
              </span>
              <span class="demo" style="width: 50px;">{{ item.index }}</span>
              <span class="demo">{{ item.name }}</span>
              <span class="demo">{{ item.unit }}</span>
            </section>
            <div class="table-group expand" v-if="item.show && item.children && item.children.length>0" v-for="(item1, index1) in item.children " :key="index1">
              <section class="table-cell flex-sb">
                <span class="name" style="padding-left: 24px">
                  <el-button @click="handleShowChildren(item1)" size="small">{{ item.show ? '开启': '关闭' }}</el-button>
                </span>
                <span class="demo">{{ item1.type }}</span>
                <span class="demo">{{ item1.name }}</span>
                <span class="demo">{{ item1.unit }}</span>
              </section>
              <div class="table-group expand" v-if="item1.show && item1.children && item1.children.length>0" v-for="(item2, index2) in item1.children " :key="index2">
                <section class="table-cell flex-sb">
                  <span class="demo">{{ item2.type }}</span>
                  <span class="demo">{{ item2.name }}</span>
                  <span class="demo">{{ item2.unit }}</span>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 415px;overflow-x:auto;float:left;">
        <div :style=" `width: ${title.length * 200}px;padding-top: 17px;` ">
          <div class="table-group expand">
            <section class="table-cell flex-sb">
              <span class="demo1" v-for="(item, index) in title " :key="index" style="width: 200px">{{ item }}</span>
            </section>
          </div>
          <div class="table-group expand"  v-for="(item, index) in list " :key="index">
            <section class="table-cell flex-sb">
              <span class="demo">{{ item.sum }}</span>
              <span class="demo">{{ item.age }}</span>
            </section>
            <div class="table-group expand" v-if="item.show && item.children && item.children.length>0" v-for="(item1, index1) in item.children " :key="index1">
              <section class="table-cell flex-sb">
                <span class="demo">{{ item1.type }}</span>
                <span class="demo">{{ item1.name }}</span>
                <span class="demo">{{ item1.type }}</span>
                <span class="demo">{{ item1.name }}</span>
                <span class="demo">{{ item1.type }}</span>
                <span class="demo">{{ item1.name }}</span>
              </section>
              <div class="table-group expand" v-if="item1.show && item1.children && item1.children.length>0" v-for="(item2, index2) in item1.children " :key="index2">
                <section class="table-cell flex-sb">
                  <span class="demo">{{ item2.type }}</span>
                  <span class="demo">{{ item2.name }}</span>
                  <span class="demo">{{ item2.type }}</span>
                  <span class="demo">{{ item2.name }}</span>
                  <span class="demo">{{ item2.type }}</span>
                  <span class="demo">{{ item2.name }}</span>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="width: 210px;float:left;">
        <div>
          <div class="table-group expand">
            <section class="table-cell flex-sb">
              <span class="demo1">合计</span>
              <span class="demo1">限额系数</span>
              <span class="demo1">限额量</span>
            </section>
          </div>
          <div class="table-group expand" v-for="(item, index) in list " :key="index">
            <section class="table-cell flex-sb">
              <span class="demo">{{ item.sum }}</span>
              <span class="demo">{{ item.xe }}</span>
              <span class="demo">{{ item.xel }}</span>
            </section>
            <div class="table-group expand" v-if="item.show && item.children && item.children.length>0"  v-for="(item1, index1) in item.children " :key="index1">
              <section class="table-cell flex-sb">
                <span class="demo">{{ item1.sum }}</span>
                <span class="demo">{{ item1.xe }}</span>
                <span class="demo">{{ item.xel }}</span>
              </section>
              <div class="table-group expand" v-if="item1.show && item1.children && item1.children.length>0" v-for="(item2, index2) in item1.children " :key="index2">
                <section class="table-cell flex-sb">
                  <span class="demo">{{ item2.sum }}</span>
                  <span class="demo">{{ item2.xe }}</span>
                  <span class="demo">{{ item.xel }}</span>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableTreeNodeOfContractLofting',
  props: {
    list: {
      type: Array,
      required: true,
    },
    title: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  methods: {
    handleShow(val) {
      this.list.forEach((item) => {
        if (item.id === val.id) {
          if (item.show) {
            item.show = false;
          } else {
            item.show = true;
          }
        }
      });
    },
    handleShowChildren(val) {
      this.list.forEach((item) => {
        if (item.id === val.pid) {
          if (item.children) {
            item.children.forEach((param) => {
              if (param.id === val.id) {
                if (param.show) {
                  param.show = false;
                } else {
                  param.show = true;
                }
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
  .demo {
    width: 75px;
    height: 100%;
    display: block;
    border-left: 1px solid #dcdfe6;
    line-height: 45px;
    text-align: center;
  }
  .demo1{
    width: 75px;
    height: 100%;
    display: block;
    /*border-left: 1px solid #dcdfe6;*/
    /*border-top: 1px solid #dcdfe6;*/
    line-height: 45px;
    text-align: center;
  }
  .demo2{
    width: 200px;
    height: 100%;
    display: block;
    /*border-left: 1px solid #dcdfe6;*/
    /*border-top: 1px solid #dcdfe6;*/
    line-height: 45px;
  }
  .table-cell {
    height: 48px;
    color: #909399;
    text-align: center;
    border-bottom: 1px solid #ebeef5;

    span {
      /*width: 80px;*/

      i {
        margin-right: 8px;
        color: #409EFF;

        &:hover {
          cursor: pointer;
        }
      }
    }

    span:nth-child(1) {
      /*width: 270px;*/
    }

    span:last-child {
      /*width: 88px;*/
      border-right: 1px solid #dcdfe6;
    }

    .name {
      text-align: left;
    }
  }

  .table-header {
    font-weight: bolder;
  }

  .table-cell {
    color: #606266;

    .el-icon-more {
      transform: rotate(90deg);
      font-size: 24px;
    }
  }

  .table-group {
    .table-children {
      display: none;
    }

    .table-cell .name .el-icon-custom {
      &:before {
        content: "\E601";
      }
    }

    &.expand {
      &> .table-children {
        display: block;
      }

      &> .table-cell .name .el-icon-custom {
        &:before {
          content: "\E635";
        }
      }
    }
  }
</style>
