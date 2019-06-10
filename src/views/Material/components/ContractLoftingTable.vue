<template>
  <div class="contractLoftingTable">
  <!-- 第二次优化 自适应内容宽度，边框问题解决；拖拽阴影，以及编辑问题 必备属性：children，id， pid，show -->
    <div class="table-left">
      <!-- title -->
      <div class="table-title table-header flex-sb">
        <section class="table-cell flex-sb">
          <span style="width: 20px;"></span>
          <span style="width: 40px;">序号</span>
          <span style="width: 100px">名称</span>
          <span>单位</span>
        </section>
      </div>
      <!-- Object -->
      <div v-for="(item,index) in list" :key="index">
        <!-- editObject -->
        <div class="table-group expand" v-if="item.edit">
          <section class="table-cell flex-sb">
            <span style="width: 0px;"></span>
            <span style="width: 0px;"></span>
            <span class="table-edit-span"><el-input v-model="item.name" placeholder="名称" class="table-input-name"></el-input></span>
            <span><el-input v-model="item.unit" placeholder="单位"  class="table-input-unit"></el-input></span>
          </section>
        </div>
        <!-- usuallyObject -->
        <div class="table-group expand" v-else>
          <section class="table-cell flex-sb">
            <!--<span class="icon" v-if="item.children && item.children.length > 0">-->
            <span style="width:20px;" class="iconStyle">
              <i class="el-icon-circle-plus" v-if="!item.show" @click="handleShow(item)"></i>
              <i class="el-icon-remove" v-if="item.show" @click="handleShow(item)"></i>
            </span>
            <span style="width: 40px;color: #1359A1;">{{ item.remark }}</span>
            <span style="width: 100px;">{{ item.name }}</span>
            <span >{{ item.unit }}</span>
          </section>
        </div>
        <div v-if="item.show && item.children && item.children.length" v-for="(itemChildren, indexChildren) in item.children" :key="indexChildren">
          <!-- editObjectChildren -->
          <div  class="table-group expand" v-if="itemChildren.edit">
            <section class="table-cell flex-sb">
              <span style="width:10px;"></span>
              <span style="width:0px;"></span>
              <span class="table-edit-span"><el-input v-model="itemChildren.name" placeholder="名称" class="table-input-name"></el-input></span>
              <span class="table-edit-span"><el-input v-model="itemChildren.unit" placeholder="单位" class="table-input-unit"></el-input></span>
            </section>
          </div>
          <!-- usuallyObjectChildren -->
          <div class="table-group expand" v-else>
            <section class="table-cell flex-sb">
              <span style="width: 20px;padding-left: 10px;" class="iconStyle">
                <i class="el-icon-circle-plus" v-if="!itemChildren.show" @click="handleShowChildren(itemChildren)"></i>
                <i class="el-icon-remove" v-if="itemChildren.show" @click="handleShowChildren(itemChildren)"></i>
              </span>
              <span class="icon" style="width:30px">
                {{ itemChildren.remark }}
              </span>
              <span>{{ itemChildren.name }}</span>
              <span>{{ itemChildren.unit }}</span>
            </section>
          </div>
          <!--objectGrandSon-->
          <div v-if="itemChildren.show" v-for="(itemGrandson, indexGrandson) in itemChildren.children" :key="indexGrandson">
            <div class="table-group expand" v-if="itemGrandson.edit">
              <section class="table-cell flex-sb">
                <span style="width:20px;"></span>
                <span style="width:0px;"></span>
                <span class="table-edit-span"><el-input v-model="itemGrandson.name" placeholder="名称" class="table-input-name"></el-input></span>
                <span class="table-edit-span"><el-input v-model="itemGrandson.unit" placeholder="单位" class="table-input-unit"></el-input></span>
              </section>
            </div>
            <div v-else>
              <section class="table-cell flex-sb">
                <span style="width: 10px;padding-left: 20px;" class="iconStyle">
                  <i class="el-icon-circle-plus" v-if="!itemGrandson.show" @click="handleShowGrandson(itemGrandson)"></i>
                  <i class="el-icon-remove" v-if="itemGrandson.show" @click="handleShowGrandson(itemGrandson)"></i>
                </span>
                <span class="icon" style="width: 40px;">
                  {{ itemGrandson.remark }}
                </span>
                <span>{{ itemGrandson.name }}</span>
                <span>{{ itemGrandson.unit }}</span>
              </section>
            </div>
            <!--objectGreatGrandSon-->
            <div v-if="itemGrandson.show" v-for="(itemGreatGrandson, indexGreatGrandson) in itemGrandson.children" :key="indexGreatGrandson">
              <div class="table-group expand" v-if="itemGreatGrandson.edit">
                <section class="table-cell flex-sb">
                  <span style="width: 30px;"></span>
                  <span style="width: 0px;"></span>
                  <span  class="table-edit-span"><el-input v-model="itemGreatGrandson.name" placeholder="名称" class="table-input-name"></el-input></span>
                  <span  class="table-edit-span"><el-input v-model="itemGreatGrandson.unit" placeholder="单位" class="table-input-unit"></el-input></span>
                </section>
              </div>
              <div v-else>
                <section class="table-cell flex-sb">
                  <span style="width: 20px;"></span>
                  <span style="width: 40px;"></span>
                  <span style="width: 100px;">{{ itemGreatGrandson.name }}</span>
                  <span>{{ itemGreatGrandson.unit }}</span>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="table-center" id="dragscroll">
      <!--<el-form ref="form" :model="list">-->
      <!-- div for overflow -->
      <div
        class="table-center-overflow"
        :style="`width:${120*title.length}px`"
        @mousedown="handleOnmousedown"
        @mousemove="handleOnmousemove"
        @mouseleave="handleOnmouseoutorup"
        @mouseup="handleOnmouseoutorup"
        unselectable="on"
        onselectstart="return false;">
        <!--centerTitle-->
        <div class="table-title table-header flex-sb">
          <section class="table-cell flex-sb">
            <span v-for="(item, index) in title" :key="index">
              {{ item.partName }}
            </span>
          </section>
        </div>
        <!-- centerObject -->
        <div v-for="(item,index) in list" :key="index">
          <div class="table-group expand" v-if="item.edit">
            <section class="table-cell flex-sb">
              <span v-for="(titleItem,titleIndex) in item.titleList" :key="titleIndex" class="table-edit-span">
                <!--<el-form-item>-->
                  <el-input
                    :label="titleItem.partName"
                    v-model="titleItem.value"
                    :placeholder="titleItem.partName"
                    type="number"
                    class="table-input" />
                <!--</el-form-item>-->
              </span>
            </section>
          </div>
          <div class="table-group expand" v-else>
            <section class="table-cell flex-sb">
              <span v-for="(titleItem,titleIndex) in item.titleList" :key="titleIndex">
                {{ titleItem.value }}
              </span>
            </section>
          </div>
          <div v-if="item.show" v-for="(itemChildren, itemChildrenIndex) in item.children" :key="itemChildrenIndex">
            <div v-if="itemChildren.edit" class="table-group expand">
              <section class="table-cell flex-sb">
                <span v-for="(itemChildrenTitleItem,itemChildrenTitleIndex) in itemChildren.titleList" :key="itemChildrenTitleIndex" class="table-edit-span">
                  <el-input
                    :label="itemChildrenTitleItem.partName"
                    v-model="itemChildrenTitleItem.value"
                    :placeholder="itemChildrenTitleItem.partName"
                    type="number"
                    class="table-input"/>
                </span>
              </section>
            </div>
            <div v-else class="table-group expand">
              <section class="table-cell flex-sb">
                <span v-for="(itemChildrenTitleItem,itemChildrenTitleIndex) in itemChildren.titleList" :key="itemChildrenTitleIndex">
                   {{ itemChildrenTitleItem.value }}
                </span>
              </section>
            </div>
            <!-- grandson -->
            <div v-if="itemChildren.show" v-for="(itemGrandson, itemGrandsonIndex) in itemChildren.children" :key="itemGrandsonIndex">
              <div v-if="itemGrandson.edit" class="table-group expand">
                <section class="table-cell flex-sb">
                  <span v-for="(itemGrandsonTitleItem,itemGrandsonTitleIndex) in itemGrandson.titleList" :key="itemGrandsonTitleIndex" class="table-edit-span">
                    <el-input
                      :label="itemGrandsonTitleItem.partName"
                      v-model="itemGrandsonTitleItem.value"
                      :placeholder = "itemGrandsonTitleItem.partName"
                      type="number"
                      class="table-input"/>
                  </span>
                </section>
              </div>
              <div v-else class="table-group expand">
                <section class="table-cell flex-sb">
                  <span v-for="(itemGrandsonTitleItem,itemGrandsonTitleIndex) in itemGrandson.titleList" :key="itemGrandsonTitleIndex">
                     {{ itemGrandsonTitleItem.value }}
                  </span>
                </section>
              </div>
              <div v-if="itemGrandson.show" v-for="(itemGreatGrandson, itemGreatGrandsonIndex) in itemGrandson.children" :key="itemGreatGrandsonIndex">
                <div v-if="itemGreatGrandson.edit" class="table-group expand">
                    <section class="table-cell flex-sb">
                    <span v-for="(itemGreatGrandsonTitleItem,itemGreatGrandsonTitleIndex) in itemGreatGrandson.titleList" :key="itemGreatGrandsonTitleIndex" class="table-edit-span">
                        <el-input
                          :label="itemGreatGrandsonTitleItem.partName"
                          v-model="itemGreatGrandsonTitleItem.value"
                          :placeholder = "itemGreatGrandsonTitleItem.partName"
                          type="number"
                          class="table-input"/>
                    </span>
                    </section>
                  </div>
                  <div v-else class="table-group expand">
                    <section class="table-cell flex-sb">
                      <span v-for="(itemGreatGrandsonTitleItem,itemGreatGrandsonTitleIndex) in itemGreatGrandson.titleList" :key="itemGreatGrandsonTitleIndex">
                         {{ itemGreatGrandsonTitleItem.value }}
                      </span>
                    </section>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <!--</el-form>-->
    </div>
    <div class="table-right">
      <div class="table-title table-header flex-sb">
        <section class="table-cell flex-sb">
          <span style="width:110px;">合计</span>
          <span style="width:80px;">限额系数</span>
          <span style="width:80px;">限额量</span>
          <span style="width: 50px;">
            <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="handleParentInsert()">插入子集栏目</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="handleColUpdate()">列管理</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
          </span>
        </section>
      </div>
      <div v-for="(item,index) in list" :key="index">
        <div class="table-group expand" v-if="item.edit">
          <section class="table-cell flex-sb">
            <span style="width:130px">
               <el-tooltip class="item" effect="dark" :content="`合计:${item.sum === null ? '':item.sum}`" placement="top-start">
                 <el-input v-model="item.sum" placeholder="合计" type="number" style="width: 120px;font-size: 12px;" ></el-input>
               </el-tooltip>
            </span>
            <span class="table-edit-span">
              <el-input v-model="item.limitCoefficient" placeholder="限额系数" class="table-input-limit" type="number"/>
            </span>
            <span class="table-edit-span">
              <el-input v-model="item.limitNum" placeholder="限额量" class="table-input-limit" type="number"/>
            </span>
            <span class="icon" style="width:50px;">
              <i class="el-icon-check hover-cursor" @click="handleSave(item)"></i>
              <i class="el-icon-close hover-cursor" @click="handleRemoveEdit(item)"></i>
            </span>
          </section>
        </div>
        <div class="table-group expand" v-else>
          <section class="table-cell flex-sb">
            <span style="width:110px;">{{ item.sum }}</span>
            <span style="width:80px;">{{ item.limitCoefficient }}</span>
            <span style="width:80px;">{{ item.limitNum }}</span>
            <span v-if="!disableEdit" style="width: 50px;">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="handleInsert(item)">插入子集栏目</div>
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
        <div v-if="item.show" v-for="(itemChildren,indexChildren) in item.children" :key="indexChildren">
          <div class="table-group expand" v-if="itemChildren.edit">
            <section class="table-cell flex-sb">
              <span style="width:130px">
                <el-tooltip class="item" effect="dark" :content="`合计:${itemChildren.sum === null ? '' : itemChildren.sum}`" placement="top-start">
                  <el-input v-model="itemChildren.sum" placeholder="合计" type="number" style="width: 120px;font-size: 12px;"/>
                </el-tooltip>
              </span>
              <span class="table-edit-span">
                <el-input v-model="itemChildren.limitCoefficient" placeholder="限额系数" class="table-input-limit" type="number"/>
              </span>
              <span class="table-edit-span">
                <el-input v-model="itemChildren.limitNum" placeholder="限额量" class="table-input-limit" type="number"/>
              </span>
              <span class="icon" style="width: 50px;">
                <i class="el-icon-check hover-cursor" @click="handleChildrenSave(itemChildren)"></i>
                <i class="el-icon-close hover-cursor" @click="handleRemoveChildrenEdit(itemChildren)"></i>
              </span>
            </section>
          </div>
          <div class="table-group expand" v-else>
            <section class="table-cell flex-sb">
              <span style="width: 110px;">{{ itemChildren.sum }}</span>
              <span style="width: 80px;">{{ itemChildren.limitCoefficient }}</span>
              <span style="width: 80px;">{{ itemChildren.limitNum }}</span>
              <span v-if="!disableEdit" style="width: 50px;">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <div @click="handleChildrenInsert(itemChildren)">插入子集栏目</div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div @click="handleChildrenUpdate(itemChildren)">编辑</div>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <div @click="handleChildrenDelete(itemChildren)">删除</div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </section>
          </div>
          <div v-if="itemChildren.show" v-for="(itemGrandson, indexGrandson) in itemChildren.children" :key="indexGrandson">
            <div class="table-group expand" v-if="itemGrandson.edit">
              <section class="table-cell flex-sb">
                <span style="width:130px">
                  <el-tooltip class="item" effect="dark" :content="`合计:${itemGrandson.sum === null ? '':itemGrandson.sum}`" placement="top-start">
                    <el-input v-model="itemGrandson.sum" placeholder="合计" type="number" style="width: 120px;font-size: 12px;"/>
                  </el-tooltip>
                </span>
                <span class="table-edit-span">
                  <el-input v-model="itemGrandson.limitCoefficient" placeholder="限额系数" class="table-input-limit" type="number"/>
                </span>
                <span class="table-edit-span">
                  <el-input v-model="itemGrandson.limitNum" placeholder="限额量" class="table-input-limit" type="number"/>
                </span>
                <span class="icon" style="width: 50px;">
                  <i class="el-icon-check hover-cursor" @click="handleGrandsonSave(itemGrandson)"></i>
                  <i class="el-icon-close hover-cursor" @click="handleRemoveGrandsonEdit(itemGrandson)"></i>
                </span>
              </section>
            </div>
            <div class="table-group expand" v-else>
              <section class="table-cell flex-sb">
                <span style="width:110px">{{ itemGrandson.sum }}</span>
                <span style="width:70px">{{ itemGrandson.limitCoefficient }}</span>
                <span style="width:70px">{{ itemGrandson.limitNum }}</span>
                <span v-if="!disableEdit" style="width: 50px;">
                  <el-dropdown>
                    <span class="el-dropdown-link">
                      <i class="el-icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                      <div @click="handleGrandsonInsert(itemGrandson)">插入子集栏目</div>
                    </el-dropdown-item>
                      <el-dropdown-item>
                        <div @click="handleGrandsonUpdate(itemGrandson)">编辑</div>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <div @click="handleGrandsonDelete(itemGrandson)">删除</div>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
              </section>
            </div>
            <div v-if="itemGrandson.show" v-for="(itemGreatGrandson, indexGreatGrandson) in itemGrandson.children" :key="indexGreatGrandson">
              <div class="table-group expand" v-if="itemGreatGrandson.edit">
                <section class="table-cell flex-sb">
                  <span style="width:130px">
                    <el-tooltip class="item" effect="dark" :content="`合计:${itemGreatGrandson.sum === null ? '': itemGreatGrandson.sum}`" placement="top-start">
                      <el-input v-model="itemGreatGrandson.sum" placeholder="合计" type="number" style="width: 120px;font-size: 12px;"/>
                    </el-tooltip>
                  </span>
                  <span class="table-edit-span">
                    <el-input v-model="itemGreatGrandson.limitCoefficient" placeholder="限额系数" class="table-input-limit" type="number"/>
                  </span>
                  <span class="table-edit-span">
                    <el-input v-model="itemGreatGrandson.limitNum" placeholder="限额量" class="table-input-limit" type="number"/>
                  </span>
                  <span class="icon" style="width:50px;">
                    <i class="el-icon-check hover-cursor" @click="handleGreatGrandsonSave(itemGreatGrandson)"></i>
                    <i class="el-icon-close hover-cursor" @click="handleRemoveGreatGrandsonEdit(itemGreatGrandson)"></i>
                  </span>
                </section>
              </div>
              <div class="table-group expand" v-else>
                <section class="table-cell flex-sb">
                  <span style="width:110px">{{ itemGreatGrandson.sum }}</span>
                  <span style="width:70px">{{ itemGreatGrandson.limitCoefficient }}</span>
                  <span style="width:70px">{{ itemGreatGrandson.limitNum }}</span>
                  <span v-if="!disableEdit" style="width:50px">
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <i class="el-icon-more"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <div @click="handleGreatGrandsonUpdate(itemGreatGrandson)">编辑</div>
                        </el-dropdown-item>
                        <el-dropdown-item>
                          <div @click="handleGreatGrandsonDelete(itemGreatGrandson)">删除</div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </span>
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
// import $ from 'jquery';

export default {
  name: 'ContractLoftingTable',
  props: {
    title: {
      type: Array,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      mouseMsg: null,
      divMsg: null,
    };
  },
  mounted() {
  },
  methods: {
    handleParentInsert() {
      this.$emit('parentInsert');
    },
    handleInsert(param) {
      this.$emit('insert', param);
    },
    handleChildrenInsert(param) {
      this.$emit('childrenInsert', param);
    },
    handleGrandsonInsert(param) {
      this.$emit('grandsonInsert', param);
    },
    handleDelete(param) {
      this.$emit('remove', param);
    },
    handleChildrenDelete(param) {
      this.$emit('childrenRemove', param);
    },
    handleGrandsonDelete(param) {
      this.$emit('grandsonRemove', param);
    },
    handleGreatGrandsonDelete(param) {
      this.$emit('greatGrandsonRemove', param);
    },
    handleShow(param) {
      this.$emit('show', param);
    },
    handleShowChildren(param) {
      this.$emit('childrenShow', param);
    },
    handleShowGrandson(param) {
      this.$emit('grandsonShow', param);
    },
    handleRemoveEdit(param) {
      this.$emit('clear', param);
    },
    handleRemoveChildrenEdit(param) {
      this.$emit('childrenClear', param);
    },
    handleRemoveGrandsonEdit(param) {
      this.$emit('grandsonClear', param);
    },
    handleRemoveGreatGrandsonEdit(param) {
      this.$emit('greatGrandsonClear', param);
    },
    handleUpdate(param) {
      this.$emit('edit', param);
    },
    handleChildrenUpdate(param) {
      this.$emit('childrenEdit', param);
    },
    handleGrandsonUpdate(param) {
      this.$emit('grandsonEdit', param);
    },
    handleGreatGrandsonUpdate(param) {
      this.$emit('greatGrandsonEdit', param);
    },
    handleColUpdate() {
      this.$emit('colUpdate');
    },
    handleSave(param) {
      this.$emit('save', param);
    },
    handleChildrenSave(param) {
      this.$emit('childrenSave', param);
    },
    handleGrandsonSave(param) {
      this.$emit('grandsonSave', param);
    },
    handleGreatGrandsonSave(param) {
      this.$emit('greatGrandsonSave', param);
    },
    handleOnmousedown(e) {
      this.mouseMsg = e.layerX;
      this.divMsg = document.getElementById('dragscroll');
    },
    handleOnmousemove(e) {
      if (this.mouseMsg !== null) {
        this.divMsg.scrollLeft += e.layerX - this.mouseMsg;
        this.mouseMsg = e.layerX;
      }
    },
    handleOnmouseoutorup() {
      this.mouseMsg = null;
      this.divMsg = null;
    },
  },
};
</script>

<style lang="scss" scoped>
  .contractLoftingTable{
    width: 920px;
    padding-top: 20px;
    .iconStyle{
      i {
        font-size: 14px;
      }
    }

    .table-input{
      font-size: 12px;
      width: 110px;
    }
    .table-input-name{
      font-size: 12px;
      width: 80px;
    }
    .table-input-unit{
      font-size: 12px;
      width: 60px;
    }
    .table-input-limit{
      font-size: 12px;
      width: 60px;
    }
    .table-edit-span{
      font-size: 12px;
      width: 70px;
    }
    .table-edit-span-sum{
      font-size: 12px;
      width: 130px;
    }
    .table-input-limit-sum{
      font-size: 12px;
      width: 110px;
    }
    .table-left{
      width: 220px;
      float: left;
    }
    .table-center{
      width: 380px;
      float: left;
      overflow-x: auto;

      .table-center-overflow {
        span{
          width: 120px;
        }
      }
    }
    .table-right{
      width: 320px;
      float: left;
    }
    .table-header {
      color: #909399;
      font-weight: bold;
    }
    .icon{
      font-size: 12px;
      width: 20px;
    }
    .table-title{
      span{
        font-size: 13px;
      }
    }
    .table-cell {
      height: 48px;
      color: #909399;
      text-align: center;
      border-bottom: 1px solid #ebeef5;
      font-size: 12px;
      span {
        width: 60px;
        i {
          margin-right: 8px;
          color: #409EFF;

          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
