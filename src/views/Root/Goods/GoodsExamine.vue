<script setup lang="ts">
import {onMounted, ref} from "vue";

import {ElMessage} from "element-plus";
import {pendingGoodsExamine, pendingGoodsSearch} from "@/service/api/goodsPending";

// Store 数据参数
interface PendingGoods {
  id: number |null;
  name: string | null;
  storeId: string | null;
  categoryId: string | null;
  price: string | null;
  createTime: Date | null;
  state: boolean | null;
  inventory: number | null;
  picture: string | null;
}
// 表格数据
const tableData = ref([ {} as PendingGoods ])
// 表格数据总数
const total = ref(0)
// 表格数据更新标志
const isUpdate = ref(false)
// 搜索-表单数据
const goodsSearchForm = ref({
  name: null,
  storeId: null,
  categoryId: null,
  createTime: null,
  page: 1, // 当前页
  pageSize: 12, // 每页显示条数
})
// 当前聚焦的商店数据
const pendingGoodsFocus = ref({} as PendingGoods)
// 对话框显示变量
const lookConfirm = ref(false)

// onMounted挂载时 获取商店列表
onMounted(() => { refreshGoods() } )
// 获取以及刷新商店列表
function refreshGoods(){
  pendingGoodsSearch(goodsSearchForm.value).then(res => {
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
function getGoods(row: any) {
  pendingGoodsSearch({id:row.id}).then(res => {
    if(res.data.code === 1) {
      pendingGoodsFocus.value = res.data.data.rows[0]
    }else {
      ElMessage.error("获取商店信息失败:"+res.data.message)
    }
  })
}
// 查看商店
function handleLook(row: any) {
  getGoods(row)
  lookConfirm.value = true
}

// 审核商店
function handleExaminePass() {
  pendingGoodsExamine({pendingGoods: pendingGoodsFocus.value,pass: true}).then(res => {
    if(res.data.code === 1) {
      ElMessage.success("操作成功")
      refreshGoods()
    }else {
      ElMessage.error("操作失败:"+res.data.message)
    }
  })
  lookConfirm.value = false
}
function handleExamineReject() {
  pendingGoodsExamine({pendingGoods: pendingGoodsFocus.value,pass: false}).then(res => {
    if(res.data.code === 1) {
      ElMessage.success("操作成功")
      refreshGoods()
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
                    v-model="goodsSearchForm.name"
                    style="width: 120px;margin-right: 20px"
          />
        </el-col>
        <el-col :span="30">
          <el-input placeholder="所属商店"
                    v-model="goodsSearchForm.storeId"
                    style="width: 120px;margin-right: 20px"
          />
        </el-col>
        <el-col :span="30">
          <el-input placeholder="所属分类"
                    v-model="goodsSearchForm.categoryId"
                    style="width: 120px;margin-right: 20px"
          />
        </el-col>
        <el-col :span="30">
          <el-date-picker
              type="daterange"
              range-separator="至"
              v-model="goodsSearchForm.createTime"
              start-placeholder="创建起始时间"
              end-placeholder="创建结束时间"
              style="margin-right: 20px"
          />
        </el-col>
        <el-col :span="30">
          <el-button type="primary" icon="search" @click="refreshGoods">查找</el-button>
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
      <el-table-column prop="name" label="商品名" width="180" align="center"/>
      <el-table-column prop="picture" label="图片" width="200" align="center">
        <template v-slot="{ row }">
          <el-image style="width: 100px; height: 100px" :src="row.picture" fit="cover"/>
        </template>
      </el-table-column>
      <el-table-column prop="storeId" label="所属商铺" width="200" align="center"/>
      <el-table-column prop="categoryId" label="所属分类" width="120" align="center"/>
      <el-table-column prop="price" label="价格" width="140" align="center"/>
      <el-table-column prop="createTime" label="创建时间" width="180" align="center"/>
      <el-table-column prop="inventory" label="库存" width="150" align="center"/>
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
                       v-model:page-size="goodsSearchForm.pageSize"
                       v-model:current-page="goodsSearchForm.page" @current-change="refreshGoods"/>
      </div>
    </template>
  </el-card>

  <el-dialog v-model="lookConfirm" width="500" style="">
    <el-card style="max-width: 480px;">
      <el-text size="large" style="text-align: center">{{ pendingGoodsFocus.name }}</el-text>
      <el-image style="width: 100px; height: 100px" :src="pendingGoodsFocus.picture" fit="cover"/>
      <span>所属商店: {{ pendingGoodsFocus.storeId }}</span>
      <span>所属分类: {{ pendingGoodsFocus.categoryId }}</span>
      <span>创建时间: {{ pendingGoodsFocus.createTime }}</span>
      <span>价格: ￥ {{ pendingGoodsFocus.price }} 元</span>
      <span>库存: {{ pendingGoodsFocus.inventory }}</span>
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
