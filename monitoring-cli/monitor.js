import si from "systeminformation";
import pkg from 'terminal-kit';
const { terminal, ScreenBuffer, TextBuffer } = pkg;
import { exec } from 'child_process';
import { promisify } from 'util';
import { XMLParser } from 'fast-xml-parser';

const execAsync = promisify(exec);

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

// 色定数
const COLORS = {
  gpu: 'green', // cyan magenta yellow green blue red
  vram: 'magenta', 
  power: 'yellow',
  ram: 'magenta',
  swap: 'blue',
  cpu: 'cyan'
};

let sb = null;
let tb = null;
let dmidecodeInfo = null;
let progressBars = [];

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


const parseDmidecodeOutput = (output) => {
  const lines = output.split('\n');
  let cpuVersion = null;
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
        const memoryString = `${currentMemory.manufacturer} ${currentMemory.type || ''} ${currentMemory.speed || ''} ${currentMemory.size || ''}`.trim();
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
    memory: memoryInfo
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
  const cpuTemperature = await si.cpuTemperature();
  const memData = await si.mem();
  let gpuData = null;
  try { gpuData = await getGpuInfo(); } catch {}
  return { cpuLoad, cpuTemperature, memData, gpuData };
};

const displayInfo = (info) => {
  let out = '';
  let currentLine = 0;
  progressBars = []; // リセット

  // GPU Section
  if (info.gpuData) {
    const g = formatGpuData(info.gpuData);
    out += `GPU\n`;
    currentLine += 1;
    
    out += `    ${g.productName}\n`;
    currentLine += 1;
    
    out += `        LOAD\n`;
    currentLine += 1;
    
    out += `        ${getProgressBar(100, g.gpuUtil)} ${formatNumber(g.gpuUtil)} %\n`;
    progressBars = [...progressBars, {y: currentLine, x: 8, type: 'gpu', value: g.gpuUtil, text: getProgressBar(100, g.gpuUtil)}];
    currentLine += 1;
    
    out += `        VRAM ${formatMB(g.vramUsed)} GB / ${formatMB(g.vramTotal)} GB\n`;
    currentLine += 1;
    
    out += `        ${getProgressBar(100, g.vramUsagePercent)} ${formatNumber(g.vramUsagePercent)} %\n`;
    progressBars = [...progressBars, {y: currentLine, x: 8, type: 'vram', value: g.vramUsagePercent, text: getProgressBar(100, g.vramUsagePercent)}];
    currentLine += 1;
    
    out += `        POWER ${formatNumber(g.instantPower)} W / ${formatNumber(g.defaultPowerLimit)} W\n`;
    currentLine += 1;
    
    out += `        ${getProgressBar(100, g.powerUsagePercent)} ${formatNumber(g.powerUsagePercent)} %\n`;
    progressBars = [...progressBars, {y: currentLine, x: 8, type: 'power', value: g.powerUsagePercent, text: getProgressBar(100, g.powerUsagePercent)}];
    currentLine += 1;
    
    out += `        TEMPERATURE ${formatNumber(g.gpuTemp)} ℃\n`;
    currentLine += 1;
  }
  
  out += "\n";
  currentLine += 1;

  // MEMORY Section
  out += `MEMORY\n`;
  currentLine += 1;
  
  const memoryToDisplay = dmidecodeInfo.memory.length > 0 ? dmidecodeInfo.memory : ['NO DATA'];
  memoryToDisplay.forEach((memoryInfo) => {
    out += `    ${memoryInfo}\n`;
    currentLine += 1;
  });
  
  // RAM
  const ramUsedGB = formatGB(info.memData.active);
  const ramTotalGB = formatGB(info.memData.total);
  const ramUsagePercent = info.memData.total > 0 ? (info.memData.active / info.memData.total) * 100 : 0;
  out += `        RAM ${ramUsedGB} GB / ${ramTotalGB} GB\n`;
  currentLine += 1;
  
  out += `        ${getProgressBar(100, ramUsagePercent)} ${formatNumber(ramUsagePercent)} %\n`;
  progressBars = [...progressBars, {y: currentLine, x: 8, type: 'ram', value: ramUsagePercent, text: getProgressBar(100, ramUsagePercent)}];
  currentLine += 1;
  
  // SWAP
  const swapUsedGB = formatGB(info.memData.swapused);
  const swapTotalGB = formatGB(info.memData.swaptotal);
  const swapUsagePercent = info.memData.swaptotal > 0 ? (info.memData.swapused / info.memData.swaptotal) * 100 : 0;
  out += `        SWAP ${swapUsedGB} GB / ${swapTotalGB} GB\n`;
  currentLine += 1;
  
  out += `        ${getProgressBar(100, swapUsagePercent)} ${formatNumber(swapUsagePercent)} %\n`;
  progressBars = [...progressBars, {y: currentLine, x: 8, type: 'swap', value: swapUsagePercent, text: getProgressBar(100, swapUsagePercent)}];
  currentLine += 1;

  out += "\n";
  currentLine += 1;

  // CPU Section
  out += `CPU\n`;
  currentLine += 1;
  
  const cpuName = dmidecodeInfo.cpu || 'NO DATA';
  out += `    ${cpuName}\n`;
  currentLine += 1;
  
  out += `        LOAD\n`;
  currentLine += 1;
  
  info.cpuLoad.cpus.forEach((core) => {
    out += `        ${getProgressBar(100, core.load)} ${formatNumber(core.load)} %\n`;
    progressBars = [...progressBars, {y: currentLine, x: 8, type: 'cpu', value: core.load, text: getProgressBar(100, core.load)}];
    currentLine += 1;
  });
  
  const cpuTemp = info.cpuTemperature.main || 0;
  out += `        TEMPERATURE ${formatNumber(cpuTemp)} ℃\n`;
  currentLine += 1;

  tb.setText(out);
  tb.draw();
  
  // 色付け処理
  progressBars.forEach(bar => {
    sb.put({x: bar.x, y: bar.y, attr: {color: COLORS[bar.type]}}, bar.text);
  });
  
  sb.draw({ delta: true });
};

const initDmidecodeInfo = async () => {
  try {
    const { stdout } = await execAsync('sudo dmidecode');
    dmidecodeInfo = parseDmidecodeOutput(stdout);
  } catch (error) {
    dmidecodeInfo = {
      cpu: null,
      memory: []
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
