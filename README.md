# README

## Servers

### on VRAM

#### LiquidAI/LFM2-1.2B

- lfm2.context_length u32 : `128,000`

```bash
llama-server -hf LiquidAI/LFM2-1.2B-GGUF:Q8_0 --jinja --ctx-size 32768
```

#### Menlo/Jan-nano

- qwen3.context_length u32: `40,960`

```bash
llama-server -hf Menlo/Jan-nano-gguf:Q8_0 --jinja --ctx-size 32768
```

#### Qwen/Qwen3-4B-Instruct-2507

- qwen3.context_length u32: `262,144`

```bash
llama-server -hf unsloth/Qwen3-4B-Instruct-2507-GGUF:Q8_0 --jinja --ctx-size 32768
```

#### zai-org/GLM-4-9B-0414

- glm4.context_length u32: `32,768`

```bash
llama-server -hf unsloth/GLM-4-9B-0414-GGUF:Q8_0 --jinja --ctx-size 32768
```

#### nvidia/NVIDIA-Nemotron-Nano-9B-v2

- nemotron_h.context_length u32: `1,048,576`

```bash
llama-server -hf bartowski/nvidia_NVIDIA-Nemotron-Nano-9B-v2-GGUF:Q8_0 --jinja --ctx-size 32768
```

#### nvidia/NVIDIA-Nemotron-Nano-12B-v2

- nemotron_h.context_length u32: `1,048,576`

```bash
llama-server -hf bartowski/nvidia_NVIDIA-Nemotron-Nano-12B-v2-GGUF:Q6_K_L --jinja --ctx-size 32768
```

#### aquif-ai/aquif-3-moe-17B-A2.8B-Think

- bailingmoe.context_length u32: `32,768`

```bash
llama-server -hf mradermacher/aquif-3-moe-17b-a2.8b-thinking-GGUF:Q4_K_M --jinja --ctx-size 32768
```

#### openai/gpt-oss-20b

- gpt-oss.context_length u32: `13,1072`

```bash
llama-server -hf ggml-org/gpt-oss-20b-GGUF --jinja --ctx-size 32768
```

#### qwen3-30b-a3b-instruct-2507

- qwen3moe.context_length u32: `262,144`

```bash
llama-server -hf Intel/Qwen3-30B-A3B-Instruct-2507-gguf-q2ks-mixed-AutoRound --jinja --ctx-size 32768
```

### over VRAM (MoE)

#### aquif-ai/aquif-3-moe-17B-A2.8B

- bailingmoe.context_length u32: `32,768`
- bailingmoe.block_count u32: `28`
- bailingmoe.expert_used_count u32: `6`
- bailingmoe.expert_count u32: `64`

```bash
llama-server -hf mradermacher/aquif-3-moe-17b-a2.8b-thinking-GGUF:Q8_0 --jinja --ctx-size 32768 --n-cpu-moe 10
```

#### baidu/ERNIE-4.5-21B-A3B-Thinking

- ernie4_5-moe.context_length u32: `131,072`
- ernie4_5-moe.block_count u32: `28`
- ernie4_5-moe.expert_used_count u32: `6`
- ernie4_5-moe.expert_count u32: `64`

```bash
llama-server -hf unsloth/ERNIE-4.5-21B-A3B-Thinking-GGUF:Q8_0 --jinja --ctx-size 32768 --n-cpu-moe 14
```

#### DavidAU/Qwen3-30B-A1.5B-High-Speed

- qwen3moe.context_length u32: `65,536`
- qwen3moe.block_count u32: `48`
- qwen3moe.expert_used_count u32: `4`
- qwen3moe.expert_count u32: `128`

```bash
llama-server -hf DavidAU/Qwen3-30B-A1.5B-64K-High-Speed-NEO-Imatrix-MAX-gguf:Q6_K --jinja --ctx-size 32768 --n-cpu-moe 28
```

#### Qwen/Qwen3-30B-A3B-Instruct-2507

- qwen3moe.context_length u32: `262,144`
- qwen3moe.block_count u32: `48`
- qwen3moe.expert_used_count u32: `8`
- qwen3moe.expert_count u32: `128`

```bash
llama-server -hf unsloth/Qwen3-30B-A3B-Instruct-2507-GGUF:Q8_0 --jinja --ctx-size 32768 --n-cpu-moe 32
```

#### meta-llama/Llama-4-Scout-17B-16E-Instruct

- llama4.context_length u32: `10,485,760`
- llama4.block_count u32: `48`
- llama4.expert_used_count u32: `1`
- llama4.expert_count u32: `16`

```bash
llama-server -hf unsloth/Llama-4-Scout-17B-16E-Instruct-GGUF:Q4_K_M --jinja --ctx-size 32768 --n-cpu-moe 45
```

#### zai-org/GLM-4.5-Air

- glm4moe.context_length u32: `131,072`
- glm4moe.block_count u32: `47`
- glm4moe.expert_used_count u32: `8`
- glm4moe.expert_count u32: `128`

```bash
llama-server -hf unsloth/GLM-4.5-Air-GGUF:Q4_K_M --jinja --ctx-size 32768 --n-cpu-moe 43
```

#### openai/gpt-oss-120b

- gpt-oss.context_length u32: `131,072`
- gpt-oss.block_count u32: `36`
- gpt-oss.expert_count u32: `128`
- gpt-oss.expert_used_count u32: `4`

```bash
llama-server -hf ggml-org/gpt-oss-120b-GGUF --jinja --ctx-size 32768 --n-cpu-moe 29
```

#### Qwen/Qwen3-235B-A22B-Instruct-2507

- qwen3moe.context_length u32: `262,144`
- qwen3moe.block_count u32: `94`
- qwen3moe.expert_used_count u32: `8`
- qwen3moe.expert_count u32: `128`

```bash
llama-server -hf Intel/Qwen3-235B-A22B-Instruct-2507-gguf-q2ks-mixed-AutoRound --jinja --ctx-size 32768 --n-cpu-moe 88
```

## Endpoints

```bash
curl -s "http://localhost:8080/v1/chat/completions" \
-H "Content-Type: application/json" \
-d '{
  "messages": [
    {"role": "user", "content": "Hello"}
  ],
  "stream": true,
  "timings_per_token": true
}'
```

```bash
curl http://localhost:8080/v1/models

curl http://localhost:8080/props

curl http://localhost:8080/health

curl -H "Content-Type: application/json" -d '{"content": "Hello LLM"}' http://localhost:8080/tokenize

curl -H 'Content-Type: application/json' -d '{"tokens":[13225,451,19641]}' http://localhost:8080/detokenize
```

## Web UI

http://127.0.0.1:8080

## Download Model Files

```bash
ls -la ~/.cache/llama.cpp/
```
