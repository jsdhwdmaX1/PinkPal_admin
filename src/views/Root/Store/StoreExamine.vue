<script setup lang="ts">
import {onMounted, ref} from "vue";

import {ElMessage} from "element-plus";
import {pendingStoreExamine, pendingStoreSearch} from "@/service/api/storePending";

// Store 数据参数
interface PendingStore {
  id: number |null;
  name: string | null;
  createTime: Date | null;
  ownerName: string | null;
  ownerPhone: string | null;
  ownerEmail?: string | null;
  ownerIdCard: string | null;
  address?: string | null;
}
// 表格数据
const tableData = ref([ {} as PendingStore ])
// 表格数据总数
const total = ref(0)
// 表格数据更新标志
const isUpdate = ref(false)
// 搜索-表单数据
const storeSearchForm = ref({
  name: null,
  createTime: null,
  ownerName: null,
  ownerPhone: null,
  page: 1, // 当前页
  pageSize: 12, // 每页显示条数
})
// 当前聚焦的商店数据
const pendingStoreFocus = ref({} as PendingStore)
// 对话框显示变量
const lookConfirm = ref(false)

// onMounted挂载时 获取商店列表
onMounted(() => { refreshStore() } )
// 获取以及刷新商店列表
function refreshStore(){
  pendingStoreSearch(storeSearchForm.value).then(res => {
    if(res.data.code === 1) {
      tableData.value = res.data.data.rows
      total.value = res.data.data.total
    }else {
      ElMessage.error("获取商店列表失败:"+res.data.message)
    }
  })
  isUpdate.value = !isUpdate
}
// 获取聚焦商店数据
function getStore(row: any) {
  pendingStoreSearch({sid:row.sid}).then(res => {
    if(res.data.code === 1) {
      pendingStoreFocus.value = res.data.data.rows[0]
    }else {
      ElMessage.error("获取商店信息失败:"+res.data.message)
    }
  })
}
// 查看商店
function handleLook(row: any) {
  getStore(row)
  lookConfirm.value = true
}

// 审核商店
function handleExaminePass() {
  pendingStoreExamine({pendingStore: pendingStoreFocus.value,pass: true}).then(res => {
    if(res.data.code === 1) {
      ElMessage.success("操作成功")
      refreshStore()
    }else {
      ElMessage.error("操作失败:"+res.data.message)
    }
  })
  lookConfirm.value = false
}
function handleExamineReject() {
  pendingStoreExamine({pendingStore: pendingStoreFocus.value,pass: false}).then(res => {
    if(res.data.code === 1) {
      ElMessage.success("操作成功")
      refreshStore()
    }else {
      ElMessage.error("操作失败:"+res.data.message)
    }
  })
  lookConfirm.value = false
}

</script>

<template>
  <el-card >
    <div class="search_box">
      <el-row>
        <el-col :span="30">
          <el-input placeholder="商店名"
                    v-model="storeSearchForm.name"
                    style="width: 120px;margin-right: 20px"
          />
        </el-col>
        <el-col :span="30">
          <el-date-picker
              type="daterange"
              range-separator="至"
              v-model="storeSearchForm.createTime"
              start-placeholder="创建起始时间"
              end-placeholder="创建结束时间"
              style="margin-right: 20px"
          />
        </el-col>
        <el-col :span="30">
          <el-input placeholder="责任人"
                    v-model="storeSearchForm.ownerName"
                    style="width: 100px;margin-right: 20px"
          />
        </el-col>
        <el-col :span="30">
          <el-input placeholder="联系方式"
                    v-model="storeSearchForm.ownerPhone"
                    style="width: 120px;margin-right: 20px"
          />
        </el-col>
        <el-col :span="30">
          <el-button type="primary" icon="search" @click="refreshStore">查找</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
        border stripe fit
        height= "auto"
        :data="tableData"
        :key="isUpdate"
        style="width: 100%;"
        size="large"
    >
      <el-table-column prop="name" label="商店名" width="180" align="center"/>
      <el-table-column prop="address" label="地址" width="305" align="center"/>
      <el-table-column prop="createTime" label="创建时间" width="120" align="center"/>
      <el-table-column prop="ownerName" label="责任人" width="140" align="center"/>
      <el-table-column prop="ownerPhone" label="联系电话" width="180" align="center"/>
      <el-table-column prop="ownerEmail" label="邮箱" width="180" align="center"/>
      <el-table-column prop="ownerIdCard" label="身份证号" width="180" align="center"/>
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template v-slot="{ row }">
          <el-button type="primary" @click="handleLook(row)">
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <div style="display: flex; justify-content: center">
        <el-pagination background layout="prev, pager, next"
                       :total="total"
                       v-model:page-size="storeSearchForm.pageSize"
                       v-model:current-page="storeSearchForm.page" @current-change="refreshStore"/>
      </div>
    </template>
  </el-card>

  <el-dialog v-model="lookConfirm" width="500" style="">
    <el-card style="max-width: 480px;">
      <el-text size="large" style="text-align: center">{{pendingStoreFocus.name}}</el-text>
      <span>地址: {{pendingStoreFocus.address}}</span>
      <span>创建时间: {{pendingStoreFocus.createTime}}</span>
      <span>责任人: {{pendingStoreFocus.ownerName}}</span>
      <span>联系电话: {{pendingStoreFocus.ownerPhone}}</span>
      <span>邮箱：{{pendingStoreFocus.ownerEmail}}</span>
      <span>身份证号：{{pendingStoreFocus.ownerIdCard}}</span>
    </el-card>
    <template #footer>
      <el-button @click="lookConfirm = false">取消</el-button>
      <el-button type="primary" @click="handleExaminePass">
        通过
      </el-button>
      <el-button type="danger" @click="handleExamineReject">
        驳回
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

.search_box {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.el-dialog span {
  font-size: 20px;
  font-family: "三极行楷简体-粗", serif;
  display: block;
  margin: 10px 0;
}

</style>
