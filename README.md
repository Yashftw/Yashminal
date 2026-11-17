# Yashminal - VIPERINE ARCHIVE

An interactive, retro-cyberpunk terminal and desktop OS portfolio built with React, TypeScript, Tailwind CSS, Three.js, and WebAssembly.

---

## Overview

Yashminal is a portfolio designed as an interactive retro-futuristic operating system. It features a CRT procedural grid shader, draggable windows, desktop applications, an interactive command-line shell, an ambient soundscape, an animated companion guide, and a WebAssembly port of classic DOOM.

---

## Featured Projects

### 1. Serverless Intelligence Document Pipeline
- **Status**: Stable
- **Tech Stack**: AWS, Step Functions, Textract, DynamoDB, Python, Gemini AI
- **Overview**: An event-driven serverless document extraction pipeline with human-in-the-loop review.
- **Architecture**: Decoupled ingestion via presigned S3 URLs, asynchronous Textract OCR coordinated by AWS Step Functions, Gemini-based document classification and field extraction, Pydantic validation schemas, a multi-factor confidence scoring gate, and a dedicated review queue.
- **Source**: [github.com/Yashftw/Serverless-document-intelligence-pipeline](https://github.com/Yashftw/Serverless-document-intelligence-pipeline)

### 2. RAG Based Local AI
- **Status**: Operational
- **Tech Stack**: Python, LangChain, Ollama, ChromaDB, FastAPI
- **Overview**: A privacy-focused Retrieval-Augmented Generation assistant running fully offline on local hardware.
- **Architecture**: Document chunking and vector embeddings indexed in ChromaDB, connected to quantized open-weight LLMs via Ollama for fast, contextual question-answering with zero data leakage and sub-second inference latency.
- **Source**: [github.com/Yashftw](https://github.com/Yashftw)

### 3. Brain Blox
- **Status**: Stable
- **Tech Stack**: React, TypeScript, Tailwind CSS, Supabase, Gemini AI
- **Overview**: An AI-powered study platform featuring automated flashcard creation and FSRS spaced repetition scheduling.
- **Architecture**: Automated PDF-to-flashcard generation using Gemini AI, with retention-optimized spaced repetition algorithms.
- **Live Demo**: [pixel-perfect-vision-cuemath-flashc-opal.vercel.app](https://pixel-perfect-vision-cuemath-flashc-opal.vercel.app/)
- **Source**: [github.com/Yashftw/Brainblox](https://github.com/Yashftw/Brainblox)

### 4. Help Me Fix It
- **Status**: Stable
- **Tech Stack**: React, Node.js, WebRTC
- **Overview**: Real-time collaborative troubleshooting platform.
- **Architecture**: Peer-to-peer WebRTC video and data channels for live assistance and interactive hardware/software problem diagnosis.
- **Live Demo**: [helpmefixit-production.vercel.app](https://helpmefixit-production.vercel.app/)
- **Source**: [github.com/Yashftw/Helpmefixit-production](https://github.com/Yashftw/Helpmefixit-production)

### 5. Multi Cloud Cost Dashboard
- **Status**: Work in Progress
- **Tech Stack**: Azure, AWS, GCP, React, Node.js
- **Overview**: Unified cloud cost intelligence and visibility platform aggregating spend across multi-cloud infrastructure.
- **Architecture**: REST aggregation services pulling normalized cost metrics from AWS Cost Explorer, Azure Cost Management, and Google Cloud Billing APIs with anomaly signals and savings alerts.

### 6. Odoo-Connected GenAI Assistant on Google Cloud
- **Status**: Work in Progress
- **Tech Stack**: Odoo, Generative AI, Google Cloud
- **Overview**: Enterprise conversational assistant integrated with Odoo ERP workflows deployed on Google Cloud infrastructure.

---

## System Applications and Features

- **Terminal**: In-browser CLI shell with commands like `whoami`, `projects`, `skills`, `neofetch`, `theme`, and `dragon`.
- **Project Archive**: Interactive holographic project browser with detailed architectural breakdowns, tech stack chips, and source links.
- **Skill Diagnostics**: Visual matrix categorizing skills across Cloud, DevOps, Programming, AI/ML, and Databases.
- **Capability Matrix**: Strategic objectives and technical milestones.
- **Nyx (Tutorial Guide)**: Pixel art companion offering contextual guidance as applications and tools are launched.
- **DOOM (1993)**: Original Linux DOOM v1.10 compiled to WebAssembly running client-side.
- **Audio Synthesizer**: Retro sound effects and ambient soundtrack loop.
- **GridScan Shader**: Hardware-accelerated procedural CRT scanline and distortion background rendered with Three.js.

---

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS, CSS variables, CRT post-processing filters
- **Graphics**: Three.js, WebGL procedural shaders
- **Icons**: Lucide React
- **Audio**: Web Audio API synthetic beeps and loops

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/Yashftw/yashminal.git
cd yashminal/yashminal-main

# Install dependencies
npm install

# Run the local development server
npm run dev

# Build for production
npm run build
```

---

## License

MIT License. Created by [Yashraj Yadav (Yashftw)](https://github.com/Yashftw).
