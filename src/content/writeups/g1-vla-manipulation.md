---
title: Building a Vision-Language-Action Data Pipeline for the Unitree G1 Humanoid
---

## Overview

A Vision-Language-Action (VLA) model takes camera images and a sentence and
outputs robot commands: one network, many tasks, chosen by the instruction.
Models like NVIDIA's GR00T N1.5 and Physical Intelligence's π0 are trained on
demonstrations recorded in a specific format. This project builds the whole
pipeline that produces those demonstrations: a simulated environment, a
controller that can reach and grasp, and a dataset a real VLA could read. It
runs in MuJoCo on a laptop, with no GPU.

The starting point was less than it looks. Unitree's G1 model has no working
hand: the "hands" are decorative meshes that never collide with anything. There
was no gripper, no task, no scene and no data pipeline.

![The same scene, two different instructions, two different behaviors](/images/research/g1-manipulation/language_conditioned.gif)

## Results

| | Task 1: pick and place | Task 2: language-conditioned |
|---|---|---|
| Instruction | "pick up the red block and place it at the target spot" | "put the {red, yellow} block in the {left, right} bin" |
| Randomized | block position | block positions and which color sits where |
| Success | 43 / 50 (86%) | 52 / 52 (100%) |

The exported dataset has 95 successful episodes and 21,186 frames across 5
distinct instructions, at 30 Hz with two camera streams. It was converted to
[LeRobot](https://github.com/huggingface/lerobot), Hugging Face's standard for
robot demonstration data, and verified by reloading it and checking frame
shapes, image ranges and that every frame carries an instruction.

## What the policy sees

![Scene view, head camera and wrist camera](/images/research/g1-manipulation/observations.png)

Two cameras are rigidly mounted, as they would be on real hardware. The head
view gives scene context; the wrist view resolves the last centimeter of
alignment. Because the wrist camera moves with the hand, it looks nearly the
same wherever the robot stands, which makes it the view most likely to transfer
to a real robot. Each frame also records a 9-number state (7 arm joints and 2
finger positions), since images alone are ambiguous when the arm hides itself.

Actions are the *commanded* joint targets, not the positions the arm actually
reached. A trained policy's output goes into the same low-level controller the
demonstrations used, so it has to speak in targets; trained on achieved
positions, it would learn to output where the arm already is and stall.

## What made it work

**Measuring the workspace instead of guessing it.** The first table, placed by
eye at 0.37 m, gave inverse kinematics errors of 240–490 mm. Sampling 60,000
random arm poses showed the gripper can't get below 0.63 m at all. Moving the
table to 0.82 m brought errors under 1 mm.

**Closing the loop in task space.** Solving inverse kinematics once and driving
the joints there left the fingertip 79 mm off, even though teleporting the arm
to that solution landed within 0.33 mm. The controller settled slightly short on
each joint, and the errors compounded down the 7-link arm. Re-solving against
the measured gripper position every control step brought error to 3–5 mm.

**Making the language impossible to skip.** In task 1 the instruction never
changes, so it carries no information. Task 2 maps the same image to four
correct behaviors. Colors are assigned to table positions at random, and the
four instructions are cycled rather than sampled: random draws over 50 episodes
had correlated the target color with its position 16:7, enough for a policy to
bet on position and ignore the words.

**Keeping debugging aids out of the data.** The point the controller aims at was
rendered as a small green dot, and it showed up in both cameras. A policy trained
on those images could learn to chase the dot, which doesn't exist on a real
robot. Separately, the uncontrolled waist drifted up to 30° per episode, swinging
the head camera; holding it steady also raised task 2 from 94% to 100%.

## Limitations

- **Task 1 sits at 86%.** Grasp orientation isn't controlled, so on one side of
  the table the gripper arrives rotated and a finger knocks the block away.
  Forcing a straight-down grasp made it worse (5/12 to 2/12), because the arm's
  natural approach is about 70° from vertical.
- **95 episodes is far too few to train on.** Published VLA work uses thousands
  to millions. The dataset shows the pipeline is correct, not that a policy
  could be trained from it.
- **No policy has been trained on it yet.** Fine-tuning GR00T N1.5 or π0 is the
  next step.
- **The base is fixed.** This is tabletop manipulation, not whole-body control.

The G1 model and meshes are from
[unitreerobotics/unitree_mujoco](https://github.com/unitreerobotics/unitree_mujoco)
(BSD-3-Clause). The repo also has longer notes on the simulation, the control
math, the VLA data design, and nine bugs found along the way.
