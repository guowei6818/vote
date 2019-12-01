<!--
 * @Author: your name
 * @Date: 2019-11-18 08:38:56
 * @LastEditTime: 2019-11-18 17:27:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vote\src\views\ShowJoin.vue
 -->
<template>
	<div>
        <h3 style="text-align:center; height:60px;line-height:40px">我参加的投票</h3>
        <el-table :data="myjoin" style="width: 100%">
            <el-table-column prop="title" label="标题" width="300"></el-table-column>
            <el-table-column prop="desc" label="描述" width="400"></el-table-column>
            <el-table-column prop="deadline" label="状态" width="150" :formatter="status"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click.stop="jumpToVote(scope.row)" type="text" size="medium">查看</el-button>
                    <el-button @click.stop="deleteVote(scope.$index,scope.row)" type="text" size="medium">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
	</div>
</template>

<script>
import api from '../api';

window.api = api;
export default {
	name: 'Forgot',
	data(){
		return {
            myjoin: [],
		};
	},
	methods:{
		jumpToVote(vote) {
            location.href = `/#/vote-show/${vote.id}`;
        },
        status(row,col,ceil) {
            return (ceil > Date.now()) ? "未过期" : "已过期";
        },
        async deleteVote(idx, vote) {
            this.myjoin.splice(idx,1);
            await api.post("/myjoin",{voteid: vote.id});
        }
    },
    async mounted(){
        var response = await api.get('/myjoin')
        this.myjoin.push(...response.data.myjoin);
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>

</style>