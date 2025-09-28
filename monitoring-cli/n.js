import { exec } from 'child_process';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser();

exec('nvidia-smi -q -x', (error, stdout, stderr) => {
  if (error) {
    console.error('Error executing nvidia-smi:', error);
    return;
  }
  
  if (stderr) {
    console.error('nvidia-smi stderr:', stderr);
    return;
  }
  
  try {
    const jsonData = parser.parse(stdout);

    jsonData.nvidia_smi_log.gpu.supported_clocks = {};

    console.log(JSON.stringify(jsonData, null, 2));
    
  } catch (parseError) {
    console.error('Error parsing XML:', parseError);
  }
});
