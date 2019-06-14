<template>
  <div class="setting main-container">
    <side-bar class="sidebar-container" :activeTab="activeTab" @onTabChange="handleTabChange"></side-bar>
    <div class="app-main admin-container">
      <department v-if="activeTab === 0"></department>
      <position v-if="activeTab === 1"></position>
      <work-group v-if="activeTab === 2"></work-group>
      <node v-if="activeTab === 3"></node>
      <process v-if="activeTab === 4"></process>
      <bids v-if="activeTab === 5"></bids>
      <check-item-management v-if="activeTab === 6"></check-item-management>
      <testModel v-if="activeTab === 7"></testModel>
    </div>
  </div>
</template>

<script>
import SideBar from './SideBar';
import Department from './Department';
import Position from './Position';
import WorkGroup from './WorkGroup';
import Node from './Node';
import Process from './Process';
import Bids from './Bids';
import TestModel from './TestModel';
import CheckItemManagement from './CheckItemManagement';

export default {
  name: 'Setting',
  data() {
    return {
      activeTab: 0,
    };
  },
  components: {
    CheckItemManagement,
    SideBar,
    Department,
    Position,
    WorkGroup,
    Node,
    Process,
    Bids,
    TestModel,
  },
  methods: {
    handleTabChange(tab) {
      this.activeTab = tab;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .admin-container {
    padding: 15px 29px;

    .admin-header {
      padding-bottom: 15px;
      border-bottom: 1px solid #DCDFE6;
    }

    .title {
      font-weight: bolder;
    }
  }

  // media
  @media (max-width: 1200px) {
    .admin-container {
      padding: 0 8px;
      width: 100%;
    }
  }
</style>
