export interface ResearchProject {
	slug: string;
	title: string;
	dates: string;
	description: string;
	githubLink: string | null;
	// Path to a poster board image under public/, or null if none is available.
	poster: string | null;
}

export const researchProjects: ResearchProject[] = [
	{
		slug: "llm-jailbreak-patterns",
		title: "Finding Attack Patterns in Jailbreaking of Large Language Models",
		dates: "Jul 2024 – Oct 2025",
		description:
			"Studied recurring patterns in successful prompt injection attacks against an LLM, using the Tensor Trust dataset of real player-submitted attacks. Embedded and clustered 7,178 unique successful attacks (sentence embeddings, t-SNE, HDBSCAN), finding 118 semantic clusters; the most repeated attacks ranged from direct instruction injection to rare-token and repeated-character spam.",
		githubLink: "https://github.com/Indiguana/LLM_weakness",
		poster: null,
	},
	{
		slug: "voice-cloning-laryngectomy",
		title: "Leveraging Generative AI to Synthesize the Lost Voice of Laryngectomy Patients",
		dates: "Aug 2023 – Jun 2024",
		description:
			"Fine-tuned Matcha-TTS (an encoder-decoder TTS model trained with Optimal-Transport Conditional Flow Matching) on a single target speaker's voice to let laryngectomy patients regain their voice identity. The 14M-parameter model reached a Mean Opinion Score of 3.66/5 and a real-time factor of 0.038 — fast enough for live conversation — then was exported to ONNX for lightweight, on-device inference.",
		githubLink: "https://github.com/Indiguana/otcfm-VoiceClone",
		poster: "/images/posters/voice-cloning-laryngectomy.jpg",
	},
	{
		slug: "calorie-tracker",
		title: "Leveraging Deep Learning for Tracking Calories in Food",
		dates: "Oct 2022 – Mar 2023",
		description:
			"Trained a deep-learning model (MobileNetV2 transfer learning, 56 food classes, ~91% test accuracy) to recognize food from a photo and estimate its calorie content, aimed at replacing error-prone manual calorie tracking. Built as a Streamlit app with automatic calorie lookup.",
		githubLink: "https://github.com/Indiguana/ComputerVision-Calorie-Tracker",
		poster: "/images/posters/calorie-tracker.jpg",
	},
	{
		slug: "drone-debris-detector",
		title: "Utilising Machine Learning to Detect Debris in Lakes and Rivers",
		dates: "Sep 2020 – Feb 2021",
		description:
			"Flew a drone over local water bodies (including Cypress Creek) and ran two pretrained object detectors, Darknet and YOLOv3 (no fine-tuning), to identify debris, then manually checked detections against what was actually in each scene. YOLOv3 reached ~32% accuracy vs. ~7% for Darknet; common materials like glass, plastic, and cans were identified far more reliably than irregular debris. Also tested robustness against Gaussian noise and partial/cropped images.",
		githubLink: "https://github.com/Indiguana/ComputerVision-Drone-Debris-Detector",
		poster: "/images/posters/drone-debris-detector.jpg",
	},
];
