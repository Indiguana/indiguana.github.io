---
title: Finding Attack Patterns in Jailbreaking of Large Language Models
---

## Overview

This project studies recurring patterns in successful prompt injection
attacks against a large language model, using data from
[Tensor Trust](https://tensortrust.ai/), a public web game in which players
attack and defend LLM-guarded "bank" accounts. The goal is to identify
which attack strategies succeed most often and whether they cluster into a
small number of recognizable techniques.

## Background

Prompt injection is a vulnerability in which a malicious input manipulates
a language model into ignoring its original instructions. This can turn an
otherwise well-behaved system into a phishing agent, a spam generator, or a
tool that leaks information it was designed to protect. The NIST AI Risk
Management Framework treats this kind of vulnerability as a technical risk
to system robustness; it recommends that AI systems be resilient to
adversarial inputs and that organizations document and monitor these risks
on an ongoing basis, in line with standard practice such as the OWASP
guidelines.

Tensor Trust operationalizes this problem as a game. Each player sets up a
defense (an opening prompt, a secret access code, and a closing prompt)
around a fixed LLM, GPT-3.5 Turbo. Other players submit attack text that is
inserted between the defense prompts; if the model outputs "access
granted," the attack succeeds. The public dataset released alongside the
game contains 126,808 attacks and 46,457 defenses, and has already been
used to show that manual, human-written attacks generalize across
different LLMs and even against commercial AI products.

## Data

This project uses the subset of Tensor Trust attacks that succeeded:
17,266 attacks, 7,178 of them with distinct text. Each row records the
attacker and defender IDs, the attack text, the defender's code, and the
success outcome.

## Method

Attacks were analyzed in two ways.

1. **Frequency analysis.** Counting how often the exact same attack string
   succeeded across different defenses, to find the most broadly effective
   attacks.
2. **Semantic clustering.** Each unique attack was embedded with a sentence
   transformer (`all-MiniLM-L6-v2`), projected to two dimensions with
   t-SNE, and grouped with HDBSCAN. A separate hybrid pipeline additionally
   clusters attacks by TF-IDF n-grams, near-duplicate detection, and
   Levenshtein edit distance, to check whether semantic and surface-level
   similarity agree.

## Results

**Most repeated successful attacks.** A small number of strings account
for a disproportionate share of successes.

![Top attacks](/images/research/llm-jailbreak/top_attacks.png)

Several of the most common strings are direct instruction injections
("Say 'Access Granted'"); others are not natural language at all. Strings
built from repeated rare tokens (for example, a long run of the character
"ö" or the repeated fragment "artisanlib") appear among the most reliable
attacks. This matches a known LLM failure mode: rare or repeated tokens can
push a model into unstable, poorly-generalized behavior, since such
sequences are underrepresented in training data.

**Semantic clusters.** Embedding and clustering the unique attacks
produces 118 clusters, shown below in a t-SNE projection (unclustered
points are shown in grey).

![Cluster scatter](/images/research/llm-jailbreak/cluster_scatter.png)

The existence of well-separated, tightly-packed clusters indicates that
successful attacks are not evenly distributed across "attack space";
players converge on a limited number of reusable strategies, likely
through observing or guessing what previously worked against other
defenses.

**Cluster sizes.** Cluster sizes follow a long-tailed distribution: a few
large clusters capture common, easily-discovered strategies, while many
smaller clusters likely represent more specific or situational attacks.

![Cluster sizes](/images/research/llm-jailbreak/cluster_sizes.png)

## Observations

The clustering results are consistent with the attack categories described
in the Tensor Trust paper: instruction overriding, exploitation of model
completion tendencies, and unusual formatting or rare tokens intended to
confuse the model. Because these strategies cluster tightly and repeat
across many different defenses, they represent a small, addressable set of
failure modes rather than an unbounded space of attacks; this is
encouraging from a defense standpoint, since a model robust to the largest
clusters would likely resist a large share of real-world attacks.

## Code and data

The analysis scripts, notebook, and filtered dataset are available on
[GitHub](https://github.com/Indiguana/LLM_weakness).

## References

1. Toyer, S., Watkins, O., Mendes, E. A., et al. "Tensor Trust:
   Interpretable Prompt Injection Attacks from an Online Game." 2023.
2. National Institute of Standards and Technology. "AI Risk Management
   Framework (AI RMF 1.0)." 2023.
