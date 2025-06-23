<template>
  <div class="flex flex-col items-center justify-start text-secondary h-full p-4 shadow-lg rounded-xl">
    <div class="w-full flex flex-col gap-8">
      <div
        class="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-2 gap-2"
      >
        <div
          :data-state="activeTab === 'Set' ? 'active' : 'inactive'"
          @click="activeTab = 'Set'"
          class="cursor-pointer justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm flex items-center min-w-fit gap-2 data-[state=active]:bg-[#a65330] data-[state=active]:text-white"
        >
          Set
        </div>
        <div
          :data-state="activeTab === 'Check' ? 'active' : 'inactive'"
          @click="activeTab = 'Check'"
          class="cursor-pointer justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm flex items-center min-w-fit gap-2 data-[state=active]:bg-[#a65330] data-[state=active]:text-white"
        >
          Check
        </div>
      </div>

      <div class="relative">
        <Transition
          name="fade"
          mode="out-in"
          enter-active-class="transition-opacity duration-300"
          leave-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div :key="activeTab">
            <div v-if="activeTab === 'Set'" class="flex flex-col gap-3">
              <DynamicSelector
                v-model="selectedUser"
                :options="users"
                placeholder="Select a user..."
                display-key="name"
                value-key="id"
              />
              <input
                v-model="debtNumber"
                type="number"
                placeholder="how much"
                class="bg-white flex-1 min-w-[100px] outline-none px-3 py-2 border rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-[#a65330] focus-within:border-[#a65330]"
              />

              <textarea
                v-model="deptDefinition"
                name="what used for"
                placeholder="what was that for"
                class="bg-white relative focus:outline-none flex items-center px-3 py-2 border-none rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-[#a65330] focus-within:border-[#a65330]"
              ></textarea>
            </div>
            <h1 v-else>In Progress</h1>
          </div>
        </Transition>
      </div>
      <div class="flex gap-1.5">
        <DynamicButton color="transparent" size="small">Cancel</DynamicButton>
        <div class="flex gap-1.5 ml-auto">
          <DynamicButton color="default" size="small" @click="sendToTelegram('sub')">Subtract</DynamicButton>
          <DynamicButton color="default" size="small" @click="sendToTelegram('add')">Add</DynamicButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { User } from "~/types/type";

const activeTab = ref<"Set" | "Check">("Set");
const symbol = ref<"+" | "-" | "">("+");
const debtNumber = ref("");
const deptDefinition = ref("");
const selectedUser = ref<User | null>(null);

const users = [
  {
    id: 1,
    name: "China"
  },
  {
    id: 2,
    name: "India"
  },
  {
    id: 3,
    name: "nigeria"
  }
];

async function sendToTelegram(sym: string) {
  const name = selectedUser.value?.name;
  const debt = debtNumber.value;
  const definition = deptDefinition.value;

  const text = `📝 *New Check:*\n\n👤 Nationality: ${name}\n📧 Debt: ${debt}\n💬 Definition: ${definition}\n Symbol: ${sym}`;

  const res = await $fetch(`https://api.telegram.org/bot7683154090:AAHzRE4L3gTmysyZ1Vwq-szeVlpR97skBeU/sendMessage`, {
    method: "POST",
    body: {
      chat_id: 555294011,
      text: text,
      parse_mode: "Markdown"
    }
  });
  console.log("res---", res);
}
</script>
