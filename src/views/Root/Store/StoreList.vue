<script setup lang="ts">
import {onMounted, ref} from "vue";
import {storeDeleteBySid, storeSearch, storeUpdateStateBySid} from "@/service/api/store";
import {ElMessage} from "element-plus";

// Store 数据参数
interface Store {
  id: string |null;
  name: string | null;
  createTime: Date | null;
  state?: boolean | null;
  ownerName: string | null;
  ownerPhone: string | null;
  ownerEmail?: string | null;
  address?: string | null;
}
// 表格数据
const tableData = ref([ {} as Store ])
// 表格数据总数
const total = ref(0)
// 表格数据更新标志
const isUpdate = ref(false)
// 搜索-表单数据
const storeSearchForm = ref({
  id: null,
  name: null,
  createTime: null,
  ownerName: null,
  ownerPhone: null,
  page: 1, // 当前页
  pageSize: 12, // 每页显示条数
})
// 当前聚焦的商店数据
const storeFocus = ref({} as Store)
// 对话框显示变量
const deleteConfirm = ref(false)
const lookConfirm = ref(false)

// onMounted挂载时 获取商店列表
onMounted(() => { refreshStore() } )
// 获取以及刷新商店列表
function refreshStore(){
  storeSearch(storeSearchForm.value).then(res => {
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
  storeSearch({id:row.id}).then(res => {
    if(res.data.code === 1) {
      storeFocus.value = res.data.data.rows[0]
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
// 封禁商店
function handleBan(row: any) {
  storeUpdateStateBySid({id:row.id}).then(res => {
    if(res.data.code === 1) {
      ElMessage.success("操作成功")
      refreshStore()
    }else {
      ElMessage.error("操作失败:"+res.data.message)
    }
  })
}
// 删除商店
function handleDelete(row: any) {
  getStore(row)
  deleteConfirm.value = true
}
function deleteStore(){
  storeDeleteBySid({id:storeFocus.value.id}).then(res => {
    if(res.data.code === 1) {
      ElMessage.success("操作成功")
      refreshStore()
      deleteConfirm.value = false
    }else {
      ElMessage.error("操作失败:"+res.data.message)
    }
  })
}

</script>

<template>
  <el-card >
    <div class="search_box">
      <el-row>
        <el-col :span="30">
          <el-input placeholder="ID"
                    v-model="storeSearchForm.id"
                    style="width: 120px;margin-right: 20px"
          />
        </el-col>
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
      <el-table-column prop="id" label="ID" width="120" align="center" />
      <el-table-column prop="name" label="商店名" width="180" align="center"/>
      <el-table-column prop="address" label="地址" width="305" align="center"/>
      <el-table-column prop="createTime" label="创建时间" width="120" align="center"/>
      <el-table-column prop="ownerName" label="责任人" width="140" align="center"/>
      <el-table-column prop="ownerPhone" label="联系方式" width="180" align="center"/>
      <el-table-column label="状态" width="80" align="center">
        <template v-slot="{ row }">
          <el-tag v-if="row.state" type="success">正常</el-tag>
          <el-tag v-else type="danger">封禁</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="240" align="center">
        <template v-slot="{ row }">
          <el-button type="primary" @click="handleLook(row)">
            查看
          </el-button>
          <el-button v-if="row.state" type="warning" @click="handleBan(row)">
            封禁
          </el-button>
          <el-button v-else type="info" @click="handleBan(row)">
            解封
          </el-button>
          <el-button type="danger" @click="handleDelete(row)">
            删除
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

  <!--  -->
  <el-dialog v-model="deleteConfirm" width="500">
    <span>确认删除商店 " {{storeFocus.name}} " 吗？</span>
    <span>该操作会删除该商店的所有商品</span>
    <span>删除后不可恢复，请谨慎操作</span>
    <template #footer>
      <el-button @click="deleteConfirm =false">取消</el-button>
      <el-button type="danger" @click="deleteStore">删除</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="lookConfirm" width="800" style="display: flex;justify-content: center">
    <el-card style="min-width: 600px;">
      <el-descriptions
          class="margin-top"
          :column="1"
          size="default"
          border
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-text>店铺名</el-text>
            </div>
          </template>
          <el-text>{{storeFocus.name}}</el-text>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-text>状态</el-text>
            </div>
          </template>
          <el-text v-if="storeFocus.state" type="success">正常</el-text>
          <el-text v-else type="danger">封禁</el-text>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-text>创建时间</el-text>
            </div>
          </template>
          <el-text>{{storeFocus.createTime}}</el-text>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-text>责任人</el-text>
            </div>
          </template>
          <el-text>{{storeFocus.ownerName}}</el-text>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-text>联系电话</el-text>
            </div>
          </template>
          <el-text>{{storeFocus.ownerPhone}}</el-text>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-text>邮箱</el-text>
            </div>
          </template>
          <el-text>{{storeFocus.ownerEmail}}</el-text>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-text>地址</el-text>
            </div>
          </template>
          <el-text>{{storeFocus.address}}</el-text>
        </el-descriptions-item>
      </el-descriptions>

    </el-card>
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
