// Prototype-only Tauri entrypoint. No plugins, updater, shell access, or production packaging.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("failed to run Codex Visual Office Tauri prototype");
}
