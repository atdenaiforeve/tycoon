# BLACKSITE-01 — Nordic Facility Construction Division

A browser-based facility construction and research tycoon set inside the fictional underground **BLACKSITE-01** complex.

The game is built around expanding and operating a connected underground facility through construction, power, staff, experiments, research, security, raids, repairs, and future facility systems.

## Current Build

**System Build 026**

The project is actively in development. The current build includes the updated power-first tutorial, browser save recovery, the Upgrade Tree, responsive UI support, and the image-based tutorial guide.

## Core Gameplay

BLACKSITE-01 is designed as more than a menu of upgrades. Construction represents the growth of an actual underground facility.

### Facility Construction

Current construction systems include:

- Office Room
- Experiment Room
- Power System
- Future research and facility sectors

Buildings use facility energy where appropriate and contribute to the growing BLACKSITE-01 complex.

Construction uses short timed queues and saves active construction so progress can recover after a page reload.

### Staff

Staff are required to operate the facility.

Current staff:

- Scientist
- Security Staff

Scientists support research, while security contributes to the facility's defense during security events.

### Experiments

Experiments provide progression beyond basic construction.

Current experiment:

- **Level 1 — Facility Systems Test**

The first experiment is intentionally a basic facility/equipment test rather than Nordic research. More advanced research is planned for later progression.

### Research

Research uses a timed progression system.

A scientist performs research after an experiment is started. When research completes, the facility begins generating additional Research Points.

Current Level 1 research reward:

- **+5 RP/sec**

Research speed can be improved through the Upgrade Tree.

## Energy System

New facilities start with **0/0 Energy**.

The tutorial therefore begins by installing the Power System before the player builds anything that requires energy.

| System | RP Cost | Energy |
|---|---:|---:|
| Office Room | 200 | 3 |
| Experiment Room | 400 | 5 |
| Power System | 500 | +15 capacity |

Staff and experiments do not directly consume energy.

## Tutorial

The opening tutorial guides the player through the initial facility setup in a fixed operational order:

1. Install the Power System
2. Build the Office
3. Build the Experiment Room
4. Hire a Scientist
5. Hire Security Staff
6. Run the Facility Systems Test
7. Continue into normal facility operations

The tutorial now uses a small 2D image-based facility guide with text bubbles instead of the previous voice and arrow guidance system.

Tutorial progression is action-specific: each step unlocks the relevant action and advances after that action is completed.

## Security & Raids

BLACKSITE-01 includes security events that can damage the facility.

Security staff contribute defensive capability, while security training and equipment can improve the facility's response.

A failed defense can temporarily damage facility systems and create repair requirements.

The system is designed to recover damaged facilities rather than permanently soft-locking progression.

## Upgrade Tree

The **Upgrade Tree** is separate from the normal construction categories.

Current progression areas include:

- Construction Speed
- Facility Level
- Government Cover
- Research Speed
- Security Training
- Security Equipment
- Government Shade
- Future expansion systems
- Future research systems

The tree is designed around connected progression paths so upgrades can build toward larger facility capabilities.

Some future systems remain undisclosed until their intended progression is implemented.

## Progress Saving

The game includes browser-based progress saving.

Saved progression covers major facility state, Research Points, research income, upgrades, staff, construction queues, research queues, raid state, repair state, and other progression data.

The save system uses a versioned schema so future updates can be handled more safely.

The Settings section provides:

- **Save Progress Now**
- **Reset All Progress**

Resetting progress clears the current browser save and returns the game to the new-player starting state, including the 0/0 Energy tutorial start.

## Responsive Interface

The interface is designed to adapt to different screen sizes, including:

- Desktop
- Smaller windows
- Split-screen layouts
- Tablet-sized displays
- Mobile-sized layouts

The tutorial guide and Upgrade Tree are designed to remain usable as the interface changes size.

## Development & Diagnostics

The game includes a hidden development diagnostics panel for testing and troubleshooting.

Press:

**Ctrl + Shift + D**

to toggle the development panel.

It can display information such as the current build, tutorial step, facility level, research, save status, schema version, and active queues.

## Cache Protection

The entry page loads the main UI with a cache-busting query so GitHub Pages is less likely to keep displaying an older version after an update.

## Project Direction

BLACKSITE-01 is part of the wider **Nordic fictional universe**.

The long-term goal is to develop the facility into a believable underground research complex with:

- Connected corridors
- Multiple facility sectors
- Research areas
- Security systems
- Service routes
- Containment areas
- More advanced experiments
- Nordic-related research
- Additional events and facility mechanics

Nordic is intended to become part of the later progression rather than being the subject of the first tutorial experiment.

## Development Philosophy

The project aims to make the facility feel like an actual operating complex.

Construction should have a visible effect on the facility. Staff should have a purpose. Experiments should require preparation. Research should progress over time. Security should matter.

The interface and underlying systems are being developed together so that future facility mechanics can be added without turning the game into a collection of disconnected upgrade buttons.

## Repository Structure

Important project files include:

- `index.html` — cache-busting entry page and UI loader
- `ui.html` — main facility interface and game systems
- `assets/` — interface and game assets
- `assets/icons/tutorial_assets/` — 2D tutorial character face images

## Status

🚧 **In development — System Build 026.**

BLACKSITE-01 is an actively evolving project. Features and systems may change as the facility, progression, research, security, and Nordic storyline are expanded.
