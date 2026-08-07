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
		dates: "Jul 2024 – Present",
		description:
			"Researching weaknesses of LLMs — prompt injection, overreliance on AI outputs, and supply chain vulnerabilities — using clustering algorithms alongside neural-network-based approaches to find effective countermeasures and make LLMs more secure, reliable, and trustworthy.",
		githubLink: null,
		poster: null,
	},
	{
		slug: "voice-cloning-laryngectomy",
		title: "Regenerating Voices for Laryngectomy Patients Using Voice Cloning",
		dates: "Aug 2023 – Jun 2024",
		description:
			"A person's voice is integral to their identity, yet many lose theirs to ailments like laryngitis or medical procedures. Built a voice-cloning system with MatchaTTS-based encoder-decoder neural networks that capture vocal nuances — pitch, accent — to generate high-fidelity, personalized voice replicas, refined through additional voice samples.",
		githubLink: null,
		poster: null,
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
			"Flew a drone over local water bodies (including Cypress Creek) and ran two pretrained object detectors — Darknet and YOLOv3, no fine-tuning — to identify debris, then manually checked detections against what was actually in each scene. YOLOv3 reached ~32% accuracy vs. ~7% for Darknet; common materials like glass, plastic, and cans were identified far more reliably than irregular debris. Also tested robustness against Gaussian noise and partial/cropped images.",
		githubLink: "https://github.com/Indiguana/ComputerVision-Drone-Debris-Detector",
		poster: "/images/posters/drone-debris-detector.jpg",
	},
];
