<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 z-[199] bg-[#ffffff] bg-opacity-50 flex items-center justify-center"
    @click.self="closeModal"
  >
    <div
      class="bg-white w-full max-w-[770px] desktop:p-[60px] px-5 py-[50px] relative shadow-lg border text-xs tracking-wide"
    >
      <!-- Close -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 text-black text-xl font-bold"
      >
        <img
          src="/closeblack.svg"
          alt="Close"
          class="desktop:w-[20px] desktop:h-[20px] w-[16px] h-[16px]"
        />
      </button>

      <!-- Header -->
      <h2 class="font-bold text-[18px] desktop:mb-5 mb-4 font-TT uppercase">
        {{ t("architectModal.header") }}
      </h2>
      <p class="text-[12px] font-normal font-arial text-[700] mb-[30px]">
        {{ t("architectModal.description") }}
      </p>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
        <input
          v-model="form.fcs"
          type="text"
          :placeholder="t('architectModal.fcs')"
          :class="inputClass(form.fcs)"
        />
        <input
          v-model="form.company"
          type="text"
          :placeholder="t('architectModal.company')"
          :class="inputClass(form.company)"
        />
        <input
          v-model="form.post"
          type="text"
          :placeholder="t('architectModal.post')"
          :class="inputClass(form.post)"
        />
        <input
          v-model="form.phone"
          type="text"
          :placeholder="t('architectModal.phone')"
          :class="inputClass(form.phone)"
          @input="onlyDigits('phone')"
        />
        <input
          v-model="form.email"
          type="email"
          :placeholder="t('architectModal.email')"
          :class="inputClass(form.email)"
        />
        <textarea
          v-model="form.comment"
          :placeholder="t('architectModal.comment')"
          rows="4"
          class="border px-[10px] mt-5 font-TT border-[#6D6D6D] placeholder:text-[#8B8B8B] w-full desktop:text-[18px] text-[12px] font-normal py-3 outline-none"
          :style="{ borderColor: form.comment ? '#101010' : '#6D6D6D' }"
        ></textarea>

        <!-- Error / Success -->
        <div v-if="error" class="text-red-600 font-TT text-sm text-center">
          {{ error }}
        </div>
        <div v-if="success" class="text-green-600 font-TT text-sm text-center">
          {{ success }}
        </div>

        <!-- Submit -->
        <div class="text-center">
          <button
            type="submit"
            :disabled="!isFormValid || loading"
            class="border border-[#6D6D6D] mt-5 px-[10px] font-bold font-TT text-[16px] desktop:text-[18px] desktop:w-[324px] w-full uppercase h-[35px] pt-[10px] pb-[11px] tracking-wider"
            :class="{
              'text-[#101010]': isFormValid,
              'text-[#8B8B8B]': !isFormValid,
            }"
          >
            {{
              loading ? t("architectModal.loading") : t("architectModal.submit")
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useModal } from "../composables/useModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

const { isModalOpen, closeModal } = useModal();

const form = ref({
  fcs: "",
  company: "",
  post: "",
  phone: "",
  email: "",
  comment: "",
});

const error = ref("");
const success = ref("");
const loading = ref(false);

// Check if form is completely filled
const isFormValid = computed(() => {
  const { fcs, company, post, phone, email } = form.value;
  return fcs && company && post && phone && email;
});

// Input field dynamic class
function inputClass(value) {
  return [
    "border-b px-[10px] w-full font-TT desktop:text-[18px] text-[12px] font-normal py-3 outline-none placeholder:text-[#8B8B8B]",
    value ? "border-[#101010]" : "border-[#6D6D6D]",
  ];
}

// Only allow digits for phone field
function onlyDigits(field) {
  form.value[field] = form.value[field].replace(/\D/g, "");
}

// Reset
function resetForm() {
  form.value = {
    fcs: "",
    company: "",
    post: "",
    phone: "",
    email: "",
    comment: "",
  };
}

// Submit
async function handleSubmit() {
  const { fcs, company, post, phone, email, comment } = form.value;

  if (!isFormValid.value) {
    error.value = t("architectModal.error");
    return;
  }

  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    const response = await fetch("https://depp-d.com/api/contact_form/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fcs, company, post, phone, email, comment }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit the form");
    }
    success.value = t("architectModal.success");
    resetForm();

    setTimeout(() => {
      closeModal();
      success.value = "";
    }, 1500);
  } catch (err) {
    error.value = t("architectModal.error");
  } finally {
    loading.value = false;
  }
}
</script>
