<!-- @format -->

# Changelog for Magnifique, 2^nd^ built version

[TOC]

<!-- Update. -->

## v2.0.0

> toolchain:
>
> 1. `Vite` with `Vue` to build front end, which includes `element-plus` for surface, `v-md-editor` for editor, and so on.
> 2. `Koa` and `Socket.io` based on `node.js` to build server.
> 3. `Electron` for the server suface GUI rendering.
> 4. `tauri` with `Rust` for client(imaging).

### Features in v2.0.0

1. Add dark mode through [element-plus](https://staging.element-plus.org/zh-CN/guide/dark-mode.html);
2. Change some button into `text` mode through [element-plus](https://staging.element-plus.org/zh-CN/component/button.html#text-button);
3. The member [tree](https://staging.element-plus.org/zh-CN/component/tree.html);
4. The draggable function for member [tree](https://staging.element-plus.org/zh-CN/component/tree.html#%E5%8F%AF%E6%8B%96%E6%8B%BD%E8%8A%82%E7%82%B9);
5. Change login URL when switching the page through [vue-router](https://router.vuejs.org/);
6. Register quick redirect page when the member is `null`;
7. Fastly show the `deductor` and the `violator` in the deduction detail;
8. Auto check whether the login info is marked or not, and decide the disablity for "entrance";
9. Add `magnifique` mark on the right top;
10. Add "Login to Magnifique" text for the home page;
11. Change "Submit" text in class login to "Login";
12. Message page, use `button` instead of `link` to choose the dialog;
13. Deduction page, delete the `callback` function which can replaced by `messages`;
14. Delete feedback page which can replaced by `messages`.

### Fixes in v2.0.0

1. Fix bug that it shows `NaN` when the `admin` adding member;
2. Fix bug that it shows `none` when choosing the position.

### Bug already have known in v2.0.0

1. Cannot post the post;
2. Editor supportion is not good when `dark` mode.

<!-- Update. -->

## v1.0.2

### Features in v1.0.2

1. The member [tree](https://staging.element-plus.org/zh-CN/component/tree.html);
2. File [upload](https://staging.element-plus.org/zh-CN/component/upload.html) in chat;
3. Speech and clipboard for messages;
4. Image auto insertion and upload;
5. Delete flatten part for members;
6. Use 100% size in the drawer of message page;
7. Add keydown event for logining;

::: danger
Update to private repo.
:::
