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

];