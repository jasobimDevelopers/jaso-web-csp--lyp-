<template>
  <div class="TestModel">
    <header class="admin-header flex-sb">
      <div class="title">测试页面</div>
      <div> <el-button onclick="handleMove">点击排序</el-button></div>
    </header>
    <ul id="demo1">
      <li>item 1</li>
      <li>item 2</li>
      <li>item 3</li>
    </ul>
    <div class="list-wrapper" id="demo">
      <div
        class="item"
        v-for="item in list"
        :key="item.id"
      >
        <!--<img src="@/assets/images/project-bg.png" />-->
        <div class="name">{{ item.name }}</div>
        <div class="user-info">负责人：{{ item.leader }}</div>
      </div>
      <div class="item add-item hover-cursor">
        <i class="el-icon-plus" style="font-size: 24px"></i>
        <div class="action-name">创建新项目</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TestModel',
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getList();
    this.handleMove();
  },
  methods: {
    getList() {
      for (let key = 0; key < 10; key += 1) {
        const temp = {
          id: key,
          name: `User${key}`,
          leader: `经理${key}`,
        };
        this.list.push(temp);
      }
    },
    handleMove() {
      this.$nextTick(function () {
        const tbody = document.getElementById('demo');
        this.$Sortable.create(tbody, {
          animation: 180,
          delay: 0,
        });
      });
    },
    // rowDrop() {
    //   const msg = this;
    //   this.$Sortable.create(tbody, {
    //     onEnd({ newIndex, oldIndex }) {
    //       const currRow = msg.tableData.splice(oldIndex, 1)[0];
    //       msg.tableData.splice(newIndex, 0, currRow);
    //     },
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped>
  .list-wrapper {
    .item {
      position: relative;
      margin-right: 20px;
      margin-bottom: 20px;
      width: 280px;
      height: 180px;
      color: #ffffff;
      background-color: #EBEEF5;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .name {
        position: absolute;
        left: 28px;
        bottom: 42px;
      }

      .user-info {
        position: absolute;
        left: 28px;
        bottom: 20px;
        font-size: 14px;
      }
    }

    .add-item {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      color: #409EFF;

      .action-name {
        margin-top: 15px;
      }
    }
  }
</style>
