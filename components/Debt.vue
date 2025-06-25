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
                placeholder="who are you"
                display-key="name"
                value-key="id"
              />
              <DynamicSelector
                v-model="ownedUser"
                :options="users"
                placeholder="who ows you"
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
            <!-- TODO -->
            <div v-else class="flex flex-col gap-3">
              <div v-if="isLoadingDebts">Loading debts...</div>
              <div v-else-if="fetchedDebts.length === 0">No debts found.</div>
              <ul v-else class="space-y-2 max-h-[420px] overflow-auto no-scrollbar">
                <li v-for="item in fetchedDebts" :key="item.id" class="bg-white p-3 rounded-lg shadow border">
                  <p class="font-semibold">{{ item.name }} → {{ item.ownedUser }}</p>
                  <p>💸 {{ item.debt }} | {{ item.symbol }}</p>
                  <p>🗒️ {{ item.definition || "No description" }}</p>
                  <p class="text-xs text-gray-500">🕒 {{ new Date(item.createdAt).toLocaleString("uz-UZ") }}</p>
                </li>
              </ul>
            </div>
          </div>
        </Transition>
      </div>
      <div class="flex gap-1.5">
        <DynamicButton color="transparent" size="small">Cancel</DynamicButton>
        <div class="flex gap-1.5 ml-auto" v-if="activeTab === 'Set'">
          <DynamicButton color="default" size="small" @click="sendToTelegram('sub')">Subtract</DynamicButton>
          <DynamicButton color="default" size="small" @click="sendToTelegram('add')">Add</DynamicButton>
        </div>
        <div class="" v-else>no button for now</div>
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
const ownedUser = ref<User | null>(null);

const fetchedDebts = ref<any[]>([]);
const isLoadingDebts = ref(false);

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

watch(
  activeTab,
  async (tab) => {
    if (tab === "Check") {
      isLoadingDebts.value = true;
      try {
        const res = await $fetch("http://localhost:3001/api/debts");
        fetchedDebts.value = res;
      } catch (err) {
        console.error("Failed to fetch debts", err);
        fetchedDebts.value = [];
      } finally {
        isLoadingDebts.value = false;
      }
    }
  },
  { immediate: true }
);

async function sendToTelegram(sym: string) {
  const name = selectedUser.value?.name;
  const owned = ownedUser.value?.name;
  const debt = debtNumber.value;
  const definition = deptDefinition.value;

  await $fetch("http://localhost:3001/api/send-check", {
    method: "POST",
    body: {
      name,
      owned,
      debt,
      definition,
      sym
    }
  });
}
</script>
