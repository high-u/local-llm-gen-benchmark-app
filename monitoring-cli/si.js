import si from "systeminformation";

const getAllInfo = async () => {
  const cpuLoad = await si.currentLoad();
  const memData = await si.mem();
  const memLayoutData = await si.memLayout();
  const storage = await si.diskLayout();
  const gpuData = await si.graphics();
  
  return { cpuLoad, memData, memLayoutData, storage, gpuData };
};

console.log(JSON.stringify(await getAllInfo(), null, 2));
