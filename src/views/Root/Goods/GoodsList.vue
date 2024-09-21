<script setup lang="ts">
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import {goodsDeleteBySid, goodsSearch, goodsUpdateStateBySid} from "@/service/api/goods";

// Store 数据参数
interface Goods {
  id: string |null;
  name: string | null;
  storeId: string | null;
  categoryId: string | null;
  createTime: Date | null;
  price: string | null;
  state: boolean | null;
  inventory: number | null;
  salesCount: number | null;
  picture: string | null;
}
// 表格数据
const tableData = ref([ {} as Goods ])
// 表格数据总数
const total = ref(0)
// 表格数据更新标志
const isUpdate = ref(false)
// 搜索-表单数据
const goodsSearchForm = ref({
  id: null,
  name: null,
  createTime: null,
  storeId: null,
  categoryId: null,
  page: 1, // 当前页
  pageSize: 12, // 每页显示条数
})
// 当前聚焦的商店数据
const goodsFocus = ref({} as Goods)
// 对话框显示变量
const deleteConfirm = ref(false)
const lookConfirm = ref(false)

// onMounted挂载时 获取商店列表
onMounted(() => { refreshGoods() } )
// 获取以及刷新商店列表
function refreshGoods(){
  goodsSearch(goodsSearchForm.value).then(res => {
    if(res.data.code === 1) {
      tableData.value = res.data.data.rows
      total.value = res.data.data.total
    }else {
      ElMessage.error("获取商品列表失败:"+res.data.message)
    }
  })
  isUpdate.value = !isUpdate
}
// 获取聚焦商店数据
function getGoods(row: any) {
  goodsSearch({id:row.id}).then(res => {
    if(res.data.code === 1) {
      goodsFocus.value = res.data.data.rows[0]
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
// 封禁商店
function handleBan(row: any) {
  goodsUpdateStateBySid({id:row.id}).then(res => {
    if(res.data.code === 1) {
      ElMessage.success("操作成功")
      refreshGoods()
    }else {
      ElMessage.error("操作失败:"+res.data.message)
    }
  })
}
// 删除商店
function handleDelete(row: any) {
  getGoods(row)
  deleteConfirm.value = true
}
function deleteGoods(){
  goodsDeleteBySid({id:goodsFocus.value.id}).then(res => {
    if(res.data.code === 1) {
      ElMessage.success("操作成功")
      refreshGoods()
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
                    v-model="goodsSearchForm.id"
                    style="width: 120px;margin-right: 20px"
          />
        </el-col>
        <el-col :span="30">
          <el-input placeholder="商品名"
                    v-model="goodsSearchForm.name"
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
          <el-input placeholder="店铺"
                    v-model="goodsSearchForm.storeId"
                    style="width: 100px;margin-right: 20px"
          />
        </el-col>
        <el-col :span="30">
          <el-input placeholder="所属分类"
                    v-model="goodsSearchForm.categoryId"
                    style="width: 120px;margin-right: 20px"
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
      <el-table-column prop="id" label="ID" width="150" align="center" />
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
      <el-table-column prop="salesCount" label="销售量" width="150" align="center"/>
      <el-table-column prop="inventory" label="库存" width="150" align="center"/>
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
                       v-model:page-size="goodsSearchForm.pageSize"
                       v-model:current-page="goodsSearchForm.page" @current-change="refreshGoods"/>
      </div>
    </template>
  </el-card>

  <!--  -->
  <el-dialog v-model="deleteConfirm" width="500">
    <span>确认删除商品 " {{goodsFocus.name}} " 吗？</span>
    <span>删除后不可恢复，请谨慎操作</span>
    <template #footer>
      <el-button @click="deleteConfirm =false">取消</el-button>
      <el-button type="danger" @click="deleteGoods">删除</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="lookConfirm" width="500" style="display: flex;justify-content: center">
    <el-card style="max-width: 480px;">
      <el-text size="large" style="text-align: center">{{goodsFocus.name}}</el-text>
      <span><el-image style="width: 100px; height: 100px" :src="goodsFocus.picture" fit="cover"/></span>
      <span>所属商铺: {{goodsFocus.storeId}}</span>
      <span>所属分类: {{goodsFocus.categoryId}}</span>
      <span>创建时间: {{goodsFocus.createTime}}</span>
      <span>价格: ￥ {{goodsFocus.price}} 元</span>
      <span>销售量: {{goodsFocus.salesCount}}</span>
      <span>库存: {{goodsFocus.inventory}}</span>
      <span>状态：
        <el-text v-if="goodsFocus.state" type="success">正常</el-text>
        <el-text v-else type="danger">封禁</el-text>
      </span>
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
