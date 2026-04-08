<template>
  <div class="group">
    <div :class="{ selected }" class="group_picker_group_container">
      <!-- Expand / collapse button -->
      <ChevronRightIcon
        v-if="!empty"
        class="group_picker_expand_button"
        :class="{ chevron_open: open }"
        @click.stop="toggleNode"
      />
      <MinusIcon v-else class="group_picker_cannot_expand" />

      <div
        class="group_picker_name_container"
        @click.stop="emit('selection', group)"
      >
        <img
          v-if="group.avatar_src"
          class="group_picker_avatar"
          :src="group.avatar_src"
          alt=""
        />
        <AccountMultipleIcon v-else class="group_picker_avatar" />
        <span>{{ group.name || "Unnamed group" }}</span>
      </div>

      <!-- Link to the group page -->
      <a
        v-if="groupManagerFrontUrl"
        :href="`${groupManagerFrontUrl}/groups/${groupId}`"
        @click.stop
      >
        <OpenInNewIcon />
      </a>
    </div>

    <!-- Children groups -->
    <div v-if="open" class="children_container">
      <template v-if="!loading && !error">
        <Group
          v-for="(child, idx) in children"
          :key="`${groupId}_child_${idx}`"
          :group="child"
          :groupsOfUser="groupsOfUser"
          :selectedGroupId="selectedGroupId"
          :groupManagerApiUrl="groupManagerApiUrl"
          :groupManagerFrontUrl="groupManagerFrontUrl"
          :accessToken="accessToken"
          @selection="emit('selection', $event)"
        />
      </template>

      <Loader v-if="loading && !error" class="group_picker_loader" />

      <div v-if="error" class="group_picker_error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import Loader from "../Loader.vue";
import { useFetch } from "../../composables/useAuth";
import AccountMultipleIcon from "vue-material-design-icons/AccountMultiple.vue";
import ChevronRightIcon from "vue-material-design-icons/ChevronRight.vue";
import MinusIcon from "vue-material-design-icons/Minus.vue";
import OpenInNewIcon from "vue-material-design-icons/OpenInNew.vue";
import { GroupItem } from "../../types";

const props = withDefaults(
  defineProps<{
    group: GroupItem;
    groupsOfUser: GroupItem[];
    selectedGroupId?: string | null;
    accessToken?: string | null;
    groupManagerApiUrl?: string;
    groupManagerFrontUrl?: string;
  }>(),
  {
    selectedGroupId: null,
    accessToken: null,
    groupManagerApiUrl: undefined,
    groupManagerFrontUrl: undefined,
  },
);

const emit = defineEmits<{
  (e: "selection", group: GroupItem): void;
}>();

const open = ref(false);
const children = ref<GroupItem[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const empty = ref(false);

const groupId = computed(() => props.group._id);
const selected = computed(() => groupId.value === props.selectedGroupId);

function openNode() {
  open.value = true;
  loading.value = true;
  error.value = null;

  const url = `${props.groupManagerApiUrl}/v3/groups/${groupId.value}/groups`;

  useFetch(url, { direct: true }, props.accessToken)
    .then(({ data }) => {
      children.value = data.items;
      if (!data.count) empty.value = true;
    })
    .catch(() => {
      error.value = "Error";
    })
    .finally(() => {
      loading.value = false;
    });
}

function closeNode() {
  open.value = false;
}

function toggleNode() {
  open.value ? closeNode() : openNode();
}

function autoOpen() {
  if (
    props.groupsOfUser?.length &&
    props.groupsOfUser.some(({ _id }) => _id === groupId.value)
  ) {
    openNode();
  }
}

onMounted(autoOpen);
</script>

<style scoped>
.group {
  margin: 0.25em 0;
}

.selected {
  background-color: #88888888;
}

.group_picker_expand_button:hover {
  color: #c00000;
}

.group_picker_group_container {
  cursor: pointer;
}

a {
  opacity: 0;
  text-decoration: none;
  color: currentColor;
  transition:
    color 0.25s,
    opacity 0.25s;
}

a:hover {
  color: #c00000;
}

.group_picker_group_container:hover a {
  opacity: 1;
}

.children_container {
  padding-left: 1em;
  margin-left: 1.25em;
  border-left: 2px solid #cccccc;
}

.chevron_open {
  transform: rotate(90deg);
}
</style>
