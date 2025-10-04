<template>
  <div class="">
    <p v-if="errorMessage" class=" text-red-500 text-2xl font-bold flex items-center justify-center pt-[30%]">{{ errorMessage }}</p>

    <div v-else>
      <div v-if="products.length" class="grid grid-cols-1 gap-6 mt-6">
        <div 
          v-for="prod in products" 
          :key="prod.id"
          class="rounded-4xl p-4 flex flex-col items-center gap-6 shadow-md back-items"
           @click="openPopup(prod)"
        >
          <img 
            :src=" prod.image_url ? prod.image_url : category " 
            alt="product" 
            class="w-full h-[75%] object-cover rounded-4xl mb-2" 
          />
          <div class="flex items-center justify-between w-full mt-4 color-Subtitle ">
            <p class="font-bold text-lg ">{{ prod.price }} تومان</p>
            <h4 class="font-semibold text-base w-[50%] color-NameText">{{ prod.name }}</h4>
          </div>  
        </div>
      </div>

      <div v-else class="color-coral-loding text-2xl font-bold flex flex-col justify-end items-center p-6">
        <img :src="CoralLodingLogo" alt="logo" class="w-[50%]">
        <p class="text-2xl font-bold py-6"> {{ randomMessage.text }}</p>
        <p class="flex justify-start w-full text-xl font-semibold"> {{ randomMessage.poet }}</p>
      </div>
    </div>

    <div
      v-if="selectedProduct"
      class="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50"
    >
      <div
        class=" rounded-3xl py-10 px-5 w-[85%] h-[90%] relative text-center overflow-scroll color-bg-popup"
      >
        <button
          @click="closePopup"
          class="absolute top-3 left-3 text-gray-500 hover:text-red-500 text-xl"
        >
          <IconClose/>
        </button>

        <img
          :src="selectedProduct.image_url || category"
          alt="product"
          class="w-full h-56 object-cover rounded-2xl mb-4"
        />


        <h3 class="font-bold text-xl mb-6 color-prodTitle">{{ selectedProduct.name }}</h3>
        <p class=" text-base color-NameText" v-html="selectedProduct.description"></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "../Api/axios";
import category from '../assets/Image/category.jpg'
import CoralLodingLogo from '../assets/Image/corallogo.png'
import IconClose from "./Icons/IconClose.vue";

const props = defineProps({
  categoryId: {
    type: Number,
    required: true
  }
});

const products = ref([]);
const errorMessage = ref("");
const randomMessage = ref("");
const selectedProduct = ref(null);

const messages = [
  { text: "صبر پیشه کن، که رنج و محنت، به آرامش و فرج می‌انجامد.", poet: "سعدی" },
  { text: "هر چه صبر کنی، نیکی‌ها در راهند.", poet: "ناشناس" },
  { text: "به صبر، همه مشکلات آسان شود، که صبر کلید گشایش است.", poet: "حافظ" },
  { text: "صبر، حکمت بی‌همتاست که دل را آرام می‌کند.", poet: "ناشناس" },
  { text: "صبر کن، تا صافی جان پیدا شود، که شتاب، راه را تاریک می‌کند.", poet: "مولانا" },
  { text: "صبر، داروی درد دل است.", poet: "ناشناس" },
  { text: "صبر کن ای دل، که وقت خوشی رسد، که رنج، مروارید دل است.", poet: "عطار" },
  { text: "صبر، نوری است در تاریکی‌ها.", poet: "ناشناس" },
  { text: "صبر و حلم، از گنج‌های دل است، که باد نمی‌تواند برد.", poet: "سعدی" },
  { text: "صبور باش، تا زندگی رنگ تازه گیرد.", poet: "ناشناس" },
  { text: "صبر کن، که فرج نزدیک است، و شب، همیشه به روز می‌رسد.", poet: "حافظ" },
  { text: "هر چیزی زمان خودش را دارد، صبر کن.", poet: "ناشناس" },
  { text: "صبر، کشتی است در دریای سختی‌ها، که طوفان هم آن را نشکاند.", poet: "مولانا" },
  { text: "صبر، کلید هر گره‌ای است.", poet: "ناشناس" },
  { text: "هر که صبر کرد، گنج یافت، و هر که عجله کرد، حسرت دید.", poet: "عطار" },
  { text: "صبور باش، تا دل آرام گیرد.", poet: "ناشناس" },
  { text: "صبر، زینت عقل و جان است، که بی‌صبر، دل بی‌قرار شود.", poet: "سعدی" },
  { text: "صبر، سایه‌ای است که در گرمای سختی‌ها آرامش می‌بخشد.", poet: "ناشناس" },
  { text: "صبر کن، تا بهار دل برسد، که زمستان، پایان ندارد.", poet: "حافظ" },
  { text: "صبور باش و ببین که روزگار چگونه گل می‌دهد.", poet: "ناشناس" },
  { text: "صبر، سکوی پرواز دل است.", poet: "مولانا" },
  { text: "صبور باش، که دل آرام می‌شود.", poet: "ناشناس" },
  { text: "صبر، بهترین آموزگار است.", poet: "سعدی" },
  { text: "هرچه صبر، برکت بیشتر.", poet: "ناشناس" },
  { text: "صبر، نردبان رسیدن به خوشی است.", poet: "حافظ" },
  { text: "صبوری، نشانه شجاعت واقعی است.", poet: "ناشناس" },
  { text: "صبر، چراغی است که تاریکی را روشن می‌کند.", poet: "عطار" },
  { text: "صبور باش، که سختی‌ها کوتاه‌اند.", poet: "ناشناس" },
  { text: "صبر، درختی است که میوه شیرین می‌دهد.", poet: "مولانا" },
  { text: "صبور بودن، هنر دل است.", poet: "ناشناس" },
  { text: "صبر، زلالی است که دل را پاک می‌کند.", poet: "سعدی" },
  { text: "صبور باش، تا آرامش بیاید.", poet: "ناشناس" },
  { text: "صبر، طلایی است که در دل سختی‌ها پیدا می‌شود.", poet: "حافظ" },
  { text: "صبور باش و ببین که روزگار چگونه می‌چرخد.", poet: "ناشناس" },
  { text: "صبر، شعله‌ای است که امید را روشن می‌کند.", poet: "مولانا" },
  { text: "صبوری، کلید فتح دل است.", poet: "ناشناس" },
  { text: "صبر، هنر زندگی است.", poet: "عطار" },
  { text: "صبور باش، که هر مشکلی راه حل دارد.", poet: "ناشناس" },
  { text: "صبر، سایه‌ای خنک در روزهای گرم زندگی است.", poet: "سعدی" },
  { text: "صبوری، زیباترین صفت دل است.", poet: "ناشناس" },
];


async function fetchProducts(id) {
  try {
    randomMessage.value = messages[Math.floor(Math.random() * messages.length)];
    const response = await axios.get(`/categories/${id}/products`);
    products.value = response.data.data || [];
  } catch (error) {
    errorMessage.value = "صفحه رو رفرش کن";
    console.error(error);
  }
}

function openPopup(product) {
  selectedProduct.value = product;
}

function closePopup() {
  selectedProduct.value = null;
}

watch(
  () => props.categoryId,
  (newId) => {
    if (newId) fetchProducts(newId);
  },
  { immediate: true }
);
</script>
