<template>
  <div class="group_picker">
    <!-- Official groups -->
    <template v-if="distinguishOfficialGroups">
      <div class="category_title">Official groups</div>
      <template v-if="!officialGroupsLoading && officialGroups.length">
        <Group
          v-for="(group, index) in officialGroups"
          :key="`official_${index}`"
          :group="group"
          :selectedGroupId="selectedGroupId"
          :groupsOfUser="groupsOfUser"
          :groupManagerApiUrl="groupManagerApiUrl"
          :groupManagerFrontUrl="groupManagerFrontUrl"
          :accessToken="accessToken"
          @selection="emit('selection', $event)"
        />
      </template>
      <Loader v-if="officialGroupsLoading" />
      <div v-if="officialGroupsError" class="group_picker_error">
        Error loading groups
      </div>

      <!-- Non-official groups -->
      <div class="category_title">Non-official groups</div>
      <template v-if="!nonOfficialGroupsLoading && nonOfficialGroups.length">
        <Group
          v-for="(group, index) in nonOfficialGroups"
          :key="`nonofficial_${index}`"
          :group="group"
          :selectedGroupId="selectedGroupId"
          :groupsOfUser="groupsOfUser"
          :groupManagerApiUrl="groupManagerApiUrl"
          :groupManagerFrontUrl="groupManagerFrontUrl"
          :accessToken="accessToken"
          @selection="emit('selection', $event)"
        />
      </template>
      <Loader v-if="nonOfficialGroupsLoading" />
      <div v-if="nonOfficialGroupsError" class="group_picker_error">
        Error loading groups
      </div>
    </template>

    <!-- All groups (flat) -->
    <template v-else>
      <div class="category_title">All groups</div>
      <template v-if="!allGroupsLoading && allGroups.length">
        <Group
          v-for="(group, index) in allGroups"
          :key="`all_${index}`"
          :group="group"
          :selectedGroupId="selectedGroupId"
          :groupsOfUser="groupsOfUser"
          :groupManagerApiUrl="groupManagerApiUrl"
          :groupManagerFrontUrl="groupManagerFrontUrl"
          :accessToken="accessToken"
          @selection="emit('selection', $event)"
        />
      </template>
      <Loader v-if="allGroupsLoading" />
      <div v-if="allGroupsError" class="group_picker_error">
        Error loading groups
      </div>
    </template>

    <!-- Users with no group -->
    <template v-if="usersWithNoGroup">
      <div class="category_title">Other</div>
      <div class="group_picker_group_container">
        <div class="group_picker_cannot_expand" />
        <div
          class="group_picker_name_container"
          @click="emit('selection', { _id: 'none' })"
        >
          <AccountMultipleIcon class="icon" />
          <span>Users with no group</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Group from "./Group.vue";
import Loader from "../Loader.vue";
import { useFetch } from "../../composables/useAuth";
import AccountMultipleIcon from "vue-material-design-icons/AccountMultiple.vue";
import { GroupItem } from "../../types";

const props = withDefaults(
  defineProps<{
    selectedGroupId?: string | null;
    accessToken?: string | null;
    groupManagerApiUrl?: string;
    groupManagerFrontUrl?: string;
    usersWithNoGroup?: boolean;
    distinguishOfficialGroups?: boolean;
  }>(),
  {
    selectedGroupId: null,
    accessToken: null,
    groupManagerApiUrl: undefined,
    groupManagerFrontUrl: undefined,
    usersWithNoGroup: true,
    distinguishOfficialGroups: true,
  },
);

const emit = defineEmits<{
  (e: "selection", group: GroupItem): void;
}>();

const groupsOfUser = ref<GroupItem[]>([]);

const allGroups = ref<GroupItem[]>([]);
const allGroupsLoading = ref(false);
const allGroupsError = ref<string | null>(null);

const officialGroups = ref<GroupItem[]>([]);
const officialGroupsLoading = ref(false);
const officialGroupsError = ref<string | null>(null);

const nonOfficialGroups = ref<GroupItem[]>([]);
const nonOfficialGroupsLoading = ref(false);
const nonOfficialGroupsError = ref<string | null>(null);

function fetchGroups(
  params: Record<string, unknown>,
  target: typeof allGroups,
  loadingFlag: typeof allGroupsLoading,
  errorFlag: typeof allGroupsError,
) {
  loadingFlag.value = true;
  const url = `${props.groupManagerApiUrl}/v3/groups`;
  useFetch(url, params, props.accessToken)
    .then(({ data }) => {
      target.value = data.items;
    })
    .catch((err) => {
      console.error(err);
      errorFlag.value = "Error";
    })
    .finally(() => {
      loadingFlag.value = false;
    });
}

function loadGroups() {
  if (props.distinguishOfficialGroups) {
    fetchGroups(
      { shallow: true, official: true },
      officialGroups,
      officialGroupsLoading,
      officialGroupsError,
    );
    fetchGroups(
      { shallow: true, nonofficial: true },
      nonOfficialGroups,
      nonOfficialGroupsLoading,
      nonOfficialGroupsError,
    );
  } else {
    fetchGroups({ shallow: true }, allGroups, allGroupsLoading, allGroupsError);
  }
}

onMounted(() => {
  const url = `${props.groupManagerApiUrl}/v3/members/self/groups`;
  useFetch(url, {}, props.accessToken)
    .then(({ data }) => {
      groupsOfUser.value = data.items;
    })
    .catch(() => {
      console.error("Group picker failed to query groups of user");
    })
    .finally(loadGroups);
});
</script>

<style scoped>
.group_picker {
  overflow-y: auto;
  padding: 0.5em;
  border: 1px solid rgba(128, 128, 128, 0.3);
}

.category_title {
  font-weight: bold;
  margin: 0.75em 0;
}
</style>

<style>
/* Global styles required by nested Group components */

.group_picker_error {
  color: #c00000;
}

.group_picker_name_container {
  display: flex;
  align-items: center;
  gap: 0.5em;

  flex-grow: 1;

  /* What color? */
  transition: color 0.25s;

  white-space: nowrap;
  overflow: hidden;

  /* Ellipsis does not work because of flex */
  text-overflow: ellipsis;

  cursor: pointer;
  transition: background-color 0.25s;
}

.group_picker_group_container {
  display: flex;
  align-items: center;
  gap: 0.5em;
  transition: background-color 0.25s;
}

.group_picker_group_container:hover {
  background-color: #88888888;
}

.group_picker .material-design-icon {
  display: flex;
  align-items: center;
}

.group_picker_avatar {
  height: 1.5em;
  width: 1.5em;
  object-fit: contain;
}

.group_picker_expand_button,
.group_picker_cannot_expand,
.group_picker_loader {
  height: 1.5em;
  width: 1.5em;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.group_picker_expand_button {
  cursor: pointer;
  display: flex;
  transition:
    transform 0.25s,
    color 0.25s;
}
</style>
