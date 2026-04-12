<template>
  <div class="user_picker">
    <GroupPicker
      class="picker_container groups_container"
      :selectedGroupId="selectedGroupId"
      :groupManagerApiUrl="groupManagerApiUrl"
      :groupManagerFrontUrl="groupManagerFrontUrl"
      :accessToken="accessToken"
      usersWithNoGroup
      @selection="getUsersOfGroup($event)"
    />

    <div class="picker_container users_container">
      <template v-if="!usersLoading && selectedGroup && !error">
        <div class="search_wrapper">
          <input placeholder="Search users" type="text" v-model="search" />
          <MagnifyIcon class="search" />
        </div>
        <UserList
          :users="filteredUsers"
          :userManagerFrontUrl="userManagerFrontUrl"
          @selection="emit('selection', $event)"
        />
      </template>

      <div
        class="no_selection_wrappper"
        v-if="!usersLoading && !selectedGroup && !error"
      >
        Group not selected
      </div>

      <!-- wrapper loader so it can be centered in the div -->
      <div class="loader_wrapper" v-if="usersLoading && !error">
        <Loader />
      </div>

      <div class="error_wrapper" v-if="!usersLoading && error">
        <span class="error">Error while fetching users</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useFetch } from "../../composables/useAuth";
import UserList from "./UserList.vue";
import GroupPicker from "../Group/GroupPicker.vue";
import Loader from "../Loader.vue";
import MagnifyIcon from "vue-material-design-icons/Magnify.vue";
import { GroupItem, User } from "../../types";

const props = withDefaults(
  defineProps<{
    accessToken?: string | null;
    groupManagerApiUrl?: string;
    groupManagerFrontUrl?: string;
    userManagerFrontUrl?: string;
  }>(),
  {
    accessToken: null,
    groupManagerApiUrl: undefined,
    groupManagerFrontUrl: undefined,
    userManagerFrontUrl: undefined,
  },
);

const emit = defineEmits<{
  (e: "selection", user: User): void;
}>();

const users = ref<User[]>([]);
const usersLoading = ref(false);
const error = ref<string | null>(null);
const selectedGroup = ref<GroupItem | undefined>(undefined);
const search = ref("");

const selectedGroupId = computed(() => selectedGroup.value?._id ?? null);

const filteredUsers = computed(() => {
  if (!search.value) return users.value;

  const keysToCheck: (keyof User)[] = [
    "display_name",
    "name_kanji",
    "name",
    "full_name",
    "username",
    "name_romaji",
    "email_address",
  ];
  const query = search.value.toLowerCase();

  return users.value.filter((user) =>
    keysToCheck.some((key) => {
      const value = user[key];
      return typeof value === "string" && value.toLowerCase().includes(query);
    }),
  );
});

function getUsersOfGroup(group: GroupItem) {
  usersLoading.value = true;
  error.value = null;
  selectedGroup.value = group;

  const url = `${props.groupManagerApiUrl}/v3/groups/${group._id}/members`;

  useFetch(url, { batch_size: -1 }, props.accessToken)
    .then(({ data }) => {
      users.value = data.items;
    })
    .catch((err) => {
      if (err.response) console.error(err.response.data);
      else console.error(err);
      error.value = "Error while fetching users";
    })
    .finally(() => {
      usersLoading.value = false;
    });
}
</script>

<style scoped>
.user_picker {
  display: flex;
  align-items: stretch;
}

.picker_container {
  /* share space horizontally */
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0;

  overflow-y: auto;

  border: 1px solid rgba(128, 128, 128, 0.3);
}

.picker_container:last-child {
  margin: 0;
  margin-left: 0.5em;
}

.loader_wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 200%;
}

.no_selection_wrappper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error_wrapper {
  text-align: center;
  justify-content: center;
  padding: 1em;
}
.error {
  color: #c00000;
}

.search_wrapper {
  display: flex;
  align-items: center;
  margin: 1em 0.5em;
  margin-bottom: 1em;
}

.search_wrapper input {
  background-color: inherit;
  color: inherit;
  margin-right: 0.5em;
  padding: 0.5em 0.25em;
  flex-grow: 1;
  border: none;
  border-bottom: 1px solid #444444;
}

@media screen and (max-width: 600px) {
  .user_picker {
    flex-direction: column;
  }
  .picker_container:last-child {
    margin: 0;
    margin-top: 0.5em;
  }
}
</style>
