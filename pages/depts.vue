<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 space-y-8">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Dynamic Selector Demo</h1>
      </div>

      <!-- Basic User Selection -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">👤 Basic User Selection</h2>
        <div class="space-y-4">
          <DynamicSelector
            v-model="selectedUser"
            :options="users"
            placeholder="Select a user..."
            display-key="name"
            value-key="id"
          />
          <div class="text-sm text-gray-600">
            <strong>Selected:</strong> {{ selectedUser ? `${selectedUser.name} (${selectedUser.email})` : "None" }}
          </div>
        </div>
      </div>

      <!-- Multiple Tags Selection -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">🏷️ Multiple Tags with Creation</h2>
        <div class="space-y-4">
          <DynamicSelector
            v-model="selectedTags"
            :options="tags"
            multiple
            creatable
            placeholder="Select or create tags..."
            display-key="label"
            value-key="value"
            @create="handleCreateTag"
          />
          <div class="text-sm text-gray-600">
            <strong>Selected Tags:</strong>
            <span v-if="selectedTags.length === 0">None</span>
            <span v-else class="flex flex-wrap gap-1 mt-1">
              <span
                v-for="tag in selectedTags"
                :key="tag.value"
                class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
              >
                {{ tag.label }}
              </span>
            </span>
          </div>
        </div>
      </div>

      <!-- Async City Search -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">🌍 Async City Search</h2>
        <div class="space-y-4">
          <DynamicSelector
            v-model="selectedCity"
            :options="cities"
            :loading="isLoadingCities"
            searchable
            placeholder="Search cities..."
            display-key="name"
            value-key="id"
            @search="handleCitySearch"
          />
          <div class="text-sm text-gray-600">
            <strong>Selected City:</strong>
            {{
              selectedCity
                ? `${selectedCity.name}, ${selectedCity.country} (Pop: ${selectedCity.population.toLocaleString()})`
                : "None"
            }}
          </div>
        </div>
      </div>

      <!-- Custom Styled Products -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">🛍️ Custom Styled Products</h2>
        <div class="space-y-4">
          <DynamicSelector
            v-model="selectedProduct"
            :options="products"
            placeholder="Select a product..."
            display-key="name"
            value-key="id"
            :custom-classes="{
              container: 'border-2 border-purple-300 hover:border-purple-400',
              dropdown: 'shadow-2xl border-purple-200',
              option: 'hover:bg-purple-50 hover:text-purple-900'
            }"
          >
            <template #option="{ option }">
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    :style="{ backgroundColor: option.color }"
                  >
                    {{ option.name.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-medium">{{ option.name }}</div>
                    <div class="text-sm text-gray-500">{{ option.category }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-bold text-green-600">${{ option.price }}</div>
                  <div class="text-xs text-gray-400">{{ option.stock }} in stock</div>
                </div>
              </div>
            </template>
            <template #selected="{ item }">
              <div class="flex items-center space-x-2">
                <div
                  class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  :style="{ backgroundColor: item.color }"
                >
                  {{ item.name.charAt(0) }}
                </div>
                <span>{{ item.name }} - ${{ item.price }}</span>
              </div>
            </template>
          </DynamicSelector>
          <div class="text-sm text-gray-600">
            <strong>Selected Product:</strong>
            {{
              selectedProduct
                ? `${selectedProduct.name} - $${selectedProduct.price} (${selectedProduct.stock} in stock)`
                : "None"
            }}
          </div>
        </div>
      </div>

      <!-- Countries with Flags -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">🌎 Countries with Custom Display</h2>
        <div class="space-y-4">
          <DynamicSelector
            v-model="selectedCountry"
            :options="countries"
            placeholder="Select a country..."
            display-key="name"
            value-key="code"
            searchable
          >
            <template #option="{ option }">
              <div class="flex items-center space-x-3">
                <span class="text-2xl">{{ option.flag }}</span>
                <div>
                  <div class="font-medium">{{ option.name }}</div>
                  <div class="text-sm text-gray-500">
                    {{ option.continent }} • {{ option.population.toLocaleString() }} people
                  </div>
                </div>
              </div>
            </template>
            <template #selected="{ item }">
              <div class="flex items-center space-x-2">
                <span class="text-lg">{{ item.flag }}</span>
                <span>{{ item.name }}</span>
              </div>
            </template>
          </DynamicSelector>
          <div class="text-sm text-gray-600">
            <strong>Selected Country:</strong>
            {{
              selectedCountry
                ? `${selectedCountry.flag} ${selectedCountry.name} (${selectedCountry.continent})`
                : "None"
            }}
          </div>
        </div>
      </div>

      <!-- Skills with Levels -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-semibold mb-4 text-gray-800">💪 Multiple Skills Selection</h2>
        <div class="space-y-4">
          <DynamicSelector
            v-model="selectedSkills"
            :options="skills"
            multiple
            placeholder="Select your skills..."
            display-key="name"
            value-key="id"
            :custom-classes="{
              tag: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0'
            }"
          >
            <template #option="{ option }">
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <div class="text-2xl">{{ option.icon }}</div>
                  <div>
                    <div class="font-medium">{{ option.name }}</div>
                    <div class="text-sm text-gray-500">{{ option.category }}</div>
                  </div>
                </div>
                <div class="flex items-center space-x-1">
                  <div class="text-sm font-medium">{{ option.level }}/5</div>
                  <div class="flex space-x-1">
                    <div
                      v-for="i in 5"
                      :key="i"
                      class="w-2 h-2 rounded-full"
                      :class="i <= option.level ? 'bg-yellow-400' : 'bg-gray-200'"
                    ></div>
                  </div>
                </div>
              </div>
            </template>
          </DynamicSelector>
          <div class="text-sm text-gray-600">
            <strong>Selected Skills:</strong>
            <span v-if="selectedSkills.length === 0">None</span>
            <div v-else class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div
                v-for="skill in selectedSkills"
                :key="skill.id"
                class="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <div class="flex items-center space-x-2">
                  <span>{{ skill.icon }}</span>
                  <span class="font-medium">{{ skill.name }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <span class="text-sm">{{ skill.level }}/5</span>
                  <div class="flex space-x-1">
                    <div
                      v-for="i in 5"
                      :key="i"
                      class="w-1.5 h-1.5 rounded-full"
                      :class="i <= skill.level ? 'bg-yellow-400' : 'bg-gray-300'"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Debug Information -->
      <div class="bg-gray-800 text-white rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">🔍 Debug Information</h3>
        <div class="space-y-2 text-sm font-mono">
          <div><strong>Selected User:</strong> {{ JSON.stringify(selectedUser, null, 2) }}</div>
          <div><strong>Selected Tags:</strong> {{ JSON.stringify(selectedTags, null, 2) }}</div>
          <div><strong>Selected City:</strong> {{ JSON.stringify(selectedCity, null, 2) }}</div>
          <div><strong>Selected Product:</strong> {{ JSON.stringify(selectedProduct, null, 2) }}</div>
          <div><strong>Selected Country:</strong> {{ JSON.stringify(selectedCountry, null, 2) }}</div>
          <div><strong>Selected Skills:</strong> {{ JSON.stringify(selectedSkills, null, 2) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import DynamicSelector from "~/components/DynamicSelector.vue";

// Types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface Tag {
  value: string;
  label: string;
  color: string;
}

interface City {
  id: number;
  name: string;
  country: string;
  population: number;
  coordinates: { lat: number; lng: number };
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  color: string;
  description: string;
}

interface Country {
  code: string;
  name: string;
  flag: string;
  continent: string;
  population: number;
  capital: string;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  icon: string;
}

// Reactive state
const selectedUser = ref<User | null>(null);
const selectedTags = ref<Tag[]>([]);
const selectedCity = ref<City | null>(null);
const selectedProduct = ref<Product | null>(null);
const selectedCountry = ref<Country | null>(null);
const selectedSkills = ref<Skill[]>([]);

const isLoadingCities = ref(false);
const cities = ref<City[]>([]);

// Sample data
const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Developer"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Designer"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role: "Product Manager"
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    role: "Marketing Manager"
  },
  {
    id: 5,
    name: "David Brown",
    email: "david.brown@example.com",
    role: "DevOps Engineer"
  }
];

const tags = ref<Tag[]>([
  { value: "frontend", label: "Frontend", color: "#3B82F6" },
  { value: "backend", label: "Backend", color: "#10B981" },
  { value: "mobile", label: "Mobile", color: "#F59E0B" },
  { value: "design", label: "Design", color: "#EF4444" },
  { value: "devops", label: "DevOps", color: "#8B5CF6" },
  { value: "testing", label: "Testing", color: "#06B6D4" },
  { value: "security", label: "Security", color: "#F97316" },
  { value: "ai-ml", label: "AI/ML", color: "#EC4899" }
]);

const products: Product[] = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    price: 2499,
    category: "Laptops",
    stock: 15,
    color: "#1f2937",
    description: "Powerful laptop for professionals"
  },
  {
    id: 2,
    name: "iPhone 15 Pro",
    price: 999,
    category: "Smartphones",
    stock: 32,
    color: "#3b82f6",
    description: "Latest iPhone with advanced features"
  },
  {
    id: 3,
    name: "AirPods Pro",
    price: 249,
    category: "Audio",
    stock: 48,
    color: "#10b981",
    description: "Premium wireless earbuds"
  },
  {
    id: 4,
    name: "iPad Air",
    price: 599,
    category: "Tablets",
    stock: 23,
    color: "#f59e0b",
    description: "Versatile tablet for work and play"
  },
  {
    id: 5,
    name: "Apple Watch Ultra",
    price: 799,
    category: "Wearables",
    stock: 12,
    color: "#ef4444",
    description: "Advanced smartwatch for athletes"
  }
];

const countries: Country[] = [
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    continent: "North America",
    population: 331900000,
    capital: "Washington, D.C."
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    continent: "North America",
    population: 38000000,
    capital: "Ottawa"
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    continent: "Europe",
    population: 67000000,
    capital: "London"
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    continent: "Europe",
    population: 83000000,
    capital: "Berlin"
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    continent: "Europe",
    population: 68000000,
    capital: "Paris"
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    continent: "Asia",
    population: 125000000,
    capital: "Tokyo"
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    continent: "Oceania",
    population: 26000000,
    capital: "Canberra"
  },
  {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    continent: "South America",
    population: 215000000,
    capital: "Brasília"
  }
];

const skills: Skill[] = [
  { id: 1, name: "JavaScript", category: "Programming", level: 5, icon: "⚡" },
  { id: 2, name: "TypeScript", category: "Programming", level: 4, icon: "🔷" },
  { id: 3, name: "Vue.js", category: "Frontend", level: 5, icon: "💚" },
  { id: 4, name: "React", category: "Frontend", level: 4, icon: "⚛️" },
  { id: 5, name: "Node.js", category: "Backend", level: 4, icon: "🟢" },
  { id: 6, name: "Python", category: "Programming", level: 3, icon: "🐍" },
  { id: 7, name: "Docker", category: "DevOps", level: 3, icon: "🐳" },
  { id: 8, name: "AWS", category: "Cloud", level: 3, icon: "☁️" },
  { id: 9, name: "GraphQL", category: "API", level: 2, icon: "🔗" },
  { id: 10, name: "MongoDB", category: "Database", level: 4, icon: "🍃" },
  { id: 11, name: "PostgreSQL", category: "Database", level: 4, icon: "🐘" },
  { id: 12, name: "Figma", category: "Design", level: 3, icon: "🎨" }
];

// All cities data for search
const allCities: City[] = [
  {
    id: 1,
    name: "New York",
    country: "United States",
    population: 8336817,
    coordinates: { lat: 40.7128, lng: -74.006 }
  },
  {
    id: 2,
    name: "Los Angeles",
    country: "United States",
    population: 3979576,
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },
  {
    id: 3,
    name: "London",
    country: "United Kingdom",
    population: 9648110,
    coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  { id: 4, name: "Paris", country: "France", population: 2161000, coordinates: { lat: 48.8566, lng: 2.3522 } },
  { id: 5, name: "Tokyo", country: "Japan", population: 13960000, coordinates: { lat: 35.6762, lng: 139.6503 } },
  { id: 6, name: "Berlin", country: "Germany", population: 3669491, coordinates: { lat: 52.52, lng: 13.405 } },
  { id: 7, name: "Sydney", country: "Australia", population: 5312163, coordinates: { lat: -33.8688, lng: 151.2093 } },
  { id: 8, name: "Toronto", country: "Canada", population: 2930000, coordinates: { lat: 43.6532, lng: -79.3832 } },
  { id: 9, name: "Barcelona", country: "Spain", population: 1620343, coordinates: { lat: 41.3851, lng: 2.1734 } },
  { id: 10, name: "Amsterdam", country: "Netherlands", population: 872680, coordinates: { lat: 52.3676, lng: 4.9041 } },
  { id: 11, name: "Singapore", country: "Singapore", population: 5850342, coordinates: { lat: 1.3521, lng: 103.8198 } },
  { id: 12, name: "Dubai", country: "UAE", population: 3400000, coordinates: { lat: 25.2048, lng: 55.2708 } }
];

// Methods
const handleCreateTag = (value: string) => {
  const newTag: Tag = {
    value: value.toLowerCase().replace(/\s+/g, "-"),
    label: value,
    color: "#6B7280"
  };
  tags.value.push(newTag);
  selectedTags.value.push(newTag);
};

const handleCitySearch = async (query: string) => {
  isLoadingCities.value = true;

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (query.length === 0) {
    cities.value = allCities.slice(0, 5); // Show first 5 cities by default
  } else {
    cities.value = allCities.filter(
      (city) =>
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.country.toLowerCase().includes(query.toLowerCase())
    );
  }

  isLoadingCities.value = false;
};

// Initialize cities with some default options
cities.value = allCities.slice(0, 5);
</script>
