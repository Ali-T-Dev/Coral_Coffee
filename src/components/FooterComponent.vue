<template>
  <footer class="back-coral-footer mobile-box flex items-center justify-center py-4 ">
    <div class="flex justify-between w-[50%]">
      <a
        v-if="NumAndId?.instagram_id"
        :href="`https://instagram.com/${NumAndId.instagram_id}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconInstagram class="cursor-pointer hover:scale-110 transition" />
      </a>

      <a
        v-if="NumAndId?.master_mobile"
        :href="`tel:${NumAndId.master_mobile}`"
      >
        <IconCall class="cursor-pointer hover:scale-110 transition" />
      </a>
    </div>
  </footer>
</template>

<script setup>
import IconInstagram from './Icons/IconInstagram.vue'
import IconCall from './Icons/IconCall.vue'
import api from '@/Api/axios'
import { ref, onMounted } from 'vue'

const NumAndId = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/settings/general')
    NumAndId.value = res.data
  } catch (err) {
    console.error('خطا در گرفتن اطلاعات:', err)
  }
})
</script>
