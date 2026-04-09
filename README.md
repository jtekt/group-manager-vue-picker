# Vue Group & User Picker (Vue 3)

[![npm version](https://badge.fury.io/js/group_manager_vue_picker.svg)](https://badge.fury.io/js/group_manager_vue_picker)

A Vue 3 + TypeScript component library that provides **GroupPicker** and **UserPicker** components for selecting groups and users from an API.

## ✨ Background

In Vue 2, this functionality was split into two separate packages:

- `@moreillon/vue_group_picker`
- `@moreillon/vue_user_picker`

After migrating to Vue 3, both have been **merged into a single package** to:

- simplify installation
- unify API design
- share internal logic (fetching, auth, composables)
- improve maintainability

👉 Despite the merge, **usage remains very similar**, so migrating from Vue 2 should feel familiar.

## 📦 Installation

```bash
npm install group_manager_vue_picker
```

## 🚀 Usage

### Import components

```ts
import { GroupPicker, UserPicker, Loader } from "group_manager_vue_picker";
```

## 🧩 GroupPicker

### Basic Example

```vue
<template>
  <GroupPicker
    :groupManagerApiUrl="apiUrl"
    :groupManagerFrontUrl="frontUrl"
    :accessToken="accessToken"
    @selection="onSelection"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GroupPicker, type GroupItem } from "group_manager_vue_picker";

const apiUrl = ref("https://api.example.com");
const frontUrl = ref("https://frontend.example.com");
const accessToken = ref<string | null>(null);

function onSelection(group: GroupItem) {
  console.log("Selected group:", group);
}
</script>
```

### Props

| Prop                        | Type             | Description                    |
| --------------------------- | ---------------- | ------------------------------ |
| `groupManagerApiUrl`        | `string`         | API base URL                   |
| `groupManagerFrontUrl`      | `string`         | Frontend URL (for links)       |
| `accessToken`               | `string \| null` | Bearer token                   |
| `selectedGroupId`           | `string \| null` | Pre-selected group             |
| `usersWithNoGroup`          | `boolean`        | Show "users with no group"     |
| `distinguishOfficialGroups` | `boolean`        | Separate official/non-official |

### Emits

| Event       | Payload     |
| ----------- | ----------- |
| `selection` | `GroupItem` |

## 👤 UserPicker

### Basic Example

```vue
<template>
  <UserPicker
    :groupManagerApiUrl="apiUrl"
    :userManagerFrontUrl="frontUrl"
    :accessToken="accessToken"
    @selection="onUser"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { UserPicker } from "group_manager_vue_picker";

const apiUrl = ref("https://api.example.com");
const frontUrl = ref("https://frontend.example.com");
const accessToken = ref<string | null>(null);

function onUser(user: any) {
  console.log("Selected user:", user);
}
</script>
```

### How it works

`UserPicker` internally uses `GroupPicker`:

1. User selects a group
2. Users are fetched from:

   ```
   /v3/groups/{group_id}/members
   ```

3. A searchable user list is displayed

### Props

| Prop                   | Type             | Description        |
| ---------------------- | ---------------- | ------------------ |
| `groupManagerApiUrl`   | `string`         | API base URL       |
| `groupManagerFrontUrl` | `string`         | Group frontend URL |
| `userManagerFrontUrl`  | `string`         | User frontend URL  |
| `accessToken`          | `string \| null` | Bearer token       |

### Emits

| Event       | Payload |
| ----------- | ------- |
| `selection` | `User`  |

## 🧪 Playground

A playground app is included for testing:

- Configure API URL, token, and options
- Switch between GroupPicker and UserPicker
- Inspect selection results

---

## 🧱 Included Components

- `GroupPicker`
- `UserPicker`
- `Loader`
