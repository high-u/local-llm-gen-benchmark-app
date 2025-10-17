# sinclusionAI

## ビルド

```bash
git clone https://github.com/im0qianqian/llama.cpp.git
cd llama.cpp

cmake -B build -DGGML_CUDA=ON
cmake --build build
```

## サーバー起動

```bash
./build/bin/llama-server -hf inclusionAI/Ring-flash-2.0-GGUF:Q4_K_M --jinja --ctx-size 32768 --threads 6 --n-cpu-moe 27
```

```bash
./build/bin/llama-server -hf inclusionAI/Ring-mini-2.0-GGUF:Q8_0 --jinja --ctx-size 32768 --n-gpu-layers 0 --device none --no-op-offload --mlock --threads 6
```

## リクエスト

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
