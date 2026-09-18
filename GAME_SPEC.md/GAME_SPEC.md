# **Core Game Engine & System Architecture**

## **1\. High-Level Game States**

The application architecture relies on three decoupled core states:

* **Setup State:** Handles attribute point distribution (player velocity, shot power, ball control, goalkeeper intelligence, reaction rate).  
* **Match State:** Manages the live physics simulation, vector dynamics, spatial rendering inputs, user control states, and AI execution.  
* **Outcome State:** Processes final match metrics and transitions back to setup or rematch routines.

## **2\. Multi-Loop Execution Model**

To maintain smooth frame rates and non-blocking calculations, the engine separates responsibilities across three concurrent pipelines:

\[ Input Handler \] ──────► ( Captures Gestures & Vector Offsets )  
                                    │  
                                    ▼  
\[ Core Game Loop \] ◄──── ( 30ms Fixed Tick / Physics & Kinematics )  
        ▲  
        │ Asynchronous Payload Consumption  
        │  
\[ AI Pipeline \] ──────── ( Trajectory Calculations & Decoupled States )

1. **Input Handler:** Listens for active user gestures and translates them into control directional vectors.  
2. **Core Game Loop Thread:** Runs on a fixed time-delta cycle (target $\\sim 30\\text{ ms}$ tick rate). Executes physics kinematic updates, handles micro-step collision checks, and updates game entities.  
3. **Asynchronous AI Pipeline:** Runs independently to evaluate field trajectories and goalkeeper decision logic without stalling physics updates or frame rendering.

## **3\. Custom Physics Engine & Spatial Kinematics**

### **Vector Kinematics**

Updates spatial entity positions frame-by-frame using velocity and acceleration vectors over a time step ($\\Delta t$):

$$\\mathbf{p}\_{t+1} \= \\mathbf{p}\_t \+ \\mathbf{v} \\cdot \\Delta t$$

### **Sub-Tick Micro-Stepping**

To prevent high-velocity entities (e.g., maximum power shots) from clipping through thin collider boundaries (goalposts, net edges), the time step $\\Delta t$ is divided into smaller increments whenever velocity exceeds a safety threshold:

$$\\Delta t\_{\\text{micro}} \= \\frac{\\Delta t}{N\_{\\text{substeps}}}$$

### **Collision Engine Rules**

* **Circle-to-Circle (Dynamic):**  
  * *Targets:* Player $\\leftrightarrow$ Ball, Player $\\leftrightarrow$ Player, Ball $\\leftrightarrow$ Posts.  
  * *Resolution:* Separates overlapping bounding circles along their normal vectors and applies dynamic bounce reflections using a coefficient of restitution $e$:  
    $$\\mathbf{v}\_{\\text{reflected}} \= \\mathbf{v} \- (1 \+ e)(\\mathbf{v} \\cdot \\mathbf{n})\\mathbf{n}$$  
* **Circle-to-Box (Static):**  
  * *Targets:* Ball $\\leftrightarrow$ Pitch Boundaries, Ball $\\leftrightarrow$ Goal Net Enclosures.  
  * *Resolution:* Reverses orthogonal velocity components and applies surface friction/dampening factors.

### **Directional Ball Control Cone**

* Projects a directional cone extending forward from the controlling player's orientation vector.  
* When the ball is inside this cone, a continuous force vector pulls and stabilizes the ball relative to the player's **Ball Control** attribute.

## **4\. Player Controls & Autopilot System**

* **Dynamic Vector Movement:** Maps dynamic point touches or analog directional vectors into a target velocity $\\mathbf{v}\_{\\text{target}}$.  
* **Active Brake Mechanism:** Releasing controls or tapping the center origin applies a high-deceleration damping multiplier to rapidly halt momentum.  
* **Aiming & Charge System:** Holding the action input locks movement into directional target aiming while filling a power meter.  
* **Autopilot Tracking:** During aiming/charging phases, manual movement steering is temporarily delegated to an internal tracking routine (**Autopilot**) that automatically moves the player toward the ball's vector.

## **5\. Goalkeeper AI System**

The AI computes updates asynchronously and yields a thread-safe AIAction payload:

| AI Action State | Condition Trigger | Core Behavior |
| :---- | :---- | :---- |
| **HOLD** | Ball far from defensive zone | Retain baseline positioning. |
| **MOVE** | Active attacking play near box | Adjust position along defensive goal arc. |
| **SAVE** | Shot traveling toward goal net | Calculate orthogonal trajectory intersection for diving save. |
| **INTERCEPT** | Loose ball in penalty box | Sprint along shortest path vector to intercept ball. |
| **RUN\_TO\_BALL** | Possession opportunity | Close down angle and secure possession. |

### **Goal Arc Positioning Calculation**

Computes optimal goalkeeper placement along a semicircular defensive arc positioned in front of the goal line relative to the ball's current location:

$$\\mathbf{p}\_{\\text{target}} \= \\mathbf{p}\_{\\text{goal\\\_center}} \+ R \\cdot \\frac{\\mathbf{p}\_{\\text{ball}} \- \\mathbf{p}\_{\\text{goal\\\_center}}}{\\Vert{}\\mathbf{p}\_{\\text{ball}} \- \\mathbf{p}\_{\\text{goal\\\_center}}\\Vert{}}$$

### **Attribute Modulation**

* **Intelligence Stat:** Controls decision refresh intervals (reaction lag) and accuracy along the defensive arc.  
* **Reaction Stat:** Governs dive acceleration speed and interception response triggers.

## **6\. Shared Math & Utilities Layer**

* **Vector Geometry Module:** Pure mathematical functions for dot products, distance calculations, vector normalization, and ray-circle intersections.  
* **Global Constants:** Configurable values for field proportions, frictional drag multipliers, physics step bounds, and stat scaling factors.

