<!--
 * @Author: your name
 * @Date: 2019-11-16 14:55:09
 * @LastEditTime: 2019-12-02 09:24:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Vote\vote\src\components\HelloWorld.vue
 -->
<template>
	<div class="vote-view">
		<div class="vote-detail">
			<h2>标题：{{ vote.info.title }}</h2>
			<h3>描述：{{ vote.info.desc }}</h3>
			<h4>当前状态：{{isActive ? '可投票' : '已过期'}}</h4>
		</div>
		<ul class="options">
			<li class="vote-item" @click="voteup(option.id)" v-for="option in vote.options" :key="option.id">
				<span>{{ option.content }}</span>
				<span class="item-right">{{summery[option.id].length }}票 {{ratioSummer[option.id] * 100}}%</span>
				<div class="ratio"
					:style="{width: ratioSummer[option.id] * 100 + '%'}"
				></div>
				<transition name="slide-fade">
					<div v-show="showDetail" class="show-avatar">
						<el-avatar shape="circle" :size="32" fit="contain" v-for="msg in avatarGroup[option.id]" :key="msg.userid" :src="getAvatar(msg)"></el-avatar>
					</div>
				</transition>
			</li>
		</ul>
		<div class="show-detail" @click="show">显示详情</div>
	</div>
</template>



<script>
import _ from 'lodash';
import io from 'socket.io-client';
import api from '../api';
import baseURL from '../baseURL';

window.api = api;
export default {
	name: 'VoteView',
	async mounted(){
		this.init();
	},
	data() {
		return {
			vote: {
				info: {},
				options: [],
				voteups: [],
			},
			avatarGroup: [],
			showDetail: false
		}
	},
	watch: {
		// $route(to, from){
		// 	this.init();
		// }
	},
	methods: {
		async init(){
			var id = this.$route.params.id;
			var request = await api.get('/vote/' + id);
			this.vote = request.data;
			this.vote.voteups = _.uniqBy(this.vote.voteups, 'userid');
			this.avatarGroup = _.groupBy(this.vote.voteups, 'optionid');

			this.socket = io(baseURL);
			this.socket.emit('select room', id)
			this.socket.on('new vote', data => {
				this.vote.voteups = this.vote.voteups.filter(it => it.userid != data.userid)
				this.vote.voteups.push(data)
				this.avatarGroup = _.groupBy(this.vote.voteups, 'optionid');
			});
		},
		voteup(optionid){
			if(!this.isActive){
				alert('此投票已过期！')
			}
			api.post('/voteup', {
				optionid,
				voteid: this.vote.info.id,
			});
		},
		getAvatar(msg){
			return baseURL  + msg.avatar;
		},
		show(event){
			if(!this.showDetail){
				this.showDetail = true;
				event.target.innerText = '隐藏详情'
			}else{
				this.showDetail = false;
				event.target.innerText = '显示详情'
			}
		}
	},
	computed: {
		summery(){
			var obj = _.mapValues(_.keyBy(this.vote.options, 'id'), () => []);
			return {
				...obj,
				..._.groupBy(this.vote.voteups, 'optionid'),
			};
		},
		ratioSummer(){
			return _.mapValues(this.summery, (voteups) => {
				if(voteups.length == 0){
					return 0;
				}
				return voteups.length / this.vote.voteups.length;
			})
		},
		isActive(){
			return this.vote.info.deadline > Date.now();
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.vote-view
	margin 20px auto
	width 500px
	border-radius 4px
	border 1px solid #bfcbd9
	background-color rgba(245, 245, 245, 0.8)
.vote-detail
	margin 0px 20px
h2
	text-align center
.options
	list-style none
	padding 0
.options li
	height 30px
	padding 10px 20px
	margin-bottom 35px
.ratio
	transition .5s
	position absolute
	bottom 0
	left 0
	height 3px
	background #409EFF
.vote-item
	background-color #fff
	margin-top 8px
	border-bottom 1px solid #bfcbd9
	box-shadow 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)
	position relative
.item-right
	position absolute
	top 18px
	left 395px
.show-avatar
	position absolute
	bottom -37px
	left 30px
.show-detail
	margin 35px auto
	width 70%
	height 40px
	background-color #fff
	border 1px solid #fff
	border-radius 6px
	text-align center
	line-height 40px
	color #409EFF
	cursor pointer
.slide-fade-enter-active 
	transition all .3s ease
.slide-fade-leave-active 
	transition all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0)
.slide-fade-enter, .slide-fade-leave-to
	transform translateY(10px)
	opacity 0

</style>
