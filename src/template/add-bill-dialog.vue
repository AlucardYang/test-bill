/**
 * import AddDialog from '@/template/add-spend-dialog.vue';
 */
<template>
	<el-dialog title="添加账单" :visible.sync="dialogVisible" width="90%" :before-close="close">
		<form class="add-form">
			<el-row :gutter="3" class="add-spend-row">
				<el-col :span="6">
					<div class="grid-content bg-purple-light">消费项</div>
				</el-col>
				<el-col :span="18">
					<el-input v-model="spend.name" placeholder="请输入消费项"></el-input>
				</el-col>
			</el-row>
			<el-row :gutter="3" class="add-spend-row">
				<el-col :span="6">
					<div class="grid-content bg-purple-light">消费金额</div>
				</el-col>
				<el-col :span="18">
					<el-input v-model="spend.price" placeholder="请输入消费金额"></el-input>
				</el-col>
			</el-row>
			<el-row :gutter="3" class="add-spend-row">
				<el-col :span="6">
					<div class="grid-content bg-purple-light">消费分类</div>
				</el-col>
				<el-col :span="18">
					<el-select v-model="spend.sort" placeholder="请选择消费分类" style="width: 100%;">
						<el-option v-for="item in sorts" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-col>
			</el-row>
			<el-row :gutter="3" class="add-spend-row">
				<el-col :span="6">
					<div class="grid-content bg-purple-light">消费日期</div>
				</el-col>
				<el-col :span="18">
					<el-date-picker v-model="spend.date" type="datetime" placeholder="选择日期时间">
					</el-date-picker>
				</el-col>
			</el-row>
		</form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="close">取 消</el-button>
			<el-button type="primary" @click="addSpend">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import Vue from 'vue';
import { Dialog, Button, Row, Col, Input, Select, Option, DatePicker } from 'element-ui';

Vue.component(Dialog.name, Dialog);
Vue.component(Button.name, Button);
Vue.component(Row.name, Row);
Vue.component(Col.name, Col);
Vue.component(Input.name, Input);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(DatePicker.name, DatePicker);

export default {
	name: "AddDialog",
	props: {
		date: {
			type: null,
			default: function() {
				return new Date();
			}
		},
	},
	data() {
		return {
			dialogVisible: false,
			spend: {
				name: '',
				price: '',
				date: new Date()
			},
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
	components: {},
	created() {},
	watch: {
		date: {
			handler: function(value, oldvalue) {

			}
		},
	},
	mounted() {},
	methods: {
		/**
		 * 打开弹窗
		 */
		open() {
			this.dialogVisible = true;
		},
		/**
		 * 关闭弹窗
		 */
		close() {
			this.dialogVisible = false;
		},
		/**
		 * 新建新人
		 */
		addSpend() {
			if (!this.spend.name) {
				$toast('请输入消费项');
				return;
			}
			if (!this.spend.sort) {
				$toast('请选择消费分类');
				return;
			}
			if (!this.spend.price) {
				this.spend.price = 0;
			}
			if (/[^0-9.]/g.test(this.spend.price)) {
				$toast('请输入正确的消费金额');
				return;
			}
			let spend = this.spend;
			spend.date = new Date(spend.date).getTime();
			console.log(this.spend);
			$http({
				path: '/spend/add',
				method: 'post',
				data: spend,
			}).then(res => {
				if (res.code === 0) {
					// this.persons = res.data;
					console.log(res);
					$toast('添加成功!');
					this.$emit('updateList');
					this.close();
					this.spend.name = '';
					this.spend.price = '';
				}
			});
		},
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-row {
	margin-bottom: .2rem;
}

.add-spend-row {
	margin-bottom: .2rem !important;
}
</style>

<style>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
	width: 100% !important;
}

.el-input--suffix .el-input__inner {
	padding-right: 10px !important;
}
</style>
