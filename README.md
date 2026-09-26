# BLACKSITE-01 — Nordic Facility Construction Division

A browser-based facility construction and research tycoon set inside the fictional underground **BLACKSITE-01** complex.

The game is built around physically expanding the facility through connected rooms, corridors, systems, staff, experiments, research, and future security events.

## Current Build

**System Build 025**

The project is actively in development. Systems, UI layout, tutorial flow, and facility mechanics are still being expanded.

## Core Gameplay

BLACKSITE-01 is designed as more than a menu of upgrades. Construction represents the growth of an actual underground facility.

### Facility Construction

Players can construct:

- Office Room
- Experiment Room
- Power System
- Future research and facility sectors

Buildings consume facility energy where appropriate and contribute to the growing BLACKSITE-01 complex.

### Staff

Staff are required to operate the facility.

Current staff:

- Scientist
- Security Staff

Scientists support research, while security protects the facility during security events.

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

Buildings use facility energy.

Current starting capacity:

- **8 Energy**

Current systems:

| System | RP Cost | Energy |
|---|---:|---:|
| Office Room | 200 | 3 |
| Experiment Room | 400 | 5 |
| Power System | 500 | +15 capacity |

Staff and experiments do not directly consume energy.

## Tutorial

The opening tutorial guides the player through the initial facility setup in a fixed operational order:

1. Build the Office
2. Build the Experiment Room
3. Install the Power System
4. Hire a Scientist
5. Hire Security Staff
6. Run the Facility Systems Test
7. Wait for research to complete
8. Receive the operational briefing

The tutorial includes voice guidance, a visual arrow system, action-specific progression, and responsive positioning.

Tutorial guidance identifies the relevant interface element by its HTML ID and measures its current position so the guide can adapt when the interface changes size or layout.

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
- Hidden future expansion systems
- Hidden future research systems

Some future systems remain undisclosed until their intended progression is implemented.

## Progress Saving

The game includes browser-based progress saving.

Saved progression includes major facility state, Research Points, research income, upgrades, staff, construction queues, research queues, raid state, and other progression data.

The Settings section provides:

- Save Progress Now
- Reset All Progress

## Responsive Interface

The interface is designed to adapt to different screen sizes, including:

- Desktop
- Smaller windows
- Split-screen layouts
- Tablet-sized displays
- Mobile-sized layouts

The UI scans its available dimensions and recalculates important interface positioning when the window or layout changes.

This is particularly important for the tutorial guide and Upgrade Tree.

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

- `index.html` — entry page and Build 025 cache-busted UI loader
- `ui.html` — main facility interface and game systems
- `assets/` — interface, icon, and audio assets
- `assets/audio/tutorial/` — tutorial voice files

## Status

🚧 **In development — System Build 025.**

BLACKSITE-01 is an actively evolving project. Features and systems may change as the facility, progression, research, security, and Nordic storyline are expanded.
