<template>
  <div
    v-if="isModalOpen"
    class="fixed inset-0 z-[199] bg-[#ffffff] bg-opacity-50 flex items-center justify-center"
    @click.self="closeModal"
  >
    <div
      class="bg-white w-full max-w-2xl p-8 relative shadow-lg border text-xs tracking-wide"
    >
      <!-- Close -->
      <button
        @click="closeModal"
        class="absolute top-2 right-2 text-black text-xl font-bold"
      >
        ×
      </button>

      <!-- Header -->
      <h2 class="font-bold mb-2 uppercase">A Program for Architects</h2>
      <p class="text-[11px] text-gray-600 mb-6">
        We offer fast and reliable delivery throughout the country. Please
        contact our managers for detailed information about the delivery time
        and cost.
      </p>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model="form.fcs"
          type="text"
          placeholder="FCS"
          class="border-b w-full py-2 outline-none"
        />
        <input
          v-model="form.company"
          type="text"
          placeholder="Company Name"
          class="border-b w-full py-2 outline-none"
        />
        <input
          v-model="form.post"
          type="text"
          placeholder="Post"
          class="border-b w-full py-2 outline-none"
        />
        <input
          v-model="form.phone"
          type="text"
          placeholder="Phone Number"
          class="border-b w-full py-2 outline-none"
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          class="border-b w-full py-2 outline-none"
        />
        <textarea
          v-model="form.comment"
          placeholder="Comment (optional)"
          rows="4"
          class="border w-full p-2 resize-none"
        ></textarea>

        <!-- Error text -->
        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div class="text-center">
          <button
            type="submit"
            class="border px-6 py-2 uppercase text-xs tracking-wider"
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
