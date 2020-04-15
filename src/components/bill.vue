<template>
  <div class="spend-content">
    <!-- 一个新人弹窗 -->
    <add-spend-dialog ref="addSpendDialog" @updateList="updateSpnedList"></add-spend-dialog>
    <!-- 列表 -->
    <div class="com-scroll-y">
      <el-row :gutter="0" style="margin-bottom: .05rem; padding: 0 .05rem;">
        <el-col :span="7">
          <div class="select-block">
            <el-select v-model="nowYear" placeholder="请选择年份" @change="yearChange()">
              <el-option v-for="item in years" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <span>年</span>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="select-block">
            <el-select v-model="nowMonth" placeholder="请选择月份" @change="updateSpnedList">
              <el-option v-for="item in months" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <span>月</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="select-block" style="padding-left: .1rem;">
            <el-select v-model="nowSort" multiple placeholder="请选择分类" @change="updateSpnedList">
              <el-option v-for="item in sorts" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="select-block" style="justify-content: flex-end;pdding-right: 0;">
            <el-button @click="openAddDilog()">添加</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row v-for="(hundredItem, hundredIndex) in hundredList" :key="'hundredIndex' + hundredIndex">
        <el-col :span="12">
          <div class="hundred-name">{{hundredItem.name}}</div>
        </el-col>
        <el-col :span="12">
          <div class="hundred-price">-{{hundredItem.price | formatMoney(2, '')}}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="spend-total">{{nowYear}}年{{nowMonth}}月总支出：{{monthTotal | formatMoney(2, '¥')}}</div>
        </el-col>
      </el-row>
      <el-row :gutter="0" v-for="(item0, index0) in spendList" :key="index0">
        <el-row :gutter="0">
          <el-col class="day-block" :span="12">{{item0.day}}日</el-col>
          <el-col class="day-block total" :span="12">支出：{{item0.total | formatMoney(2, '¥')}}</el-col>
        </el-row>
        <el-row :gutter="0" v-for="(item1, index1) in item0.bill" :key="index1">
          <el-col :span="15">
            <div class="col-block" @touchstart="touchStartFn(item1)" @touchend="touchEndFn(item1)">
              <span>{{item1.name}}</span>
              <span class="time">{{item1.date | formatDate('hh:mm')}}&nbsp;&nbsp;{{sortMap[item1.sort]}}</span>
            </div>
          </el-col>
          <el-col :span="9">
            <div class="col-block money">
              <span v-if="!item1.showInput">-</span>
              <i v-else class="el-icon-check confirm-icon" @click="confirmPriceFn(item1)"></i>
              <span v-if="!item1.showInput" @click="showInputFn(item1)">{{item1.price | formatMoney(2, '')}}</span>
              <input v-else type="text" class="el-input__inner" v-model="item1.price">
            </div>
          </el-col>
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script>
import "@/common/directive/format-date.js";
import "@/common/directive/format-money.js";

import AddSpendDialog from '@/template/add-bill-dialog.vue';

import Vue from 'vue';
import { Button, Row, Col, Select, Option, MessageBox } from 'element-ui';

Vue.component(Button.name, Button);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);

export default {
  name: "Home",
  data() {
    return {
      nowYear: new Date().getFullYear(),
      nowMonth: new Date().getMonth() + 1,
      years: [2020],
      months: [1],
      monthTotal: 0,
      spendList: [],
      hundredList: [],
      sortMap: {
        1: '生活日用',
        2: '衣服',
        3: '餐饮美食',
        4: '通讯物流',
        5: '转账充值',
        9: '其他',
      },
      nowSort: [],
      sorts: [{
        label: '生活日用',
        value: 1
      }, {
        label: '衣服',
        value: 2
      }, {
        label: '餐饮美食',
        value: 3
      }, {
        label: '通讯物流',
        value: 4
      }, {
        label: '转账充值',
        value: 5
      }, {
        label: '其他',
        value: 9
      }]
    };
  },
  components: {
    AddSpendDialog
  },
  created() {
    for (let i = 1; i <= 20; i++) {
      this.years.push(this.nowYear - i);
    }
    this.yearChange();
  },
  mounted() {
  },
  methods: {
    /**
     * 打开新建账单弹窗
     */
    openAddDilog() {
      this.$refs.addSpendDialog.open();
    },
    /**
     * 显示更改input
     */
    showInputFn(item) {
      item.showInput = true;
      this.$forceUpdate();
    },
    /**
     * 长按开始
     */
    touchStartFn(item) {
      item.startTime = new Date().getTime();
      item.timer = setTimeout(() => {
        MessageBox.confirm('是否删除消费项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.deleteSpendFn(item);
        }).catch(() => {
          // this.$message({
          // 	type: 'info',
          // 	message: '已取消删除'
          // });
        });
      }, 700);
    },
    /**
     * 长按结束
     */
    touchEndFn(item) {
      item.endTime = new Date().getTime();
      if (item.endTime - item.startTime < 700) {
        clearTimeout(item.timer);
      }
    },
    /**
     * 确认更改价格
     */
    confirmPriceFn(item) {
      $http({
        path: '/spend/update',
        method: 'post',
        data: item,
      }).then(res => {
        if (res.code === 0) {
          $toast('更改成功');
          this.updateSpnedList();
        }
      });
    },
    /**
       * 删除消费项
       */
    deleteSpendFn(item) {
      $http({
        path: '/spend/delete',
        method: 'post',
        data: item,
      }).then(res => {
        if (res.code === 0) {
          this.updateSpnedList();
        }
      });
    },
    /**
     * 获取消费列表
     */
    getSpendList() {
      $pageLoading(this, 1, {
        model: false
      });
      $http({
        path: '/spend/list',
        data: {
          year: this.nowYear,
          month: this.nowMonth,
          sort: this.nowSort.length > 0 ? this.nowSort.join(',') : '',
        },
      }).then(res => {
        if (res.code === 0) {
          this.spendList = res.data.spend;
          this.monthTotal = res.data.total;
        }
      }).finally(res => {
        $pageLoading();
      });
    },
    /**
     * 更新列表
     */
    updateSpnedList() {
      this.getSpendList();
      this.getSpendHunderd();
    },
    /**
     * 获取上百的消费列表
     */
    getSpendHunderd() {
      $pageLoading(this, 1, {
        model: false
      });
      $http({
        path: '/spend/hundred',
        data: {
          year: this.nowYear,
          month: this.nowMonth,
          sort: this.nowSort.length > 0 ? this.nowSort.join(',') : '',
        },
      }).then(res => {
        if (res.code === 0) {
          this.hundredList = res.data;
          $pageLoading();
        }
      });
    },
    /**
     * 选择年份
     */
    yearChange() {
      let maxMonth = 12;
      if (this.nowYear === new Date().getFullYear()) {
        maxMonth = new Date().getMonth() + 1;
        this.nowMonth = new Date().getMonth() + 1;
      } else {
        this.nowMonth = 1;
      }
      this.months = [];
      for (let i = 1; i <= maxMonth; i++) {
        this.months.push(i);
      }
      this.updateSpnedList();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.spend-content {
  width: 100%;
  background-color: #eee;
}

.el-row {
  background-color: #fff;
}

.select-block {
  padding: 0.1rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.spend-total {
  padding: 0.1rem;
  height: 0.56rem;
  line-height: 0.36rem;
  text-align: right;
  font-weight: bold;
  color: lightsteelblue;
  font-size: 0.18rem;
}

.day-block {
  padding: 0.05rem 0.1rem;
  color: darksalmon;
  font-size: 0.18rem;
}

.day-block.total {
  color: darkgray;
  text-align: right;
  font-size: 0.16rem;
  font-weight: bold;
}

.col-block {
  width: 100%;
  min-height: 0.5rem;
  padding: 0.05rem 0.1rem;
  color: #555;
  font-size: 0.16rem;
  display: flex;
  align-items: left;
  justify-content: left;
  flex-direction: column;
}

.col-block .time {
  font-size: 0.14rem;
}

.col-block.money {
  text-align: right;
  font-weight: bold;
  color: #333;
  font-size: 0.2rem;
  flex-direction: row;
  justify-content: flex-end;
}

.hundred-name {
  padding: 0.02rem 0.1rem;
  color: deeppink;
}

.hundred-price {
  padding: 0.02rem 0.1rem;
  text-align: right;
  color: magenta;
}

.confirm-icon {
  position: absolute;
  right: 0.15rem;
  top: 0.1rem;
  font-size: 0.22rem;
  z-index: 12;
}
</style>

<style>
.el-row {
  margin-bottom: 0 !important;
}

* {
  position: initial;
}
</style>