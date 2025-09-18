# README

## Small

```bash
# 済
llama-server -hf Menlo/Jan-nano-gguf:Q8_0 --ctx-size 32768 --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05
```

```bash
# 済
zai-org/GLM-4-9B-0414
llama-server -hf unsloth/GLM-4-9B-0414-GGUF:Q8_0 --ctx-size 32768 --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05
```

```bash
# 済
nvidia/NVIDIA-Nemotron-Nano-9B-v2
llama-server -hf bartowski/nvidia_NVIDIA-Nemotron-Nano-9B-v2-GGUF:Q8_0 --ctx-size 32768 --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05
```

```bash
# 済
nvidia/NVIDIA-Nemotron-Nano-12B-v2
llama-server -hf bartowski/nvidia_NVIDIA-Nemotron-Nano-12B-v2-GGUF:Q6_K_L --ctx-size 32768 --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05
```

```bash
# 済
Qwen/Qwen3-4B-Instruct-2507
llama-server -hf unsloth/Qwen3-4B-Instruct-2507-GGUF:Q8_0 --ctx-size 32768 --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05
```

```bash
# 済
qwen3-30b-a3b-instruct-2507
llama-server -hf Intel/Qwen3-30B-A3B-Instruct-2507-gguf-q2ks-mixed-AutoRound --ctx-size 32768 --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05
```

```bash
# 済
LiquidAI/LFM2-1.2B
llama-server -hf LiquidAI/LFM2-1.2B-GGUF:Q8_0 --ctx-size 32768 --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05
```

```bash
# 済
aquif-ai/aquif-3-moe-17B-A2.8B-Think
llama-server -hf mradermacher/aquif-3-moe-17b-a2.8b-thinking-GGUF:Q4_K_M --ctx-size 32768 --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05
```

```bash
# 済
openai/gpt-oss-20b
llama-server -hf ggml-org/gpt-oss-20b-GGUF --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05 --ctx-size 32768
```

## Over

```bash
glm-4-32b-0414

```

```bash
bytedance/seed-oss-36b
```

```bash

```

## MoE

```bash
# 済
# https://github.com/ggml-org/llama.cpp/discussions/15396
openai/gpt-oss-120b
llama-server -hf ggml-org/gpt-oss-120b-GGUF --jinja --temp 0.8 --top-k 40 --top-p 0.8 --min-p 0.05 --ctx-size 32768 --n-cpu-moe 32
```

```bash
Qwen/Qwen3-30B-A3B-Instruct-2507
llama-server -hf unsloth/Qwen3-30B-A3B-Instruct-2507-GGUF:Q8_0 --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05 --ctx-size 32768 --n-cpu-moe 32
```

```bash
DavidAU/Qwen3-30B-A1.5B-High-Speed
llama-server -hf DavidAU/Qwen3-30B-A1.5B-64K-High-Speed-NEO-Imatrix-MAX-gguf:Q6_K --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05 --ctx-size 32768 --n-cpu-moe 32
```

```bash
Qwen/Qwen3-235B-A22B-Instruct-2507
llama-server -hf Intel/Qwen3-235B-A22B-Instruct-2507-gguf-q2ks-mixed-AutoRound --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05 --ctx-size 32768 --n-cpu-moe 32
```

```bash
aquif-ai/aquif-3-moe-17B-A2.8B
llama-server -hf mradermacher/aquif-3-moe-17b-a2.8b-thinking-GGUF:Q8_0 --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05 --ctx-size 32768 --n-cpu-moe 32
```

```bash
ernie-4.5-21b-a3b-thinking
llama-server -hf xxx --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05 --ctx-size 32768 --n-cpu-moe 32
```

```bash
glm-4.5-air
llama-server -hf xxx --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05 --ctx-size 32768 --n-cpu-moe 32
```

```bash
meta-llama/Llama-4-Scout-17B-16E-Instruct
llama-server -hf xxx --jinja --temp 0.8 --top-k 40 --top-p 0.95 --min-p 0.05 --ctx-size 32768 --n-cpu-moe 32
```

## Request

```bash
LLAMA_SERVER="http://localhost:8080"
curl -s "${LLAMA_SERVER}/v1/chat/completions" \
-H "Content-Type: application/json" \
-d '{
  "messages": [
    {"role": "user", "content": "こんにちは！元気ですか？"}
  ],
  "stream": true,
  "timings_per_token": true
}'
```

```bash
ls -la ~/.cache/llama.cpp/
```
