import { Code2,Layout,Server,Smartphone } from "lucide-react";
import mermaid from "mermaid";
import TurboModuleMd from "../md/turbomodule.md?raw";

// --- MOCK DATA ---
// ------------------------------------------------------------------
// 1. DATA STORE (Enhanced with Markdown Content)
// ------------------------------------------------------------------

export const CURRICULUM_DATA = [
    
  {
    id: "track-native-prod",
    title: "React Native & Expo Architecture",
    description: "Master the New Architecture (Fabric/TurboModules), Expo Router, and native module integration.",
    icon: Smartphone,
    level: "Expert",
    totalDuration: "18h 30m",
    modules: [
        {
            id: "mod-rn-arch",
            title: "The New Architecture",
            duration: "2h 15m",
            lessons: [
              { 
                id: "les-bridge-jsi", 
                title: "The Bridge vs JSI", 
                duration: "20 min read", 
                type: "architecture", 
content: `
# Architectural Evolution: Bridge vs JSI

React Native is undergoing its most significant architectural shift since its inception. To master the modern stack, one must understand the bottleneck of the past (The Bridge) and the power of the future (JSI).

## 1. Legacy Architecture: The Asynchronous Bridge

For years, React Native operated on a split-thread model. The JavaScript code lived in its own "realm," and the Native code (Objective-C/Java) lived in another. They communicated via the **Bridge**.

### The Bottle-neck
Imagine the Bridge as a single-lane highway between two cities.
1.  **Serialization**: To send data (e.g., a touch event or a layout calculation), it had to be converted to JSON strings.
2.  **Asynchronous Queue**: Messages were batched and sent across the bridge asynchronously.
3.  **The Consequence**: If the bridge got clogged (e.g., during rapid scroll events or complex animations), the UI would "stutter" or flash because the JS thread couldn't keep up with the Native thread.

\`\`\`mermaid
graph LR
    subgraph JS Realm
    A[JavaScript Thread]
    end
    
    subgraph Native Realm
    C[Native UI/Modules]
    end

    A -- "JSON Message (Async)" --> B{The Bridge}
    B -- "JSON Message (Async)" --> C
    C -- "Response" --> B
    B -- "Response" --> A
\`\`\`

---

## 2. Modern Architecture: JSI (JavaScript Interface)

**JSI** (JavaScript Interface) eliminates the bridge entirely. It is a general-purpose API that allows the JavaScript engine (like Hermes) to invoke methods on C++ Host Objects directly.

### How it Works
JSI allows JavaScript to hold a **reference** to a C++ object (Host Object). When you call a method on this object in JS, it executes the C++ code **synchronously** and **instantly**, sharing the same memory.

### Code Example: JSI Binding
This C++ code exposes a native function \`nativeMultiply\` directly to the global JavaScript scope. No JSON required.

\`\`\`cpp
// C++ (JSI Module)
void install(jsi::Runtime& runtime) {
  auto func = jsi::Function::createFromHostFunction(
    runtime,
    jsi::PropNameID::forAscii(runtime, "nativeMultiply"),
    2, // Number of arguments
    [](jsi::Runtime& runtime, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
      double a = arguments[0].asNumber();
      double b = arguments[1].asNumber();
      return a * b; // Direct memory access
    }
  );
  
  // Inject into global JS object
  runtime.global().setProperty(runtime, "nativeMultiply", func);
}
\`\`\`

---

## 3. Comparative Analysis

| Feature | The Old Bridge | JSI (New Architecture) |
| :--- | :--- | :--- |
| **Communication** | Asynchronous (Messages) | Synchronous (Direct Calls) |
| **Data Transfer** | Serialized JSON (Slow) | Shared Memory (Instant) |
| **Type Safety** | None (Runtime errors) | Strong (C++ Static Analysis) |
| **Interoperability** | Limited to Native Modules | Can talk to any C++ library |

> **Pro Tip**: Libraries like **react-native-reanimated** and **react-native-mmkv** use JSI to achieve performance that rivals native Swift/Kotlin apps. They bypass the bridge completely to drive animations and storage operations at 60fps.
`},
              { 
                id: "les-fabric", 
                title: "Fabric Renderer Lifecycle", 
                duration: "25 min read", 
                type: "concept", 
                content: `
# Fabric Renderer: The C++ Core

**Fabric** is the evolution of the React Native rendering system. It is not just an optimization; it is a complete rewrite of the UI layer that moves the rendering logic from platform-specific code (Java/Objective-C) into a shared **C++ core**.

## 1. The Architecture Shift

In the legacy architecture, the "Shadow Thread" (where layout is calculated) was separate from the UI Thread. This required asynchronous communication over the Bridge, leading to frame drops during complex UI updates.

**Fabric unifies this.** By using C++, Fabric allows:
1.  **Shared Ownership:** The C++ core holds the "truth" of the UI state.
2.  **Synchronous Execution:** JS can now drive UI updates synchronously (critical for lists and gestures).
3.  **Multi-threading:** Rendering can happen on any thread, freeing up the main UI thread.

---

## 2. The Three Trees (The Render Pipeline)

To understand Fabric, you must visualize how a \`<View />\` becomes a pixel on the screen. It involves three distinct tree structures transforming data.

\`\`\`mermaid
graph TD
    A[1. React Element Tree] -->|Render Phase| B(2. React Shadow Tree)
    B -->|Commit Phase| C{Layout Calculation}
    C -->|Yoga Engine| B
    B -->|Mount Phase| D[3. Host View Tree]
    
   
\`\`\`

### A. The React Element Tree (JavaScript)
This is what you write. It's a pure description of the UI based on state and props.
- **Location**: JavaScript Thread.
- **Behavior**: Same as React for the web.

### B. The React Shadow Tree (C++)
This is the "Brain" of Fabric. When you render, Fabric creates a mutable C++ structure called the **Shadow Tree**.
- **The Shadow Node**: Each React Element has a corresponding C++ Shadow Node containing style and prop data.
- **Yoga Integration**: Fabric uses **Yoga** (a C++ Flexbox engine) to calculate the exact X, Y, Width, and Height of every node *before* it touches the native side.
- **Immutability**: Once layout is calculated, the tree is frozen and committed.

### C. The Host View Tree (Native)
This is the actual Android \`ViewGroup\` or iOS \`UIView\`.
- **Mounting**: Fabric generates a list of "mutations" (e.g., "Create View", "Update Opacity") and executes them on the Native UI thread.
- **Lazy Mounting**: Fabric only creates native views for nodes currently on screen, reducing memory usage significantly.

---

## 3. The Power of Synchronous Layout

In the old architecture, layout was always asynchronous. This caused the "Jump" or "White Flash" issue when loading new screens, as the UI would render *before* data arrived.

**With Fabric:**
1.  React schedules a render.
2.  Fabric constructs the Shadow Tree.
3.  Yoga calculates layout synchronously in C++.
4.  The frame is painted to the UI.

All of this can happen in a **single tick** of the run loop.

> **Production Insight**: This architecture enables libraries like **React Native Skia** and **Reanimated** to perform complex UI operations (like shared element transitions) at 120fps by bypassing the old asynchronous constraints completely.
` 
              },
              { id: "les-turbomodules", title: "TurboModules & Lazy Loading", duration: "30 min read", type: "guide", 
                content: `
# TurboModules: The Evolution of Native Integration

**TurboModules** represents the next generation of Native Modules in React Native. They leverage the JSI (JavaScript Interface) to allow for lazy loading, strictly typed interfaces, and direct C++ communication.

## 1. The Core Problem: Eager Initialization

In the legacy architecture, **Native Modules** were "eagerly" initialized.
- When the app starts, React Native had to initialize *every single registered native module* (Bluetooth, Camera, Location, Storage, etc.), even if the user didn't need them yet.
- This massively impacted **TTI (Time to Interactive)** and increased startup memory usage.

---

## 2. The Solution: Lazy Loading via JSI

TurboModules are "lazy." They are effectively C++ Host Objects held by the JSI Runtime. They are instantiated only when your JavaScript code actually calls them.

### Initialization Flowchart

\`\`\`mermaid
sequenceDiagram
    participant App
    participant JS as JS Thread
    participant Legacy as Legacy Module
    participant Turbo as TurboModule

    Note over App: App Launch 🚀

    rect rgb(40, 40, 40)
    Note over Legacy: Legacy Behavior (Blocking)
    App->>Legacy: Initialize Camera? (Yes)
    App->>Legacy: Initialize Bluetooth? (Yes)
    App->>Legacy: Initialize FileSystem? (Yes)
    Legacy-->>App: All Ready (Slow Start)
    end

    rect rgb(0, 50, 0)
    Note over Turbo: TurboModule Behavior (Instant)
    App-->>JS: App Ready (Fast!)
    Note over JS: User presses "Scan"
    JS->>Turbo: require('Camera')
    Turbo-->>JS: Initialize Camera (Just-in-Time)
    end
\`\`\`

---

## 3. Codegen & Type Safety

Legacy modules relied on "best effort" communication. If you sent a string to a method expecting a number, the app would crash silently or throw a runtime error.

TurboModules enforce **Static Type Safety** across the JS/Native boundary using **Codegen**.
1.  You define the interface in TypeScript/Flow.
2.  **Codegen** generates C++, Obj-C, and Java scaffolding during the build.
3.  If the native implementation doesn't match the JS spec, the build fails.

### Spec Example (TypeScript)

\`\`\`typescript
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // Synchronous method execution via JSI!
  multiply(a: number, b: number): number;
  
  // Standard Asynchronous method
  captureImage(quality: number): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('CameraModule');
\`\`\`

---

## 4. Production Impact

Adopting TurboModules directly correlates to business metrics:
* **Startup Time**: Drastically reduced (linear reduction based on number of modules).
* **Memory Footprint**: Lower peak memory usage during initialization.
* **Stability**: Type mismatches are caught at compile time, not in production crash logs.
`
               },
            ]
        },
        {
            id: "mod-expo-eco",
            title: "Modern Expo Ecosystem",
            duration: "3h 45m",
            lessons: [
              { 
                id: "les-expo-router", 
                title: "File-based Routing with Expo Router v3", 
                duration: "35 min read", 
                type: "guide", 
content: `
# Expo Router v3: The Next.js for Native

**Expo Router** brings the file-system routing model (popularized by the web) to native mobile apps. It replaces the imperative, boilerplate-heavy API of React Navigation with a declarative, directory-based structure.

## 1. The Paradigm Shift

In traditional React Native, you manually define navigators and screens in a central file.
* **Old Way**: Manual \`createStackNavigator\`, mapping strings to components.
* **New Way**: **Files becomes Screens**. Folders become Navigators.

---

## 2. Directory Structure & Layouts

Your file system *is* your navigation map. The entry point is the \`app/\` directory.

### The \`_layout.tsx\` File
This is the most critical concept. A layout file wraps all child routes in a specific Navigator (Stack, Tabs, or Drawer).

\`\`\`
app/
├── _layout.tsx      <-- Root Navigator (e.g., Stack)
├── index.tsx        <-- Matches "/"
├── (tabs)/          <-- "Group" (doesn't affect URL path)
│   ├── _layout.tsx  <-- Tab Navigator
│   ├── home.tsx     <-- Matches "/home"
│   └── settings.tsx <-- Matches "/settings"
└── user/
    └── [id].tsx     <-- Dynamic Route "/user/123"
\`\`\`

### Example: Defining a Stack Layout

\`\`\`tsx
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
\`\`\`

---

## 3. Dynamic Routing & Parameters

Handling dynamic data is intuitive. Files wrapped in square brackets \`[]\` act as wildcards.

**File**: \`app/user/[id].tsx\`

\`\`\`tsx
import { useLocalSearchParams, Stack } from 'expo-router';
import { Text } from 'react-native';

export default function UserProfile() {
  // Automatically parses the URL parameter
  const { id } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ title: \`User \${id}\` }} />
      <Text>Viewing profile for user: {id}</Text>
    </>
  );
}
\`\`\`

---

## 4. Universal Linking (Deep Links)

One of the biggest advantages of Expo Router is that **Deep Linking works out of the box**.

Because every screen has a URL-like path, you don't need complex mapping configurations.
* **Internal Link**: \`<Link href="/user/123">View Profile</Link>\`
* **External Deep Link**: Opening \`myapp://user/123\` on the device automatically navigates to that screen, passing \`123\` as the \`id\` param.

> **Production Insight**: Expo Router generates **Static Types** for your links. If you typo a route (e.g., \`/userr/123\`), TypeScript will throw an error at compile time, preventing broken navigation bugs in production.
`
              },
              { id: "les-config-plugins", title: "Config Plugins & Prebuild", duration: "25 min read", type: "architecture", 
                content: `
# Config Plugins: The End of Ejecting

In the early days of Expo, if you needed to modify native code (e.g., add a specific permission or a native SDK), you had to **"Eject"**. This was a one-way ticket that removed you from the managed workflow.

**Config Plugins** and **Prebuild** solve this. They allow you to stay in the managed workflow while having full control over native directories.

---

## 1. What is Prebuild?

**Prebuild** is the process of generating the \`android/\` and \`ios/\` directories from scratch using your \`app.json\` and \`package.json\` configurations.

Instead of maintaining fragile native projects in git, you treat them as **build artifacts**. You generate them just before compiling, and you can delete them afterward.

### The Continuous Native Generation Flow

\`\`\`mermaid
graph LR
    A[app.json / app.config.js] --> B(Expo Prebuild)
    C[Config Plugins] --> B
    B --> D{Generates Native Code}
    D --> E[android/ folder]
    D --> F[ios/ folder]
    
 
\`\`\`

---

## 2. What are Config Plugins?

A **Config Plugin** is a JavaScript function that modifies the native configuration (AndroidManifest.xml, Info.plist, build.gradle, Podfile) during the prebuild phase.

Instead of manually editing \`AndroidManifest.xml\` to add a permission, you write a plugin (or use an existing one) to inject that permission every time the app is built.

### Example: Adding Camera Permission

**Without Plugins (The Old Way):**
You open Xcode, find \`Info.plist\`, add the key, and commit the file. If you upgrade React Native, you might get merge conflicts.

**With Plugins (The Modern Way):**
You add it to your config, and it is generated freshly every time.

\`\`\`javascript
// app.config.js
module.exports = {
  expo: {
    plugins: [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera."
        }
      ]
    ]
  }
};
\`\`\`

---

## 3. Writing a Custom Plugin

Sometimes you need to do something bespoke, like changing a specific Android launch attribute. You can write a **Mod** (Modifier).

\`\`\`javascript
const { withAndroidManifest } = require('@expo/config-plugins');

const withCustomLaunchMode = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainActivity = androidManifest.manifest.application[0].activity[0];
    
    // Modify the XML object directly
    mainActivity.$['android:launchMode'] = 'singleTask';
    
    return config;
  });
};

module.exports = withCustomLaunchMode;
\`\`\`

---

## 4. Benefits of this Architecture

1.  **Immutability**: Your native project is disposable. Broken build? Just run \`npx expo prebuild --clean\`.
2.  **Upgradability**: Upgrading React Native versions is trivial because you don't have to manually diff native files. The prebuild process generates the *new* correct version of the native files.
3.  **Shareability**: You can share native functionality as an NPM package without asking users to "open Android Studio and paste this code."
`
               },
              { id: "les-eas-build", title: "EAS Build & OTA Updates", duration: "40 min read", type: "documentation", 
                content: `
# EAS: The DevOps of React Native

**EAS (Expo Application Services)** is the comprehensive CI/CD solution for React Native. It solves the two hardest problems in mobile engineering: **signing/building binaries** and **shipping updates instantly**.

---

## 1. EAS Build: Deterministic Cloud Compilation

Building iOS/Android apps locally is fragile. Xcode versions drift, Ruby dependencies break, and certificates expire. **EAS Build** moves this process to a Linux/macOS cloud container governed by a configuration file.

### The \`eas.json\` Blueprint
Instead of relying on a developer's machine state, you define **Build Profiles**.

\`\`\`json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": { "resourceClass": "m1-medium" }
    },
    "production": {
      "distribution": "store",
      "autoIncrement": true
    }
  }
}
\`\`\`

---

## 2. EAS Update: Continuous Delivery (OTA)

Native apps typically require a 2-day App Store review for every comma change. **EAS Update** allows you to ship JavaScript/Asset changes **Over-The-Air (OTA)** directly to user devices, bypassing the store for non-native changes.

### The Atomic Update Protocol
EAS Update is not just "Code Push." It uses a modern protocol ensuring:
1.  **Atomicity**: An update is fully downloaded before being applied. No broken partial states.
2.  **Rollbacks**: Instant reversion if a bug is deployed.
3.  **Signatures**: Code signing ensures updates are authentic.

---

## 3. The Dual Deployment Pipeline

Understanding when to Build vs. when to Update is critical for production velocity.

\`\`\`mermaid
graph TD
    Start[Dev Commits Code] --> Decision{Native Changes?}
    
    Decision -- Yes (Config/Native Code) --> BuildPath
    Decision -- No (JS/Assets Only) --> UpdatePath
    
    subgraph "Native Pipeline (Slow)"
    BuildPath[EAS Build] --> Compile[Cloud Compilation]
    Compile --> Binary[.ipa / .aab]
    Binary --> Store[App Store Review]
    Store --> User1[User Downloads Update]
    end
    
    subgraph "OTA Pipeline (Instant)"
    UpdatePath[EAS Update] --> Bundle[Packager Bundles JS]
    Bundle --> Cloud[EAS Edge Network]
    Cloud --> User2[App Downloads in Background]
    User2 --> Restart[App Reloads with New Code]
    end
    
    style BuildPath fill:#e63946,stroke:#fff
    style UpdatePath fill:#4361ee,stroke:#fff
\`\`\`

---

## 4. Strategy: Channels & Branches

In production, you map **Git Branches** to **Deployment Channels**.

* **Preview Channel**: Linked to PRs. Product Managers get a QR code to test specific features on their device instantly.
* **Production Channel**: The live app listens to this. You promote an update here only after testing.

> **Production Insight**: Never ship an OTA update that requires native code present in a future binary. This causes a **Native Crash**. Always version your runtime versions strictly (e.g., \`runtimeVersion: "1.0.0"\`) to prevent incompatible JS from landing on old native shells.
`
               },
            ]
        },
        {
            id: "mod-perf-ui",
            title: "High Performance UI",
            duration: "4h 00m",
            lessons: [
              { 
                id: "les-reanimated", 
                title: "Reanimated 3: Worklets & Shared Values", 
                duration: "45 min read", 
                type: "guide", 
                content: `
# Reanimated 3: The UI Thread Revolution

**React Native Reanimated** allows us to run complex animations and interaction handlers entirely on the **UI Thread**. It essentially spawns a secondary, high-priority JavaScript context enabling 60fps (or 120fps on ProMotion displays) animations, even if the main App Logic thread is frozen.

---

## 1. The Threading Model

To understand Reanimated, you must forget the traditional React Native flow (JS -> Bridge -> Native). Reanimated introduces a **dual-thread execution model**.

### The Worklet Concept
A **Worklet** is a tiny JavaScript function that can be captured by the UI Thread and executed there synchronously. It allows the UI thread to "think" without asking the main JS thread for permission.

\`\`\`mermaid
sequenceDiagram
    participant JS as Main JS Thread
    participant UI as UI Thread (Native)
    participant User

    Note over JS, UI: Initialization Phase
    JS->>UI: Spawns "UI Runtime"
    JS->>UI: Sends Worklet Code

    Note over User, UI: Interaction Phase
    User->>UI: Swipes Screen (Gesture)
    activate UI
    UI->>UI: Executes Worklet
    UI->>UI: Calculates Physics (Spring)
    UI->>UI: Updates View Matrix
    deactivate UI
    Note right of JS: JS Thread is BUSY fetching API<br/>(Does NOT block animation)
\`\`\`

---

## 2. Shared Values: The Reactive Core

In React, \`useState\` triggers a re-render. In Reanimated, we use **Shared Values**.
- **Shared Value**: A mutable object (\`{ value: 0 }\`) that exists on *both* the JS thread and the UI thread.
- **Synchronization**: When you modify it on the JS thread, the update is sent to the UI thread. When modified on the UI thread (via animation), it updates instantly without React re-rendering.

\`\`\`javascript
const width = useSharedValue(100);

// Modify on JS Thread (e.g., button press)
const handlePress = () => {
  width.value = withSpring(width.value + 50);
};
\`\`\`

---

## 3. The Animated Style Hook

We don't pass raw values to styles. We pass a "reaction" using \`useAnimatedStyle\`. This hook runs a worklet whenever the dependent Shared Values change.

\`\`\`javascript
function DraggableBox() {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    // This function is a WORKLET running on the UI Thread
    return {
      transform: [{ translateX: offset.value }],
      opacity: interpolate(offset.value, [0, 200], [1, 0.5]),
    };
  });

  return <Animated.View style={[styles.box, animatedStyles]} />;
}
\`\`\`

---

## 4. Interpolation & Physics

Reanimated provides a physics engine that runs on the UI thread. You don't calculate frames; you define **intent**.

* **\`withSpring\`**: Hooke's Law physics (mass, damping, stiffness).
* **\`withTiming\`**: Linear/Bezier curves based on duration.
* **\`interpolate\`**: Mapping an input range (e.g., scroll position) to an output range (e.g., opacity).

> **Production Tip**: Always perform heavy logic (like date formatting or data filtering) on the JS thread. Keep Worklets pure and focused solely on math and layout to prevent dropping frames on the UI thread.
`
              },
              { id: "les-skia", title: "2D Graphics with React Native Skia", duration: "30 min read", type: "concept",
                content: `
# React Native Skia: The Graphics Engine

**React Native Skia** brings the Skia Graphics Library—the same engine that powers Google Chrome, Android, and Flutter—directly into React Native via JSI.

It allows you to draw shapes, images, and text using a highly performant, declarative React API, with full support for the **Reanimated** ecosystem.

---

## 1. The Rendering Pipeline

Unlike standard SVGs which create native views (heavy memory usage), Skia draws pixels directly onto a GPU-accelerated Canvas.

### The Declarative Loop
We don't issue imperative commands (like \`ctx.lineTo\`). We render components.

\`\`\`mermaid
graph LR
    A[React State / Shared Value] -->|Update| B(Skia Component Tree)
    B -->|JSI Sync Call| C{Skia C++ Engine}
    C -->|GPU Draw| D[Canvas Surface]
    
  
\`\`\`

---

## 2. Declarative Geometry

Drawing feels just like writing HTML or SVG, but it's backed by C++.

\`\`\`tsx
import { Canvas, Circle, Group } from "@shopify/react-native-skia";
 
export const Logo = () => {
  const r = 128;
  return (
    <Canvas style={{ flex: 1 }}>
      <Group blendMode="multiply">
        <Circle cx={r} cy={r} r={r} color="cyan" />
        <Circle cx={r * 2} cy={r} r={r} color="magenta" />
        <Circle cx={r * 1.5} cy={r * 2} r={r} color="yellow" />
      </Group>
    </Canvas>
  );
};
\`\`\`

---

## 3. The Power of Shaders (SkSL)

Skia supports **SkSL (Skia Shading Language)**. This allows you to write micro-programs that run on the GPU for every single pixel, enabling effects like blurs, distortions, and noise generation that are impossible with standard CSS/Styles.

### Example: A Dynamic Gradient Shader

\`\`\`tsx
const source = Skia.RuntimeEffect.Make(\`
  uniform float2 resolution;
  uniform float time;
  
  vec4 main(vec2 pos) {
    vec2 uv = pos / resolution;
    return vec4(uv.x, uv.y, sin(time), 1.0); 
  }
\`)!;
\`\`\`

---

## 4. Integration with Reanimated

Skia and Reanimated are designed to work together. You can pass Reanimated \`SharedValue\`s directly into Skia props. This means you can animate a circle's radius or a shader's uniformity at **120fps** without passing data across the bridge.

> **Production Insight**: For complex visualizations (like charts or interactive graphs), Skia is roughly **10x-50x faster** than React Native SVG because it avoids managing thousands of native shadow nodes.
`
               },
              { id: "les-flashlist", title: "FlashList vs FlatList", duration: "20 min read", type: "documentation", content: `
# FlashList: The 60fps List Revolution

For years, **FlatList** was the standard for lists in React Native. While it used "Virtualization" to save memory, it often struggled with scroll performance on Android, leading to "blank spaces" during fast scrolling.

**FlashList** (by Shopify) solves this by introducing **Cell Recycling**, a technique borrowed from iOS (\`UICollectionView\`) and Android (\`RecyclerView\`) but implemented in JavaScript.

---

## 1. The Architecture: Virtualization vs. Recycling

To understand why FlashList is faster, we must look at what happens when a row scrolls off-screen.

### FlatList (Virtualization)
When a row leaves the viewport, FlatList **unmounts** it to free up memory. When a new row appears, it must **mount** a brand new component.
* **Cost**: Heavy. React has to run the reconciliation algorithm, create new fiber nodes, and communicate with the Native side to create new views.

### FlashList (Recycling)
When a row leaves the viewport, FlashList **does not unmount it**. Instead, it keeps the Native View and React Component alive but **updates the props** to match the new data item entering the screen.
* **Cost**: Near Zero. It's just a re-render. No mounting, no native view creation.

\`\`\`mermaid
graph TD
    subgraph "FlatList (The Old Way)"
    A[Row 1 Scrolls Off] -->|Unmounts| B(Garbage Collection)
    C[Row 10 Appears] -->|Mounts| D{Create New View}
    D --> E[Heavy CPU Usage]
    end

    subgraph "FlashList (The New Way)"
    F[Row 1 Scrolls Off] -->|Retains View| G(Recycle Pool)
    G -->|Reuses View| H[Row 10 Appears]
    H -->|Update Props| I{Light Re-render}
    I --> J[60fps Smoothness]
    end
    
    style E fill:#e63946,stroke:#fff
    style J fill:#4361ee,stroke:#fff
\`\`\`

---

## 2. The Critical Prop: \`estimatedItemSize\`

FlashList requires one specific prop that FlatList didn't: \`estimatedItemSize\`.

Since FlashList recycles views, it needs to know how "tall" items are *before* they render to calculate the scrollbar position correctly.

\`\`\`tsx
<FlashList
  data={data}
  renderItem={renderItem}
  // Critical: Helps FlashList calculate layout instantly
  estimatedItemSize={100} 
/>
\`\`\`

> **Warning**: If your estimate is wildly off, you might see scroll jumps. It doesn't need to be exact, but it should be close to the average height.

---

## 3. Performance Metrics

In production benchmarks (e.g., Shopify app), FlashList demonstrates:
1.  **5x faster** initial render time.
2.  **10x faster** updates when scrolling.
3.  **0 blank spaces** on low-end Android devices.

---

## 4. Migration & Pitfalls

FlashList is API-compatible with FlatList, but recycling introduces new bugs if you aren't careful.

### The "Key" Trap
In standard React, we use \`key\` to tell React which items changed.
In FlashList, **components remain mounted**. If you store local state (e.g., \`useState\`) inside your item component, that state **will persist** when the view is recycled for a different data item!

**Rule**: Avoid internal state in list items. Derive everything from \`props\`. If you must use state, reset it via \`useEffect\` when the ID changes.

\`\`\`javascript
// ❌ BAD: State persists when row is recycled
const Item = () => {
  const [active, setActive] = useState(false);
  return <View style={{ bg: active ? 'red' : 'blue' }} />;
}

// ✅ GOOD: State derived from props
const Item = ({ item }) => {
  return <View style={{ bg: item.isActive ? 'red' : 'blue' }} />;
}
\`\`\`
` },
            ]
        }
    ]
  },
  {
    id: "track-rn-expo",
    title: "React Native & Expo ",
    icon: Smartphone,
    level: "Beginner",
    totalDuration: "4h 30m",
    modules: [
      {
        id: "mod-setup",
        title: "Environment Setup",
        duration: "1h 00m",
        lessons: [
          {
            id: "les-install",
            title: "Installation & Dependencies",
            duration: "15 min",
            type: "guide",
content: `
# Professional Environment Setup

Setting up a React Native environment involves more than just installing a few packages. It requires configuring a **Toolchain** that compiles, bundles, and syncs JavaScript code to a native mobile device in real-time.

---

## 1. The Essential Toolchain

Before writing a single line of code, your machine must be fluent in the languages of the web and mobile.

| Tool | Role | Why is it critical? |
| :--- | :--- | :--- |
| **Node.js (LTS)** | Runtime | Executes the Metro Bundler and JavaScript build scripts outside the browser. **Always use LTS** (Long Term Support) for stability. |
| **Git** | Version Control | Manages source code history. Essential for team collaboration and CI/CD pipelines (like EAS). |
| **Watchman** | File Watcher | (macOS/Linux) A Facebook tool that watches file changes. It triggers the "Hot Reload" instantly when you save a file. Without it, builds are slow. |
| **VS Code** | IDE | The industry standard editor. Recommended extensions: *ES7+ React Snippets*, *Prettier*, and *Expo Tools*. |

---

## 2. Initialization: Under the Hood

We use \`create-expo-app\` to scaffold the project. This CLI tool doesn't just create files; it configures the **Metro Bundler** and **Expo Router** automatically.

### The Architecture of \`npx expo start\`

When you run the start command, you aren't just starting a server. You are spinning up **Metro**.

\`\`\`mermaid
graph TD
    A[Developer Saves File] -->|Watchman Detects Change| B(Metro Bundler)
    B -->|Transpiles JSX/TS| C{The Bundle .js}
    C -->|WebSocket HMR| D[Expo Go / Simulator]
    D -->|Refreshes UI| E[Mobile Screen]
    
  
\`\`\`

---

## 3. Creating the Project

Initialize a modern Expo app with TypeScript and file-based routing enabled by default.

\`\`\`bash
# Initialize a new project
npx create-expo-app@latest my-app

# Navigate into the directory
cd my-app

# Start the local development server
npx expo start
\`\`\`

### Project Anatomy
* **\`app/\`**: Your routes and screens (Expo Router).
* **\`assets/\`**: Static images and fonts.
* **\`app.json\`**: The configuration file (Name, Bundle ID, Icon, Splash Screen).
* **\`package.json\`**: Dependencies and scripts.

---

## 4. Execution Strategies: Expo Go vs. Development Builds

For beginners, **Expo Go** is magic. For professionals, **Development Builds** are necessary.

### A. Expo Go (The Sandbox)
A pre-compiled native app you download from the App Store. It contains the Expo SDK and can load your JS bundle dynamically.
* **Pros**: Instant start, no Xcode/Android Studio required.
* **Cons**: You cannot add custom native code (e.g., a specific analytics SDK not in Expo).

### B. Development Builds (The Professional Way)
A custom version of Expo Go that *you* build. It includes your specific native code and config.
* **Command**: \`npx expo run:ios\` or \`npx expo run:android\`.
* **Requirement**: Xcode (macOS) or Android Studio.

> **Pro Tip**: Start with Expo Go. Ejecting is a thing of the past. When you need custom native code, you simply create a **Config Plugin** and switch to a **Development Build** flow.
`
          },
          {
            id: "les-templates",
            title: "Project Templates",
            duration: "10 min",
            type: "concept",
content: `
# Expo Templates & Scaffolding

Starting a React Native project from scratch involves configuring Metro bundlers, Babel presets, TypeScript configs, and Navigation containers. **Expo Templates** abstract this complexity, offering pre-configured scaffolding strategies.

## 1. The Standard Templates

Expo maintains high-quality templates that serve as the foundation for 99% of apps.

### The "Blank" Template
The minimalist approach. It provides the bare minimum infrastructure required to run an app.
* **Best for**: Experienced developers who have a specific architecture in mind or learning projects where you want to build everything from zero.
* **Includes**: \`app/_layout.tsx\`, \`package.json\`, \`tsconfig.json\`.

### The "Tabs" (Navigation) Template
The production-ready starter. It implements the "File-based Routing" pattern with a Bottom Tab Navigator out of the box.
* **Best for**: Real-world applications. Most apps use a tab bar structure.
* **Includes**:
    * **Theming**: Light/Dark mode support hooks.
    * **Typography**: Custom \`ThemedText\` components.
    * **Vector Icons**: \`@expo/vector-icons\` integration.

---

## 2. Selection Strategy

Choosing the right starting point saves hours of configuration.

\`\`\`mermaid
graph TD
    A[Start New Project] --> B{Need Navigation?}
    B -- No / Custom --> C[Blank Template]
    B -- Yes --> D{Standard UI?}
    D -- Yes (Tabs) --> E[Tabs Template]
    D -- No (Drawer/Stack) --> C

    
\`\`\`

---

## 3. CLI Usage

You specify templates using the \`--template\` flag during initialization.

\`\`\`bash
# 1. The Standard (Blank + TypeScript)
npx create-expo-app@latest my-app

# 2. The Navigation Starter (Tabs)
npx create-expo-app@latest --template tabs

# 3. Specific Version (Blank)
npx create-expo-app@latest --template blank
\`\`\`

---

## 4. Anatomy of the "Tabs" Template

If you choose the \`tabs\` template, your project structure changes significantly to support nested navigation.

\`\`\`text
app/
├── (tabs)/           <-- Route Group (Hidden from URL)
│   ├── _layout.tsx   <-- Defines the <Tabs /> Navigator
│   ├── index.tsx     <-- Tab 1 (Home)
│   └── explore.tsx   <-- Tab 2 (Explore)
├── +not-found.tsx    <-- 404 Fallback
└── _layout.tsx       <-- Root Stack (wraps Tabs)
\`\`\`

> **Pro Tip**: You can also use community templates directly from GitHub. For example, to use a template with Tailwind CSS (NativeWind) pre-configured:
> \`npx create-expo-app --template nativewind/expo-router-nativewind\`
`
          }
        ]
      },
      {
        id: "mod-components",
        title: "Core Components & Styling",
        duration: "2h 30m",
        lessons: [
          {
            id: "les-basic-comps",
            title: "View, Text & Image",
            duration: "20 min",
            type: "documentation",
content: `
# Core Primitives: View, Text, & Image

Unlike the web, where we have a vast array of HTML tags (\`div\`, \`span\`, \`p\`, \`img\`, \`section\`), React Native gives us a streamlined set of **Core Components**. These are high-level abstractions that compile down to their platform-specific native equivalents.

## 1. The Mapping Architecture

When you write \`<View />\`, you aren't rendering a DOM node. You are instructing the native OS to instantiate a specific UI widget.

\`\`\`mermaid
graph LR
    A[React Native Code] -->|Maps To| B(Native Widget)
    
    subgraph "The Primitives"
    C[<View />] --> D[Android: ViewGroup]
    C --> E[iOS: UIView]
    
    F[<Text />] --> G[Android: TextView]
    F --> H[iOS: NSTextView / UILabel]
    
    I[<Image />] --> J[Android: ImageView]
    I --> K[iOS: UIImageView]
    end
    
    
\`\`\`

---

## 2. View: The Fundamental Container

The \`<View>\` is the fundamental building block of the UI. It supports **Flexbox** layout, styling, touch handling, and accessibility controls.

### Flexbox Layout (Yoga Engine)
React Native uses a C++ engine called **Yoga** to translate CSS Flexbox rules into native layout coordinates.
* **Default**: \`flexDirection: 'column'\` (Vertical).
* **Main Axis**: Controlled by \`justifyContent\`.
* **Cross Axis**: Controlled by \`alignItems\`.

\`\`\`jsx
<View style={{ 
  flex: 1, 
  flexDirection: 'row', // Horizontal layout
  justifyContent: 'space-between', // Spread apart
  alignItems: 'center' // Vertically centered
}}>
  <View style={{ width: 50, height: 50, backgroundColor: 'red' }} />
  <View style={{ width: 50, height: 50, backgroundColor: 'blue' }} />
</View>
\`\`\`

> **Pro Tip**: A \`<View>\` is designed to map to a container. It does not scroll. If you need scrolling, you must wrap content in a \`<ScrollView>\` or use a \`FlatList\`.

---

## 3. Text: Typography & Inheritance

In React Native, all text **must** be wrapped in a \`<Text>\` component. You cannot place a raw string inside a \`<View>\`.

### The Inheritance Rule
On the web, CSS styles cascade down from parent \`divs\`. In React Native, style inheritance **only happens inside nested Text components**.

\`\`\`jsx
// ❌ Styles typically don't inherit from View to Text
<View style={{ color: 'red' }}>
  <Text>This text is NOT red (default black/white)</Text>
</View>

// ✅ Styles inherit within Text
<Text style={{ fontSize: 20, color: 'blue' }}>
  This is blue title.
  <Text style={{ fontWeight: 'bold' }}> This part inherits blue but adds bold.</Text>
</Text>
\`\`\`

---

## 4. Image: Visual Assets

The \`<Image>\` component handles static resources (bundled with the app) and network resources (URLs).

### Source Handling
* **Static (Require)**: Bundled at build time. Fast.
* **Network (URI)**: Downloaded at runtime. Requires sizing.

\`\`\`jsx
// 1. Static Image (Packager handles dimensions)
<Image source={require('./assets/icon.png')} />

// 2. Network Image (MUST define width/height)
<Image 
  source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} 
  style={{ width: 50, height: 50, resizeMode: 'cover' }}
/>
\`\`\`

### Resize Modes
* **cover**: Scales the image uniformly to fill the bounds (crops if necessary).
* **contain**: Scales uniformly so exactly everything is visible (letterboxing).
* **stretch**: Distorts image to fill bounds.

> **Performance Note**: For production apps displaying lists of images, consider using \`expo-image\`. It uses native caching strategies (Glide/SDWebImage) superior to the default component.
`
          },
          {
            id: "les-stylesheet",
            title: "StyleSheet & Colors",
            duration: "25 min",
            type: "guide",
content: `
# Styling Architecture & The Yoga Engine

React Native does not use CSS. Instead, it uses a JavaScript-based styling system that passes style objects to **Yoga**, a highly optimized, cross-platform C++ layout engine that implements Flexbox.

## 1. The StyleSheet API

While you *can* pass plain JavaScript objects to the \`style\` prop, using \`StyleSheet.create\` is the professional standard.

### Why use StyleSheet?
1.  **Validation**: It validates your style properties at runtime (and compile time with TypeScript), warning you of invalid keys or values.
2.  **Performance**: In older architecture, it allowed sending IDs over the bridge instead of raw objects. In modern JSI, it ensures object shape stability for engine optimization.
3.  **Clean Code**: separates presentation logic from render logic.

\`\`\`javascript
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up full available space
    backgroundColor: '#1a1a1a',
  },
  card: {
    borderRadius: 8,
    padding: 16,
    elevation: 4, // Android Shadow
    shadowColor: '#000', // iOS Shadow
    shadowOffset: { width: 0, height: 2 }, // iOS Shadow
    shadowOpacity: 0.25, // iOS Shadow
  }
});
\`\`\`

---

## 2. The Flexbox Layout System

React Native uses a strict subset of Flexbox. The most important difference from the web is the default direction.

* **Web Default**: \`flex-direction: row\`
* **React Native Default**: \`flex-direction: column\`

### Layout Flowchart

\`\`\`mermaid
graph TD
    A[Parent Container] -->|flexDirection: column| B(Main Axis: Vertical)
    A -->|flexDirection: row| C(Main Axis: Horizontal)
    
    B --> D{Justify Content}
    D -->|flex-start| E[Top]
    D -->|center| F[Middle]
    D -->|flex-end| G[Bottom]
    
    C --> H{Justify Content}
    H -->|flex-start| I[Left]
    H -->|center| J[Center]
    H -->|flex-end| K[Right]
\`\`\`

### Key Properties
* **\`flex: 1\`**: Tells a component to expand and fill all available space relative to its siblings.
* **\`justifyContent\`**: Aligns children along the **Main Axis** (Vertical by default).
* **\`alignItems\`**: Aligns children along the **Cross Axis** (Horizontal by default).

---

## 3. The Box Model & Units

In React Native, all dimensions are unitless numbers. They represent **density-independent pixels (dp)**.
* \`width: 100\` means 100 logical points. On a Retina screen (2x), it renders 200 physical pixels. On a Super Retina (3x), it renders 300.

### Differences from CSS
1.  **No \`em\` or \`rem\`**: You strictly use numbers or percentages (strings).
2.  **Box Sizing**: Everything is \`border-box\` by default. Padding does not increase the element's total width if width is set.

\`\`\`javascript
const boxStyle = {
  width: 100,
  height: 100,
  marginVertical: 10, // Shorthand for marginTop + marginBottom
  paddingHorizontal: 20, // Shorthand for paddingLeft + paddingRight
  borderWidth: StyleSheet.hairlineWidth, // The thinnest line the device can display
};
\`\`\`

---

## 4. Advanced Color Systems

You can use standard color formats (\`#fff\`, \`rgb()\`, \`hsl()\`), but React Native also supports platform semantics.

### Color Formats
* **Hex & Alpha**: \`#FF000080\` (Red with 50% opacity).
* **RGBA**: \`rgba(255, 0, 0, 0.5)\`.
* **PlatformColor** (Advanced): Uses native system colors that change based on user preferences.

\`\`\`javascript
import { PlatformColor, Platform } from 'react-native';

const styles = StyleSheet.create({
  text: {
    // iOS: System Blue, Android: Standard Blue
    color: Platform.select({
      ios: PlatformColor('systemBlue'),
      android: PlatformColor('@android:color/holo_blue_light'),
      default: 'blue',
    }),
  },
});
\`\`\`

> **Production Tip**: Never hardcode hex values like \`#3b82f6\` inside your components. Create a **Design Token** file (\`theme.ts\`) or object constants to maintain consistency across the app.
`
          }
        ]
      },
      {
        id: "mod-router",
        title: "Expo Router Navigation",
        duration: "3h 00m",
        lessons: [
          {
            id: "les-routing",
            title: "File-based Routing & Layouts",
            duration: "30 min",
            type: "concept",
content: `
# Expo Router: The Filesystem is the Navigation

Expo Router revolutionizes React Native navigation by bringing the Next.js model to mobile. Instead of complex imperative configuration files (like \`createStackNavigator\`), **your file structure is your API**.

## 1. The Core Mental Model

In traditional React Navigation, you map strings to components manually.
In Expo Router, **if a file exists in \`app/\`, it is a screen.**

### File-to-Route Mapping Table

| File Path | Route URL | Description |
| :--- | :--- | :--- |
| \`app/index.tsx\` | \`/\` | The entry screen (Home) |
| \`app/about.tsx\` | \`/\about\` | A standard page |
| \`app/user/[id].tsx\` | \`/user/123\` | Dynamic route with parameter |
| \`app/settings/security.tsx\` | \`/settings/security\` | Nested route |

---

## 2. Layouts: The Application Skeleton

A **Layout** (\`_layout.tsx\`) is a wrapper component that persists across child route transitions. It is where you define **Navigators** (Stack, Tabs, Drawer).

### Layout Hierarchy Visualization

Everything flows from the Root Layout down to the leaves (screens).

\`\`\`mermaid
graph TD
    Root["app/_layout.tsx (Root Stack)"]
    Home["app/index.tsx"]
    Group["app/(tabs)/_layout.tsx (Tabs)"]
    Feed["app/(tabs)/feed.tsx"]
    Profile["app/(tabs)/profile.tsx"]
    
    Root --> Home
    Root --> Group
    Group --> Feed
    Group --> Profile
    
    
\`\`\`

### Defining a Stack Layout
This file wraps all siblings in a Native Stack.

\`\`\`tsx
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Configure header options for specific screens */}
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
\`\`\`

---

## 3. Route Groups & Organization

Sometimes you want to organize files logically (e.g., Authentication vs. Main App) **without** affecting the URL path.

We use **Groups** by wrapping a folder name in parentheses \`()\`.

* **File**: \`app/(auth)/login.tsx\`
* **URL**: \`/login\` (The \`(auth)\` segment is ignored by the URL).

This allows you to give the \`(auth)\` group a completely different Layout (e.g., no headers) than the \`(app)\` group.

---

## 4. Universal Linking

Navigation is declarative using the \`<Link />\` component. This works identically on iOS, Android, and Web.

\`\`\`tsx
import { Link } from 'expo-router';

export default function Page() {
  return (
    <Link href="/user/jane" asChild>
      <Pressable>
        <Text>View Jane's Profile</Text>
      </Pressable>
    </Link>
  );
}
\`\`\`

> **Pro Tip (Typed Routes)**: If you use TypeScript, Expo Router generates types for your links. \`<Link href="/broken-link" />\` will throw a **compile-time error** if that file doesn't exist.
`
          },
          {
            id: "les-stack-slot",
            title: "Stack, Slot & Screen Options",
            duration: "35 min",
            type: "guide",
content: `
# Stacks & Slots: The Building Blocks of Navigation

In Expo Router, understanding the difference between a **Navigator** (like Stack) and a **Slot** is crucial for structuring complex applications.

---

## 1. The Stack Navigator

The **Stack** is the most fundamental navigation pattern in mobile development. It models the user's journey as a deck of cards. When a user navigates forward, a screen is **pushed** onto the stack. When they go back, it is **popped** off.

### Stack Behavior Model

\`\`\`mermaid
graph TD
    A[Home Screen] -->|Push| B[List Screen]
    B -->|Push| C[Detail Screen]
    C -->|Pop| B
    B -->|Pop| A
    
    style A fill:#fff,stroke:#333
    style B fill:#fff,stroke:#333
    style C fill:#4630eb,color:#fff
\`\`\`

\`\`\`tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#f4511e' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="details" options={{ title: 'Details' }} />
    </Stack>
  );
}
\`\`\`

---

## 2. The Slot: Pure Child Rendering

The \`<Slot />\` component is analogous to the \`<Outlet />\` in React Router or \`children\` in standard React components.

It renders the currently matched child route **without adding any UI** (no headers, no tab bars, no animations). It is essentially a "hole" in your layout where the screen content goes.

### Architecture: Layout Wrapping

\`\`\`mermaid
graph TD
    Layout[Authentication Layout]
    Slot{<Slot />}
    Login[Login Screen]
    Register[Register Screen]
    
    Layout -->|Renders| Slot
    Slot -->|Injects| Login
    Slot -->|Injects| Register
    
    style Slot fill:#fca311,stroke:#333
\`\`\`

**Use Cases for Slot:**
1.  **Authentication Layouts**: Wrap login/register screens with a common background image but no navigation header.
2.  **Context Providers**: Inject a Global State provider around a group of routes without adding UI.

---

## 3. Screen Configuration

You can configure how a screen is presented (title, header buttons, modal behavior) in two ways: **Static** (inside the Layout) or **Dynamic** (inside the Screen itself).

### A. Static Configuration (Preferred)
Define options in the \`_layout.tsx\` file. This keeps your routing logic centralized.

\`\`\`tsx
// app/_layout.tsx
<Stack>
  <Stack.Screen 
    name="modal" 
    options={{ 
      presentation: 'modal',
      headerShown: false 
    }} 
  />
</Stack>
\`\`\`

### B. Dynamic Configuration
Sometimes the title depends on data (e.g., "Chat with Alice"). Use \`<Stack.Screen />\` inside the page component.

\`\`\`tsx
// app/chat/[user].tsx
import { Stack, useLocalSearchParams } from 'expo-router';

export default function ChatScreen() {
  const { user } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ title: user }} />
      <ChatUI />
    </>
  );
}
\`\`\`

---

## 4. Common Patterns

### The Modal Pattern
Mobile apps frequently use modals for tasks like "Create Post" or "Edit Profile".

\`\`\`tsx
// app/_layout.tsx
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  {/* The 'modal' file will slide up from the bottom */}
  <Stack.Screen 
    name="compose" 
    options={{ presentation: 'modal' }} 
  />
</Stack>
\`\`\`

### Hiding the Header
For fully custom UI (like a map screen or a video player), you often want to remove the native header.

\`\`\`tsx
<Stack.Screen options={{ headerShown: false }} />
\`\`\`
`
          }
        ]
      },
      {
        id: "mod-theming",
        title: "Theming",
        duration: "1h 30m",
        lessons: [
          {
            id: "les-themes",
            title: "Light & Dark Modes",
            duration: "20 min",
            type: "guide",
content: `
# Theming: Beyond Light & Dark

Supporting **Dark Mode** is no longer optional; it is a standard user expectation. A professional React Native app must respond to system preferences instantly, sync with the navigation stack, and allow for manual overrides.

## 1. The Core Mechanism: \`useColorScheme\`

React Native exposes the user's system preference via the \`useColorScheme\` hook. It listens to native Android/iOS appearance events and triggers a re-render when they change.

### The Event Loop

\`\`\`mermaid
graph LR
    A[System Settings] -- "User Toggles Dark Mode" --> B(Native Bridge)
    B -- "Event: appearanceDidChange" --> C[React Event Loop]
    C --> D{useColorScheme Hook}
    D -- "Returns 'dark'" --> E[Component Re-render]
\`\`\`

---

## 2. Scalable Architecture: The Token System

Hardcoding \`isDark ? '#000' : '#fff'\` inside every component is unmaintainable. In production, we use **Semantic Design Tokens**.

Instead of "White" or "Black", we define "Background" and "Surface".

### Defining the Palette

\`\`\`typescript
// constants/Colors.ts
const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
  },
};
\`\`\`

### Creating a Custom Hook

Abstract the logic so your components stay clean.

\`\`\`tsx
// hooks/useThemeColor.ts
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
\`\`\`

---

## 3. Syncing with Navigation

A common bug is having a Dark Mode app with a Light Mode navigation header (white bar at the top).

Expo Router (built on React Navigation) requires you to pass the theme to the \`ThemeProvider\`.

\`\`\`tsx
// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Home' }} />
      </Stack>
    </ThemeProvider>
  );
}
\`\`\`

---

## 4. The "Flash of Light" (FOUC)

If your app loads slowly, users might see a white flash before the Dark Theme loads.

**The Fix:** Configure \`userInterfaceStyle\` in your \`app.json\`.

\`\`\`json
{
  "expo": {
    "userInterfaceStyle": "automatic",
    "backgroundColor": "#000000"
  }
}
\`\`\`

This tells the **Native OS** to paint the initial view background correctly *before* the JavaScript bundle has even started loading.
`
          }
        ]
      }
    ]
  }

];