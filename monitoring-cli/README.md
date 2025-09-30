# Monitoring CLI

## 概要

− 前提条件
    − Linux
    − Nvidia GPU シングルのみ

## 設定

`sudo dmidecode` で、パスワード不要にする。

```bash
# 新しい設定ファイルを作成
echo "high-u ALL=(ALL) NOPASSWD: /usr/sbin/dmidecode" | sudo tee /etc/sudoers.d/99-dmidecode-nopasswd

# パーミッションを設定
sudo chmod 440 /etc/sudoers.d/99-dmidecode-nopasswd

# 構文チェック
sudo visudo -c
```
