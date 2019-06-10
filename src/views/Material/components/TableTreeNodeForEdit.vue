<template>
  <div class="table-group expand">
    <section class="table-cell flex-sb" v-if = "node.edit">
      <span><el-input v-model="node.name" placeholder="请输入材料名称" style="width: 150px"></el-input></span>
      <span><el-input v-model="node.model" placeholder="型号规格" style="width: 78px"></el-input></span>
      <span><el-input v-model="node.standard" placeholder="质量标准" style="width: 78px"></el-input></span>
      <span><el-input v-model="node.unit" placeholder="单位" style="width: 58px"></el-input></span>
      <span><el-input type="number" v-model="node.num" placeholder="数量" style="width: 58px"></el-input></span>
      <span>
        <el-date-picker
          v-model="node.getTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="日期"
          style="width: 78px"
        >
        </el-date-picker>
      </span>
      <span><el-input v-model="node.outPlace" placeholder="卸货地点" style="width: 78px"></el-input></span>
      <span><el-input v-model="node.usePlace" placeholder="用料地点" style="width: 78px"></el-input></span>
      <span style="font-size: 18px">
        <i class="el-icon-check hover-cursor" @click="handleSaveEdit(node)"></i>
        <i class="el-icon-close hover-cursor" @click="handleRemoveEdit(node)"></i>
      </span>
    </section>
    <section class="table-cell flex-sb" v-else>
      <span class="name" :style="`padding-left: ${level * 24}px`">
        <i v-if="node.children && node.children.length > 0" class="el-icon-custom" @click="toggleExpand($event)"></i>
        <span>{{ node.name }}</span>
      </span>
        <span>{{ node.model }}</span>
        <span>{{ node.standard }}</span>
        <span>{{ node.unit }}</span>
        <span>{{ node.num }}</span>
        <span>{{ node.getTime }}</span>
        <span>{{ node.outPlace }}</span>
        <span>{{ node.usePlace }}</span>
        <span v-if="!disableEdit">
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="level < 2">
              <div @click="handleInsert(node)">插入子集栏目</div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="handleUpdate(node)">编辑</div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="handleDelete(node.id)">删除</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </section>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TableTreeNodeForEdit',
  props: {
    node: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {

    };
  },
  methods: {
    toggleExpand(e) {
      const dom = e.target;
      /*
        1、父组件可以使用 props 把数据传给子组件。
        2、子组件可以使用 $emit 触发父组件的自定义事件。
        vm.$emit( event, arg ) //触发当前实例上的事件
        vm.$on( event, fn ); //监听event事件后运行 fn；
       */
      const $tableGroup = dom.closest('.table-group');
      $tableGroup.classList.toggle('expand');
    },
    handleInsert(param) {
      this.$emit('insert', param);
    },
    handleUpdate(param) {
      this.$emit('update', param);
    },
    handleDelete(id) {
      this.$emit('delete', id);
    },
    handleSaveEdit(param) {
      this.$emit('save', param);
    },
    handleRemoveEdit() {
      this.$emit('clear');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .table-cell {
    height: 48px;
    color: #909399;
    text-align: center;
    border-bottom: 1px solid #ebeef5;

    span {
      width: 80px;

      i {
        margin-right: 8px;
        color: #409EFF;

        &:hover {
          cursor: pointer;
        }
      }
    }

    span:nth-child(1) {
      width: 270px;
    }

    span:last-child {
      width: 88px;
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
