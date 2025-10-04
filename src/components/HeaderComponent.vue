<template>
  <header class="back-color relative mobile-box">
    <div class="flex justify-center">
      <div class="w-[97%] mt-2">
        <img
          src="../assets/Image/HeaderCoffee3.jpg"
          alt="Coffee Header"
          class="rounded-b-[50%] rounded-t-4xl"
        />
      </div>
      
      <div class="absolute top-6 w-full">
        <div class="flex justify-between items-center px-[8%]">
          <button @click="toggleCallWaiter" class="cursor-pointer">
            <IconAlertEmpty v-if="!calledWaiter"/>
            <IconAlertFull v-else/>
          </button>
          <button @click="focusSearch">
            <IconSearch/>
          </button>
        </div>
      </div>
    </div>
    <div class="w-full text-center pt-4 text-deskText">
      <h2 class=" text-2xl font-bold">
        {{ table?.name || 'میز' }}
      </h2>
      <p class=" text-lg">به کافه کورال خوش آمدید</p>
    </div>

    <!-- Popup -->
    <div v-if="showPopup" class=" fixed inset-0 flex justify-center items-center z-50 ">
      <div class="color-bg-popup rounded-4xl p-6 py-8 w-[90%] max-w-sm text-center relative">
        <p class="text-xl font-semibold mb-[10%]">!!الان میام سفارشتون رو میگیرم</p>
        <button 
          class="bg-green-800 text-white px-8 py-2 rounded-lg  hover:bg-green-700"
          @click="confirmPopup"
        >
          تایید
        </button>
      </div>
    </div>

    <MenuProductsComponent ref="menuRef" />

    
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/Api/axios'
import IconAlertEmpty from './Icons/IconAlertEmpty.vue'
import IconAlertFull from './Icons/IconAlertFull.vue'
import IconSearch from './Icons/IconSearch.vue'
import MenuProductsComponent from './MenuProductsComponent.vue'

const route = useRoute()
const table = ref(null)
const calledWaiter = ref(false)
const showPopup = ref(false)
const menuRef = ref(null)

watch(
  () => route.params.id,
  async (newId) => {
    await loadTable(newId)
  },
  { immediate: true }
)

async function loadTable(id) {
  try {
    const res = await api.get(`/table/${id || 2}`)
    table.value = res.data.data
    calledWaiter.value = table.value.called_waiter
  } catch (err) {
    console.error('خطا در گرفتن اطلاعات میز:', err)
  }
}


function toggleCallWaiter() {
  if (!calledWaiter.value) {
    showPopup.value = true
  }
  calledWaiter.value = !calledWaiter.value
}

function confirmPopup() {
  showPopup.value = false
  console.log('سفارشتون تایید شد')
}

function focusSearch() {
  menuRef.value?.focusSearchInput()
}
</script>
