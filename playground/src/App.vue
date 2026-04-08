<template>
  <div style="max-width: 600px; margin: 2rem auto; font-family: sans-serif">
    <h1>vue-group-picker playground</h1>

    <!-- ── Config panel ─────────────────────────────────────────── -->
    <section style="margin-bottom: 1.5rem">
      <h2>Configuration</h2>

      <label>
        API URL
        <input v-model="apiUrl" style="width: 100%; margin-top: 0.25rem" />
      </label>

      <label style="display: block; margin-top: 0.75rem">
        Front URL (optional — enables "open in new tab" links)
        <input v-model="frontUrl" style="width: 100%; margin-top: 0.25rem" />
      </label>

      <label style="display: block; margin-top: 0.75rem">
        Access token (optional)
        <input v-model="accessToken" style="width: 100%; margin-top: 0.25rem" />
      </label>

      <div style="display: flex; gap: 1rem; margin-top: 0.75rem">
        <label>
          <input type="checkbox" v-model="usersWithNoGroup" />
          Show "users with no group"
        </label>
        <label>
          <input type="checkbox" v-model="distinguishOfficialGroups" />
          Distinguish official groups
        </label>
      </div>
    </section>

    <!-- ── Selection result ──────────────────────────────────────── -->
    <section
      v-if="lastSelection"
      style="margin-bottom: 1rem; padding: 0.5rem; background: #f0f0f0"
    >
      <strong>Last selection:</strong>
      <code>{{ JSON.stringify(lastSelection) }}</code>
    </section>

    <!-- ── The component under test ─────────────────────────────── -->
    <GroupPicker
      style="height: 500px"
      :groupManagerApiUrl="apiUrl"
      :groupManagerFrontUrl="frontUrl || undefined"
      :accessToken="accessToken || null"
      :selectedGroupId="selectedGroupId"
      :usersWithNoGroup="usersWithNoGroup"
      :distinguishOfficialGroups="distinguishOfficialGroups"
      @selection="onSelection"
    />

    <!-- ── Edge-case: pre-selected group ────────────────────────── -->
    <section style="margin-top: 1.5rem">
      <h2>Pre-selected group ID</h2>
      <input
        v-model="selectedGroupId"
        placeholder="Paste a group _id here to pre-select it"
        style="width: 100%"
      />
    </section>

    <!-- ── Loader component demo ─────────────────────────────────── -->
    <section style="margin-top: 1.5rem">
      <h2>Loader component</h2>
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
import { ref } from "vue";
import { GroupPicker, Loader, type GroupItem } from "group_manager_vue_picker";

const apiUrl = ref("");
const frontUrl = ref("");
const accessToken = ref("");
const usersWithNoGroup = ref(true);
const distinguishOfficialGroups = ref(true);
const selectedGroupId = ref<string | null>(null);
const lastSelection = ref<GroupItem | null>(null);

function onSelection(group: GroupItem) {
  lastSelection.value = group;
  selectedGroupId.value = group._id;
}
</script>
