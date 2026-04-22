// scripts/legacy-edges.js — snapshot of docs/data.js edges as of 2026-04-22
// AUTO-LOADED by scripts/compile-nodes.mjs via vm.runInContext.
// Do not hand-edit after new md nodes are added — prefer migrating to raw/nodes/.

const LEGACY_EDGES = [
  // 중심에서 대주제로
  ["vibe","intent"], ["vibe","llm-basics"], ["vibe","claude-code"], ["vibe","git"],
  ["vibe","tdd"], ["vibe","serverless"], ["vibe","db-basics"], ["vibe","pitfalls"],

  // Mindset 내부
  ["intent","requirements"], ["intent","prompt-eng"], ["intent","context-eng"],
  ["prompt-eng","context-eng"], ["context-eng","cc-rules"],
  ["convergence","small-steps"], ["convergence","simplify"],
  ["small-steps","tdd"], ["simplify","refactor"],
  ["pitfalls","hallucination"], ["pitfalls","review-mindset"],
  ["pitfalls","env"], ["review-mindset","pr"],
  ["intent","convergence"],

  // AI 내부
  ["llm-basics","hallucination"], ["llm-basics","ai-coding-tools"],
  ["ai-coding-tools","claude-code"], ["ai-coding-tools","ide"],
  ["claude-code","cc-settings"], ["claude-code","cc-skills"],
  ["claude-code","cc-hooks"], ["claude-code","cc-commands"],
  ["claude-code","cc-rules"], ["claude-code","mcp"],
  ["claude-code","agentic"], ["agentic","mcp"],
  ["mcp","api"],

  // Tool 내부
  ["terminal","git"], ["git","git-basics"], ["git","trunk"],
  ["git","github"], ["github","pr"], ["github","cicd"],
  ["terminal","package-mgr"], ["package-mgr","framework"],
  ["debug","monitoring"], ["ide","claude-code"],
  ["lint","refactor"], ["lint","cicd"],

  // Tech 내부
  ["tdd","testing"], ["testing","ut"], ["testing","it"], ["testing","e2e"],
  ["api","rest"], ["api","graphql"],
  ["env","cicd"], ["container","microservices"],
  ["framework","api"],

  // Data 내부
  ["db-basics","sql"], ["db-basics","nosql"],
  ["sql","sql-vs-nosql"], ["nosql","sql-vs-nosql"],
  ["db-basics","dw"], ["dw","datalake"], ["db-basics","db-vs-dw"],
  ["dw","db-vs-dw"], ["datalake","db-vs-dw"],
  ["nosql","dynamodb"],

  // Ops 내부
  ["serverless","lambda"], ["serverless","apigw"],
  ["serverless","dynamodb"], ["serverless","s3"],
  ["cicd","vercel"], ["vercel","domain"],
  ["monitoring","cost"], ["cicd","env"],
  ["framework","vercel"],

  // 크로스 카테고리
  ["tdd","agentic"], ["agentic","testing"],
  ["prompt-eng","debug"], ["debug","hallucination"],
  ["trunk","cicd"], ["pr","cicd"],
  ["db-basics","api"], ["container","cicd"],
  ["cc-hooks","lint"], ["cc-commands","agentic"],
  ["mcp","db-basics"], ["requirements","tdd"],
];

if (typeof module !== 'undefined') module.exports = LEGACY_EDGES;
if (typeof globalThis !== 'undefined') globalThis.LEGACY_EDGES = LEGACY_EDGES;
