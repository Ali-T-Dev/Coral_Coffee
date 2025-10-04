<template>
  <section class="back-color relative min-h-screen mobile-box pb-4">
    
    <div class="flex justify-center my-6">
      <input
        type="text"
        v-model="searchText"
        ref="searchInput"
        placeholder="جستجوی دسته‌ها"
        class="bg-white w-[90%] h-14 rounded-2xl  px-4 text-lg focus:outline-none focus:ring-1 focus:ring-amber-950"
        dir="rtl"
      />
    </div>
    
    <h2 class="text-4xl font-bold color-title text-right pr-[4%] pb-10 pt-6">منو</h2>


    <div class="flex flex-col items-center">
      <div class="rounded-4xl px-4 pt-4 w-[90%] text-right back-color ">
        <ul class="grid grid-cols-1  ">
          <li
            v-for="item in filteredCategories"
            :key="item.id"
            class="cursor-pointer mb-8  "
          >

            <p
              class="flex items-center justify-between text-2xl font-bold color-prodTitle pb-4 hover:color-coral_hover-title"
              @click="toggleCategory(item.id)"
            >
             <component :is="item.icon"/>
              {{ item.name }}

            </p>

            <div v-if="selectedId === item.id" class="min-h-[100px]">
              <MenuProductsItemsComponent :categoryId="item.id" />
            </div>
          </li>
        </ul>

        <p v-if="filteredCategories.length === 0" class="text-gray-500 mt-4">
          موردی یافت نشد
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import AllCategories from "../Api/axios";
import MenuProductsItemsComponent from "./MenuProductsItemsComponent.vue";
import IconFood from "./Icons/IconFood.vue";
import IconBreakfast from "./Icons/IconBreakfast.vue";
import IconHotDrink from "./Icons/IconHotDrink.vue";
import IconNaturalDrink from "./Icons/IconNaturalDrink.vue";
import IconTea from "./Icons/IconTea.vue";
import IconCoffee from "./Icons/IconCoffee.vue";
import IconSyrupBottle from "./Icons/IconSyrupBottle.vue";
import IconMilkShake from "./Icons/IconMilkShake.vue";
import IconDessert from "./Icons/IconDessert.vue";
import IconSandwich from "./Icons/IconSandwich.vue";
import IconFrenchFries from "./Icons/IconFrenchFries.vue";
import IconPasta from "./Icons/IconPasta.vue";
import IconSalad from "./Icons/IconSalad.vue";
import IconBurger from "./Icons/IconBurger.vue";
import IconAmericanPizza from "./Icons/IconAmericanPizza.vue";
import IconItalianPizza from "./Icons/IconItalianPizza.vue";
import IconExtra from "./Icons/IconExtra.vue";
import IconColdDrink from "./Icons/IconColdDrink.vue";

const categories = ref([]);
const selectedId = ref(null);
const searchText = ref("");

const STORAGE_KEY = "categories_cache";

const categoryIcons = {
  19: IconFood,          // غذای ایرانی
  1: IconBreakfast,      // صبحانه
  2: IconHotDrink,       // نوشیدنی گرم
  3: IconNaturalDrink,   // نوشیدنی طبیعی
  4: IconTea,            // چای و دمنوش
  5: IconCoffee,         // بر پایه قهوه
  6: IconSyrupBottle,    // سیروپ‌ها
  7: IconMilkShake,      // شیک
  8: IconDessert,        // دسر و کوکی
  9: IconSandwich,       // لقمه و ساندویچ
  10: IconFrenchFries,   // سیب زمینی
  11: IconPasta,         // پاستا
  12: IconSalad,         // سالاد
  13: IconBurger,        // برگر
  14: IconAmericanPizza, // پیتزا آمریکایی
  15: IconItalianPizza,  // پیتزا ایتالیایی
  17: IconExtra,         // Extra
  18: IconColdDrink      // نوشیدنی یخچالی
};
const searchInput = ref(null);

async function GetInfo() {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      categories.value = parsed.map(cat => ({
        ...cat,
        icon: categoryIcons[cat.id] || IconFood
      }));
      return;
    }


    const response = await AllCategories.get("/categories");

    categories.value = response.data.data.map(cat => ({
      ...cat,
      icon: categoryIcons[cat.id] || IconFood
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories.value));
  } catch (error) {
    console.error("خطا در گرفتن اطلاعات:", error);
  }
}




const filteredCategories = computed(() => {
  if (!searchText.value) return categories.value;
  return categories.value.filter((cat) =>
    cat.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

function toggleCategory(id) {
  selectedId.value = selectedId.value === id ? null : id;
}

function focusSearchInput() {
  searchInput.value?.focus();
}

defineExpose({ focusSearchInput });

onMounted(() => {
  GetInfo();
});
</script>
