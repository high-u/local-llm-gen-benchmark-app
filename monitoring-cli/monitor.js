import si from "systeminformation";
import pkg from 'terminal-kit';
const { terminal, ScreenBuffer, TextBuffer } = pkg;   // ★ ScreenBuffer/TextBuffer を使う
import { exec } from 'child_process';
import { XMLParser } from 'fast-xml-parser';

const getProgressBar = (max, value) => {
  const p = Math.round(value / max * 100);
  const twoLen = Math.round(p / 2);
  const oneLen = (p % 2);
  const space = " ".repeat(100 - twoLen);
  return `|${"⣿".repeat(twoLen)}${space}|`;
};

// --- ここから UI 初期化（★追加） ---
let sb = null;   // ScreenBuffer
let tb = null;   // TextBuffer

const initUI = () => {
  terminal.fullscreen(true);   // 代替スクリーン＆クリアは初回のみ（毎ループで呼ばない）
  terminal.hideCursor();

  sb = new ScreenBuffer({
    dst: terminal,
    width: terminal.width,
    height: terminal.height
  });

  tb = new TextBuffer({
    dst: sb,
    width: terminal.width,
    height: terminal.height
  });
};
// --- UI 初期化ここまで ---

terminal.on('key', (name) => {
  if (name === 'CTRL_C') {
    terminal.fullscreen(false);
    terminal.grabInput(false);
    terminal.processExit(0);
  }
});

terminal.grabInput({ mouse: false });

const getGpuInfo = () => {
  return new Promise((resolve, reject) => {
    exec('nvidia-smi -q -x', (error, stdout, stderr) => {
      if (error) { reject(error); return; }
      if (stderr) { reject(new Error(stderr)); return; }
      try {
        const parser = new XMLParser();
        const jsonData = parser.parse(stdout);
        const gpuData = {
          product_name: jsonData.nvidia_smi_log?.gpu?.product_name,
          fb_memory_usage: jsonData.nvidia_smi_log?.gpu?.fb_memory_usage,
          utilization: jsonData.nvidia_smi_log?.gpu?.utilization,
          temperature: jsonData.nvidia_smi_log?.gpu?.temperature,
        };
        resolve(gpuData);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

const formatGpuData = (gpuData) => {
  if (!gpuData) return null;
  const vramTotal = parseInt(gpuData.fb_memory_usage?.total?.replace(' MiB', '')) || 0;
  const vramUsed = parseInt(gpuData.fb_memory_usage?.used?.replace(' MiB', '')) || 0;
  const vramUsagePercent = vramTotal > 0 ? (vramUsed / vramTotal) * 100 : 0;
  const gpuUtil = parseInt(gpuData.utilization?.gpu_util?.replace(' %', '')) || 0;
  const gpuTemp = parseInt(gpuData.temperature?.gpu_temp?.replace(' C', '')) || 0;
  return {
    vramUsagePercent,
    gpuUtil,
    gpuTemp,
    productName: gpuData.product_name || 'NVIDIA GPU'
  };
};

const getAllInfo = async () => {
  const cpuLoad = await si.currentLoad();
  const memData = await si.mem();
  let gpuData = null;
  try { gpuData = await getGpuInfo(); } catch {}
  return { cpuLoad, memData, gpuData };
};

// ★ displayInfo: 端末へ直書きせず TextBuffer→ScreenBuffer→delta 描画
const displayInfo = (info) => {
  let out = '';

  // CPU
  info.cpuLoad.cpus.forEach((core, index) => {
    out += `Core ${index + 1}: ${getProgressBar(100, core.load)}\n`;
  });

  // MEM
  out += `Memory: ${getProgressBar(info.memData.total, info.memData.active)}\n`;

  // GPU
  if (info.gpuData) {
    const g = formatGpuData(info.gpuData);
    out += `${g.productName}:\n`;
    out += `  VRAM: ${getProgressBar(100, g.vramUsagePercent)}\n`;
    out += `  GPU:  ${getProgressBar(100, g.gpuUtil)}\n`;
    out += `  Temp: ${getProgressBar(100, g.gpuTemp)}\n`;
  }

  // TextBuffer にまとめて流し込み → ScreenBuffer へ draw → 端末へ delta 描画
  tb.setText(out);
  tb.draw();                 // TextBuffer -> ScreenBuffer
  sb.draw({ delta: true });  // ScreenBuffer -> terminal（差分描画でちらつき抑制）
};

const polling = async () => {
  // ★ ここで fullscreen() は絶対に呼ばない（initUI で初回のみ）
  const info = await getAllInfo();
  displayInfo(info);
  setTimeout(polling, 1000);
};

// --- エントリポイント ---
initUI();
polling();
