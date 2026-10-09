const COMMANDS: &[&str] = &["get_text_scale"];

fn main() {
   tauri_plugin::Builder::new(COMMANDS).build();
}
