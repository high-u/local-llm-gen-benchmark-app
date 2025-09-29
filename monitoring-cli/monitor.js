import si from "systeminformation";
import pkg from 'terminal-kit';
const { terminal, ScreenBuffer, TextBuffer } = pkg;
import { exec } from 'child_process';
import { XMLParser } from 'fast-xml-parser';

const getProgressBar = (max, value) => {
  const p = Math.ceil(value / max * 100);
  const twoLen = Math.trunc(p / 2);
  const oneLen = (p % 2);
  const spaceLen = 50 - twoLen - oneLen;
  return `${"⣿".repeat(twoLen)}${"⣇".repeat(oneLen)}${"⣀".repeat(spaceLen)}`;
};

const formatNumber = (value) => {
  return Math.ceil(value).toString().padStart(3, ' ');
};

const formatGB = (bytes) => {
  const gb = bytes / (1024 * 1024 * 1024);
  return gb.toFixed(2);
};

const formatMB = (bytes) => {
  const gb = bytes / 1024;
  return gb.toFixed(2);
};

let sb = null;
let tb = null;
let dmidecodeInfo = null;

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
          gpu_power_readings: jsonData.nvidia_smi_log?.gpu?.gpu_power_readings,
        };
        resolve(gpuData);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

const getDmidecodeInfo = () => {
  return new Promise((resolve) => {
    exec('sudo dmidecode', (error, stdout) => {
      if (error) {
        resolve({
          cpu: 'NO DATA',
          memory: ['NO DATA']
        });
        return;
      }
      
      try {
        const parsed = parseDmidecodeOutput(stdout);
        resolve(parsed);
      } catch (parseError) {
        resolve({
          cpu: 'NO DATA',
          memory: ['NO DATA']
        });
      }
    });
  });
};

const parseDmidecodeOutput = (output) => {
  const lines = output.split('\n');
  let cpuVersion = 'NO DATA';
  let memoryInfo = [];
  
  let inCpuSection = false;
  let inMemorySection = false;
  let currentMemory = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // CPUセクション
    if (line === 'Processor Information') {
      inCpuSection = true;
      inMemorySection = false;
      continue;
    }
    
    // メモリセクション
    if (line === 'Memory Device') {
      inCpuSection = false;
      inMemorySection = true;
      currentMemory = {};
      continue;
    }
    
    // セクションの終了（空行または次のDMIタイプ）
    if (line === '' || line.startsWith('Handle')) {
      if (inMemorySection && currentMemory.manufacturer) {
        // イミュータブル：新しい配列を作成
        const memoryString = `${currentMemory.manufacturer} ${currentMemory.type || 'NO DATA'} ${currentMemory.speed || 'NO DATA'} ${currentMemory.size || 'NO DATA'}`;
        memoryInfo = [...memoryInfo, memoryString];
      }
      inCpuSection = false;
      inMemorySection = false;
      continue;
    }
    
    // 情報抽出
    if (inCpuSection && line.startsWith('Version:')) {
      cpuVersion = line.split(':')[1].trim();
    }
    
    if (inMemorySection) {
      if (line.startsWith('Manufacturer:')) {
        currentMemory = { ...currentMemory, manufacturer: line.split(':')[1].trim() };
      } else if (line.startsWith('Type:') && !line.includes('Type Detail:')) {
        currentMemory = { ...currentMemory, type: line.split(':')[1].trim() };
      } else if (line.startsWith('Speed:')) {
        currentMemory = { ...currentMemory, speed: line.split(':')[1].trim() };
      } else if (line.startsWith('Size:') && !line.includes('No Module Installed')) {
        currentMemory = { ...currentMemory, size: line.split(':')[1].trim() };
      }
    }
  }
  
  return {
    cpu: cpuVersion,
    memory: memoryInfo.length > 0 ? memoryInfo : ['NO DATA']
  };
};

const formatGpuData = (gpuData) => {
  if (!gpuData) return null;

  // console.error("usage: ", gpuData.fb_memory_usage.total);
  // console.error("used: ", gpuData.fb_memory_usage.used);

  const vramTotal = parseInt(gpuData.fb_memory_usage?.total?.replace(' MiB', '')) || 0;
  const vramReserved = parseInt(gpuData.fb_memory_usage?.reserved?.replace(' MiB', '')) || 0;
  const vramUsed = vramReserved + parseInt(gpuData.fb_memory_usage?.used?.replace(' MiB', '')) || 0;
  

  // console.error("usage: ", vramTotal);
  // console.error("used: ", vramUsed);

  const vramUsagePercent = vramTotal > 0 ? (vramUsed / vramTotal) * 100 : 0;
  const gpuUtil = parseInt(gpuData.utilization?.gpu_util?.replace(' %', '')) || 0;
  const gpuTemp = parseInt(gpuData.temperature?.gpu_temp?.replace(' C', '')) || 0;
  const instantPower = parseFloat(gpuData.gpu_power_readings?.instant_power_draw?.replace(' W', '')) || 0;
  const defaultPowerLimit = parseFloat(gpuData.gpu_power_readings?.default_power_limit?.replace(' W', '')) || 0;
  const powerUsagePercent = defaultPowerLimit > 0 ? (instantPower / defaultPowerLimit) * 100 : 0;
  
  return {
    vramTotal,
    vramUsed,
    vramUsagePercent,
    gpuUtil,
    gpuTemp,
    productName: gpuData.product_name,
    instantPower,
    defaultPowerLimit,
    powerUsagePercent,
  };
};

const getAllInfo = async () => {
  const cpuLoad = await si.currentLoad();
  const cpuInfo = await si.cpu();
  const cpuTemperature = await si.cpuTemperature();
  const memData = await si.mem();
  const memLayoutData = await si.memLayout();
  let gpuData = null;
  try { gpuData = await getGpuInfo(); } catch {}
  return { cpuLoad, cpuInfo, cpuTemperature, memData, memLayoutData, gpuData };
};

const displayInfo = (info) => {
  let out = '';

  // GPU Section
  if (info.gpuData) {
    const g = formatGpuData(info.gpuData);
    out += `GPU\n`;
    out += `    ${g.productName}\n`;
    out += `        LOAD\n`;
    out += `        ${getProgressBar(100, g.gpuUtil)} ${formatNumber(g.gpuUtil)} %\n`;
    out += `        VRAM ${formatMB(g.vramUsed)} GB / ${formatMB(g.vramTotal)} GB\n`;
    out += `        ${getProgressBar(100, g.vramUsagePercent)} ${formatNumber(g.vramUsagePercent)} %\n`;
    out += `        POWER ${formatNumber(g.instantPower)} W / ${formatNumber(g.defaultPowerLimit)} W\n`;
    out += `        ${getProgressBar(100, g.powerUsagePercent)} ${formatNumber(g.powerUsagePercent)} %\n`;
    out += `        TEMPERATURE ${formatNumber(g.gpuTemp)} ℃\n`;
    // out += `    ${getProgressBar(100, g.gpuTemp)}\n`;
  }
  out += "\n";

  // MEMORY Section
  out += `MEMORY\n`;
  dmidecodeInfo.memory.forEach((memoryInfo) => {
    out += `    ${memoryInfo}\n`;
  });
  
  // RAM
  const ramUsedGB = formatGB(info.memData.active);
  const ramTotalGB = formatGB(info.memData.total);
  const ramUsagePercent = info.memData.total > 0 ? (info.memData.active / info.memData.total) * 100 : 0;
  out += `        RAM ${ramUsedGB} GB / ${ramTotalGB} GB\n`;
  out += `        ${getProgressBar(100, ramUsagePercent)} ${formatNumber(ramUsagePercent)} %\n`;
  
  // SWAP
  const swapUsedGB = formatGB(info.memData.swapused);
  const swapTotalGB = formatGB(info.memData.swaptotal);
  const swapUsagePercent = info.memData.swaptotal > 0 ? (info.memData.swapused / info.memData.swaptotal) * 100 : 0;
  out += `        SWAP ${swapUsedGB} GB / ${swapTotalGB} GB\n`;
  out += `        ${getProgressBar(100, swapUsagePercent)} ${formatNumber(swapUsagePercent)} %\n`;

  out += "\n";

  // CPU Section
  out += `CPU\n`;
  const cpuName = dmidecodeInfo ? dmidecodeInfo.cpu : `${info.cpuInfo.manufacturer} ${info.cpuInfo.brand}`;
  out += `    ${cpuName}\n`;
  out += `        LOAD\n`;
  info.cpuLoad.cpus.forEach((core) => {
    out += `        ${getProgressBar(100, core.load)} ${formatNumber(core.load)} %\n`;
  });
  const cpuTemp = info.cpuTemperature.main || 0;
  out += `        TEMPERATURE ${formatNumber(cpuTemp)} ℃\n`;
  // out += `    ${getProgressBar(100, cpuTemp)}\n`;

  tb.setText(out);
  tb.draw();
  sb.draw({ delta: true });
};

const initDmidecodeInfo = async () => {
  try {
    dmidecodeInfo = await getDmidecodeInfo();
  } catch (error) {
    dmidecodeInfo = {
      cpu: 'NO DATA',
      memory: ['NO DATA']
    };
  }
};

const polling = async () => {
  const info = await getAllInfo();
  displayInfo(info);
  setTimeout(polling, 1000);
};

initUI();
await initDmidecodeInfo();
polling();
