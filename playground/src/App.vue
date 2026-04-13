<template>
  <div style="max-width: 600px; margin: 2rem auto; font-family: sans-serif">
    <h1>group-manager-vue-picker playground</h1>

    <!-- ── Config panel ───────────────────────────────────── -->
    <section style="margin-bottom: 1.5rem">
      <h2>Configuration</h2>

      <label>
        API URL
        <input v-model="apiUrl" style="width: 100%; margin-top: 0.25rem" />
      </label>

      <label style="display: block; margin-top: 0.75rem">
        Front URL
        <input v-model="frontUrl" style="width: 100%; margin-top: 0.25rem" />
      </label>

      <label style="display: block; margin-top: 0.75rem">
        Access token
        <input v-model="accessToken" style="width: 100%; margin-top: 0.25rem" />
      </label>

      <div style="display: flex; gap: 1rem; margin-top: 0.75rem">
        <label>
          <input type="checkbox" v-model="usersWithNoGroup" />
          Users with no group
        </label>
        <label>
          <input type="checkbox" v-model="distinguishOfficialGroups" />
          Distinguish official groups
        </label>
      </div>
    </section>

    <!-- ── Tabs ───────────────────────────────────────────── -->
    <div style="display: flex; gap: 1rem; margin-bottom: 1rem">
      <button
        :style="tabStyle(activeTab === 'group')"
        @click="activeTab = 'group'"
      >
        Group Picker
      </button>
      <button
        :style="tabStyle(activeTab === 'user')"
        @click="activeTab = 'user'"
      >
        User Picker
      </button>
    </div>

    <!-- ── Selection result ───────────────────────────────── -->
    <section
      v-if="lastSelection"
      style="margin-bottom: 1rem; padding: 0.5rem; background: #f0f0f0"
    >
      <strong>Last selection:</strong>
      <code>{{ JSON.stringify(lastSelection) }}</code>
    </section>

    <!-- ── Dynamic component ─────────────────────────────── -->
    <component
      :is="activeTabComponent"
      :key="componentKey"
      style="height: 500px"
      :groupManagerApiUrl="apiUrl"
      :groupManagerFrontUrl="frontUrl || undefined"
      :userManagerFrontUrl="frontUrl || undefined"
      :accessToken="accessToken || null"
      :selectedGroupId="selectedGroupId"
      :usersWithNoGroup="usersWithNoGroup"
      :distinguishOfficialGroups="distinguishOfficialGroups"
      @selection="onSelection"
    />

    <!-- ── Pre-selected group ────────────────────────────── -->
    <section style="margin-top: 1.5rem">
      <h2>Pre-selected group ID</h2>
      <input
        v-model="selectedGroupId"
        placeholder="Paste a group _id"
        style="width: 100%"
      />
    </section>

    <!-- ── Loader demo ───────────────────────────────────── -->
    <section style="margin-top: 1.5rem">
      <h2>Loader</h2>
      <div style="display: flex; gap: 1rem; align-items: center">
        <Loader />
        <Loader message="Loading…" />
        <Loader :blinking="false" message="No blink" />
        <Loader>Slot content</Loader>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  GroupPicker,
  Loader,
  UserPicker,
  type GroupItem,
} from "group_manager_vue_picker";

// ── State ───────────────────────────────────────────────
const activeTab = ref<"group" | "user">("group");

const apiUrl = ref("");
const frontUrl = ref("");
const accessToken = ref("");
const usersWithNoGroup = ref(true);
const distinguishOfficialGroups = ref(true);

const selectedGroupId = ref<string | null>(null);
const lastSelection = ref<any>(null);

// ── Dynamic component switch ────────────────────────────
const activeTabComponent = computed(() => {
  return activeTab.value === "group" ? GroupPicker : UserPicker;
});

const componentKey = computed(() =>
  JSON.stringify({
    apiUrl: apiUrl.value,
    frontUrl: frontUrl.value,
    accessToken: accessToken.value,
    usersWithNoGroup: usersWithNoGroup.value,
    distinguishOfficialGroups: distinguishOfficialGroups.value,
  }),
);

// ── Handlers ────────────────────────────────────────────
function onSelection(payload: any) {
  lastSelection.value = payload;

  // Only GroupPicker updates selectedGroupId
  if (payload?._id) {
    selectedGroupId.value = payload._id;
  }
}

// ── Styles ─────────────────────────────────────────────
function tabStyle(active: boolean) {
  return {
    padding: "0.5rem 1rem",
    cursor: "pointer",
    border: "1px solid #ccc",
    background: active ? "#ddd" : "#f5f5f5",
  };
}
</script>
