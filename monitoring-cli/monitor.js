import si from "systeminformation";
import pkg from 'terminal-kit';
const { terminal, ScreenBuffer, TextBuffer } = pkg;
import { exec } from 'child_process';
import { XMLParser } from 'fast-xml-parser';

const getProgressBar = (max, value) => {
  const p = Math.ceil(value / max * 100);
  const twoLen = Math.ceil(p / 2);
  const oneLen = (p % 2);
  const spaceLen = 100 - twoLen - oneLen;
  return `${"⣿".repeat(twoLen)}${"⣇".repeat(oneLen)}${"⣀".repeat(spaceLen)}`;
};

let sb = null;
let tb = null;

const initUI = () => {
  terminal.fullscreen(true);
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
    productName: gpuData.product_name,
  };
};

const getAllInfo = async () => {
  const cpuLoad = await si.currentLoad();
  const memData = await si.mem();
  let gpuData = null;
  try { gpuData = await getGpuInfo(); } catch {}
  return { cpuLoad, memData, gpuData };
};

const displayInfo = (info) => {
  let out = '';

  info.cpuLoad.cpus.forEach((core, index) => {
    out += `Core ${index + 1}: ${getProgressBar(100, core.load)}\n`;
  });

  out += `Memory: ${getProgressBar(info.memData.total, info.memData.active)}\n`;

  if (info.gpuData) {
    const g = formatGpuData(info.gpuData);
    out += `${g.productName}:\n`;
    out += `  VRAM: ${getProgressBar(100, g.vramUsagePercent)}\n`;
    out += `  GPU:  ${getProgressBar(100, g.gpuUtil)}\n`;
    out += `  Temp: ${getProgressBar(100, g.gpuTemp)}\n`;
  }

  tb.setText(out);
  tb.draw();
  sb.draw({ delta: true });
};

const polling = async () => {
  const info = await getAllInfo();
  displayInfo(info);
  setTimeout(polling, 1000);
};

initUI();
polling();
