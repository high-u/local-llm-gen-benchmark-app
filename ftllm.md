# ftllm

## インストール

### 環境作成

```bash
git clone https://github.com/ztxz16/fastllm.git
cd fastllm

uv init -p 3.12
uv venv
source .venv/bin/activate

uv run python -m ensurepip
```

### インストールスクリプト作成

install.sh では、CUDA を有効化したインストールできなかったため。

```bash
cat > install2.sh <<'EOF'
#!/bin/bash
folder="build-fastllm"
PYBIN="$(pwd)/.venv/bin/python"

# 创建工作文件夹
if [ ! -d "$folder" ]; then
    mkdir "$folder"
fi

cd "$folder"
cmake .. "$@" -DPYTHON_EXECUTABLE="${PYBIN}"
make -j"$(nproc)"

# 编译失败停止执行
if [ $? != 0 ]; then
    exit -1
fi

cd tools
"${PYBIN}" -m pip install '.[all]'
#python3 setup.py sdist build
#python3 setup.py bdist_wheel
#python3 setup.py install --all
EOF
```

### インストール

```bash
# 警告出るが気にしない。 "Successfully built ftllm" が表示されたら OK
uv run bash install2.sh -DUSE_CUDA=ON -DCUDA_ARCH=120 -D CMAKE_CUDA_COMPILER="$(which nvcc)"
```

### サーバー起動

```bash
# サーバー起動 GPU
uv run ftllm server "fastllm/Qwen3-Next-80B-A3B-Instruct-UD-Q4_K_M" --device cuda --moe_device cpu --threads 6
```

```bash
# サーバー起動 CPU
uv run ftllm server "fastllm/Qwen3-Next-80B-A3B-Instruct-UD-Q4_K_M" --device cpu --moe_device cpu --threads 6
```

## リクエスト

```bash
curl -s "http://localhost:8080/v1/chat/completions" \
-H "Content-Type: application/json" \
-d '{
  "messages": [
    {"role": "user", "content": "Hello"}
  ],
  "model": "fastllm/Qwen3-Next-80B-A3B-Instruct-UD-Q4_K_M",
  "stream": true,
  "timings_per_token": true
}'
```
