<template>
  <div>
    <div v-if="editKey === -1">
      <header class="admin-header flex-sb">
        <div class="title">项目管理</div>
      </header>
      <el-table
        :data="moduleList"
        :show-header="false"
        style="width: 100%">
        <el-table-column prop="moduleName"></el-table-column>
        <el-table-column fixed="right">
          <template slot-scope="scope">
            <el-button
              @click="editClick(scope.row)"
              type="text" size="small"
              style="float: right;margin-right: 10px"
            >编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="editKey === 0">
      <!-- 质量管理 -->
      <QualityInfrastructure :item-title="itemTitle" @returnToUpperLevel="returnToUpperLevel"/>
    </div>
    <div v-if="editKey === 1">
      <!-- 安全管理 -->
      <SecurityInfrastructure :item-title="itemTitle" @returnToUpperLevel="returnToUpperLevel"/>
    </div>
    <div v-if="editKey === 2">
      <!-- 实测实量 -->
      <MeasuredRealQuantity :item-title="itemTitle" @returnToUpperLevel="returnToUpperLevel"/>
    </div>
  </div>
</template>

<script>
import QualityInfrastructure from './QualityInfrastructure';
import SecurityInfrastructure from './SecurityInfrastructure';
import MeasuredRealQuantity from './MeasuredRealQuantity';

export default {
  // 检查项管理
  name: 'CheckItemManagement',
  components: {
    QualityInfrastructure,
    SecurityInfrastructure,
    MeasuredRealQuantity,
  },
  data() {
    return {
      editKey: -1,
      itemTitle: '',
      moduleList: [{
        key: 0,
        moduleName: '质量管理',
      }, {
        key: 1,
        moduleName: '安全管理',
      }, {
        key: 2,
        moduleName: '实测实量',
      }],
    };
  },
  methods: {
    editClick(item) {
      this.editKey = item.key;
      this.itemTitle = item.moduleName;
    },
    returnToUpperLevel() {
      this.editKey = -1;
    },
  },
};
</script>

