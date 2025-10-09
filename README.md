# README

## GPU

### Less than VRAM

#### 9B (1)

- glm4.context_length u32: `32,768`

```bash
llama-server -hf unsloth/GLM-4-9B-0414-GGUF:Q8_0 --jinja --ctx-size 32768
```

#### 9B (2)

- nemotron_h.context_length u32: `1,048,576`

```bash
llama-server -hf bartowski/nvidia_NVIDIA-Nemotron-Nano-9B-v2-GGUF:Q8_0 --jinja --ctx-size 32768
```

#### 12B (1)

- nemotron_h.context_length u32: `1,048,576`

```bash
llama-server -hf bartowski/nvidia_NVIDIA-Nemotron-Nano-12B-v2-GGUF:Q8_0 --jinja --ctx-size 32768
```

#### 12 (2)

- gemma3.context_length u32: `131,072`

```bash
llama-server -hf unsloth/gemma-3-12b-it-GGUF:Q6_K_XL --jinja --ctx-size 32768
```

#### 14B

PHI-4

- phi3.context_length u32: `32,768`

```bash
llama-server -hf unsloth/Phi-4-reasoning-plus-GGUF:IQ4_NL --jinja --ctx-size 32768
```

- qwen3.context_length u32: `40,960`

```bash
llama-server -hf Qwen/Qwen3-14B-GGUF:Q5_K_M --jinja --ctx-size 32768
```

#### 20B MoE

- gpt-oss.context_length u32: `13,1072`

```bash
llama-server -hf ggml-org/gpt-oss-20b-GGUF --jinja --ctx-size 32768
```

```bash
llama-server -hf ggml-org/gpt-oss-20b-GGUF --jinja --ctx-size 32768 --chat-template-kwargs '{"reasoning_effort": "high"}'
```

#### 27B

- gemma3.context_length u32: `131,072`

```bash
llama-server -hf unsloth/gemma-3-27b-it-qat-GGUF:IQ3_XXS --jinja --ctx-size 32768
```

```bash
llama-server -hf unsloth/gemma-3-27b-it-qat-GGUF:IQ4_XS --jinja --ctx-size 32768 --no-kv-offload
```

#### 32B

- glm4.context_length u32: `32,768`

```bash
llama-server -hf bartowski/THUDM_GLM-4-32B-0414-GGUF:IQ3_M --jinja --ctx-size 32768 --no-kv-offload
```

#### 36B

- seed_oss.context_length u32: `524,288`

```bash
llama-server -hf unsloth/Seed-OSS-36B-Instruct-GGUF:IQ3_XXS --jinja --ctx-size 32768 --no-kv-offload
```

### More than VRAM

#### 30B-A3B

- qwen3moe.context_length u32: `262,144`
- qwen3moe.block_count u32: `48`
- qwen3moe.expert_used_count u32: `8`
- qwen3moe.expert_count u32: `128`

```bash
llama-server -hf unsloth/Qwen3-30B-A3B-Thinking-2507-GGUF:IQ4_NL --jinja --ctx-size 32768 --threads 6 --n-cpu-moe 14
```

```bash
llama-server -hf unsloth/Qwen3-30B-A3B-Instruct-2507-GGUF:Q8_0 --jinja --ctx-size 32768 --threads 6 --n-cpu-moe 31
```

#### 30B-A6B

```bash
llama-server -hf Mungert/Qwen3-30B-A6B-16-Extreme-GGUF:IQ4_NL --jinja --ctx-size 32768 --threads 6 --n-cpu-moe 14
```

#### 106B-A12B

- glm4moe.context_length u32: `131,072`
- glm4moe.block_count u32: `47`
- glm4moe.expert_used_count u32: `8`
- glm4moe.expert_count u32: `128`

```bash
llama-server -hf unsloth/GLM-4.5-Air-GGUF:IQ4_XS --jinja --ctx-size 32768 --threads 6 --n-cpu-moe 42
```

```bash
llama-server -hf unsloth/GLM-4.5-Air-GGUF:IQ2_M --jinja --ctx-size 32768 --threads 6 --n-cpu-moe 40
```

#### 117B-A5.1B

- gpt-oss.context_length u32: `131,072`
- gpt-oss.block_count u32: `36`
- gpt-oss.expert_count u32: `128`
- gpt-oss.expert_used_count u32: `4`

```bash
llama-server -hf ggml-org/gpt-oss-120b-GGUF --jinja --ctx-size 32768 --threads 6 --n-cpu-moe 29
```

#### 235B-A22B

- qwen3moe.context_length u32: `262,144`
- qwen3moe.block_count u32: `94`
- qwen3moe.expert_used_count u32: `8`
- qwen3moe.expert_count u32: `128`

```bash
llama-server -hf bartowski/Qwen_Qwen3-235B-A22B-Instruct-2507-GGUF:IQ2_XS --jinja --ctx-size 32768 --threads 6 --n-cpu-moe 88
```

## CPU

```bash
llama-server -hf unsloth/gemma-3-270m-it-GGUF:Q8_0 --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6
```

```bash
llama-server -hf mradermacher/Luth-LFM2-1.2B-i1-GGUF:IQ4_NL --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6
```

```bash
llama-server -hf unsloth/Qwen3-1.7B-GGUF:IQ4_NL --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6
```

```bash
llama-server -hf mradermacher/LFM2-2.6B-i1-GGUF:IQ4_NL --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6
```

```bash
llama-server -hf unsloth/Jan-nano-GGUF:IQ4_NL --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6
```

```bash
llama-server -hf unsloth/Qwen3-4B-Instruct-2507-GGUF:IQ4_NL --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6
```

```bash
llama-server -hf unsloth/granite-4.0-h-tiny-GGUF:IQ4_NL --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6
```

```bash
llama-server -hf ggml-org/gpt-oss-20b-GGUF --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6
```

```bash
llama-server -hf ggml-org/gpt-oss-20b-GGUF --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6 --chat-template-kwargs '{"reasoning_effort": "low"}'
```

```bash
llama-server -hf DavidAU/Qwen3-30B-A1.5B-64K-High-Speed-NEO-Imatrix-MAX-gguf:IQ4_NL --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6 --batch-size 512 --ubatch-size 512
```

```bash
llama-server -hf unsloth/Qwen3-30B-A3B-Instruct-2507-GGUF:IQ4_NL --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6
```

```bash
llama-server -hf ggml-org/gpt-oss-120b-GGUF --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6 --chat-template-kwargs '{"reasoning_effort": "low"}'
```

```bash
llama-server -hf LiquidAI/LFM2-8B-A1B-GGUF:Q8_0 --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6
```

```bash
llama-server -hf gabriellarson/LFM2-8B-A1B-GGUF:MXFP4_MOE --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6
```

## llama-server endpoints

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

## llama-server Web UI

http://127.0.0.1:8080

## Download Model Files

```bash
ls -1 ~/.cache/llama.cpp/
```
