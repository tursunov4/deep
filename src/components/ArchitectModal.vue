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
        A Program for Architects
      </h2>
      <p class="text-[12px] font-normal font-arial text-[700] mb-[30px]">
        We offer fast and reliable delivery throughout the country. Please
        contact our managers for detailed information about the delivery time
        and cost.
      </p>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
        <input
          v-model="form.fcs"
          type="text"
          placeholder="FCS"
          class="border-b px-[10px] border-[#6D6D6D] placeholder:text-[#8B8B8B] w-full desktop:text-[18px] text-[12px] font-normal py-3 outline-none"
        />
        <input
          v-model="form.company"
          type="text"
          placeholder="Company Name"
          class="border-b px-[10px] border-[#6D6D6D] placeholder:text-[#8B8B8B] w-full desktop:text-[18px] text-[12px] font-normal py-3 outline-none"
        />
        <input
          v-model="form.post"
          type="text"
          placeholder="Post"
          class="border-b px-[10px] border-[#6D6D6D] placeholder:text-[#8B8B8B] w-full desktop:text-[18px] text-[12px] font-normal py-3 outline-none"
        />
        <input
          v-model="form.phone"
          type="text"
          placeholder="Phone Number"
          class="border-b px-[10px] border-[#6D6D6D] placeholder:text-[#8B8B8B] w-full desktop:text-[18px] text-[12px] font-normal py-3 outline-none"
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          class="border-b px-[10px] border-[#6D6D6D] placeholder:text-[#8B8B8B] w-full desktop:text-[18px] text-[12px] font-normal py-3 outline-none"
        />
        <textarea
          v-model="form.comment"
          placeholder="Comment (optional)"
          rows="4"
          class="border px-[10px] mt-5 border-[#6D6D6D] placeholder:text-[#8B8B8B] w-full desktop:text-[18px] text-[12px] font-normal py-3 outline-none"
        ></textarea>

        <!-- Error text -->
        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div class="text-center">
          <button
            type="submit"
            class="border border-[#6D6D6D] mt-5 px-[10px] font-bold text-[#8B8B8B] text-[16px] desktop:text-[18px] desktop:w-[324px] w-full uppercase py-[10px] tracking-wider"
          >
            Send a request
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useModal } from "../composables/useModal";

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

function handleSubmit() {
  const { fcs, company, post, phone, email } = form.value;

  if (!fcs || !company || !post || !phone || !email) {
    error.value = "Please fill in all required fields.";
    return;
  }

  error.value = "";
  alert("Request sent!");
  closeModal();
  resetForm();
}

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
</script>
