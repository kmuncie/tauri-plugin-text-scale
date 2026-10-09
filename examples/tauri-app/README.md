# Text Scale Example App

This example Tauri app exercises the local `@silvermine/tauri-plugin-text-scale` package
through a path dependency.

## Run

1. Build the plugin's JavaScript bindings in the repository root:

   ```sh
   npm install
   npm run build
   ```

2. Install the example's dependencies:

   ```sh
   cd examples/tauri-app
   npm install
   ```

3. Start the example:

   ```sh
   npm run dev
   ```

The app shows the current text scale and a sample line at 16px times the scale. Change
the operating system text size while the app runs. The app adds each change that
the plugin reports to the list of changes, with the time it arrived.
