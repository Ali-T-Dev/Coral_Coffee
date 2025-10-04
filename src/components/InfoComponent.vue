<template>
  <section class="back-color px-4 mobile-box pb-8 flex flex-col gap-10 text-base color-NameText">

    <!-- درباره ما -->
    <div class="back-items rounded-3xl cursor-pointer" @click="toggleSection('about')">
      <h3 class="text-3xl font-semibold color-title text-right pr-[4%] py-6">
        درباره ما
      </h3>
      <div
        class="px-4 pb-6 text-right color-body mb-4 prose prose-sm max-w-none leading-8 transition-all duration-800"
        :class="!expanded.about ? 'h-8 overflow-hidden ' : ''"
        v-html="aboutHtml"
      ></div>
      <p class="text-[#39722a] font-medium pb-8 text-right pr-10 cursor-pointer">
        {{ expanded.about ? 'بستن' : ' ادامه مطلب ...' }}
      </p>
    </div>

    <!-- ساعت کاری -->
    <div class="back-items rounded-3xl cursor-pointer" @click="toggleSection('work')">
      <h3 class="text-3xl font-semibold color-title text-right pr-[4%] py-6">
        ساعت کاری
      </h3>
      <div
        class="px-4 pb-6 text-right color-body mb-4 prose prose-sm max-w-none leading-8 transition-all duration-300"
        :class="!expanded.work ? 'h-8 overflow-hidden' : ''"
        v-html="workHoursHtml"
      ></div>
      <p class="text-[#39722a] font-medium pb-8 text-right pr-10 cursor-pointer">
        {{ expanded.work ? 'بستن' : ' ادامه مطلب ...' }}
      </p>
    </div>

    <!-- اطلاعات تماس -->
    <div class="back-items rounded-3xl cursor-pointer" @click="toggleSection('contact')">
      <h3 class="text-3xl font-semibold color-title text-right pr-[4%] py-6">
        اطلاعات تماس
      </h3>
      <div
        class="px-4 pb-6 text-right color-body mb-4 prose prose-sm max-w-none leading-8 transition-all duration-300"
        :class="!expanded.contact ? 'h-8 overflow-hidden' : ''"
        v-html="contactHtml"
      ></div>
      <p class="text-[#39722a] font-medium pb-8 text-right pr-10 cursor-pointer">
        {{ expanded.contact ? 'بستن' : ' ادامه مطلب ...' }}
      </p>
    </div>

  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/Api/axios'
import MarkdownIt from 'markdown-it'

const settings = ref(null)
const md = new MarkdownIt()

// خروجی HTML هر بخش
const aboutHtml = ref('')
const contactHtml = ref('')
const workHoursHtml = ref('')

// مدیریت باز/بسته بودن
const expanded = ref({
  about: false,
  contact: false,
  work: false,
})

function toggleSection(section) {
  expanded.value[section] = !expanded.value[section]
}

onMounted(async () => {
  try {
    const res = await api.get('/settings/general')
    settings.value = res.data

    aboutHtml.value = md.render(settings.value.about || '')
    contactHtml.value = md.render(settings.value.contact || '')
    workHoursHtml.value = md.render(settings.value.work_hours || '')
  } catch (err) {
    console.error('خطا در گرفتن تنظیمات:', err)
  }
})
</script>

<style>
.prose {
  direction: rtl;
  text-align: right;
}
</style>
