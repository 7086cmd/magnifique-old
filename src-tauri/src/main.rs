#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem};

fn main() {
  // let quit = CustomMenuItem::new("quit".to_string(), "退出");
  // let hide = CustomMenuItem::new("hide".to_string(), "隐藏");
  // let tray_menu = SystemTrayMenu::new()
  //   .add_item(quit)
  //   .add_native_item(SystemTrayMenuItem::Separator)
  //   .add_item(hide);
  tauri::Builder::default()
    // .create_window("main-window".to_string(), "http://localhost:3000/".to_string())
    // .setup(|app| {
    //   let window = app.get_window("main-window".to_string()).unwrap()
    //   let window_ = window.clone()
    // })
    // .system_tray(SystemTray::new().with_menu(tray_menu))
    // .on_system_tray_event(|app, event| match event {
    //   SystemTrayEvent::MenuItemClick { id, .. } => {
    //     // get a handle to the clicked menu item
    //     // note that `tray_handle` can be called anywhere,
    //     // just get a `AppHandle` instance with `app.handle()` on the setup hook
    //     // and move it to another function or thread
    //     let item_handle = app.tray_handle().get_item(&id);
    //     match id.as_str() {
    //       "hide" => {
    //         let window = app.get_window("main").unwrap();
    //         window.hide().unwrap();
    //         // you can also `set_selected`, `set_enabled` and `set_native_image` (macOS only).
    //         item_handle.set_title("Show").unwrap();
    //       }
    //       _ => {}
    //     }
    //   }
    //   _ => {}
    // })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
