import si from "systeminformation";

const getAllInfo = async () => {
  const cpuLoad = await si.currentLoad();
  const cpuTemperature = await si.cpuTemperature();
  const memData = await si.mem();
  const memLayoutData = await si.memLayout();
  const storage = await si.diskLayout();
  const gpuData = await si.graphics();
  
  return { cpuLoad, cpuTemperature, memData, memLayoutData, storage, gpuData };
};

console.log(JSON.stringify(await getAllInfo(), null, 2));

/*
{
  "cpuLoad": {
    "avgLoad": 0.02,
    "currentLoad": 1.3634307281669478,
    "currentLoadUser": 1.0230012085490303,
    "currentLoadSystem": 0.33768281727643457,
    "currentLoadNice": 0.002746702341482961,
    "currentLoadIdle": 98.63656927183305,
    "currentLoadIrq": 0,
    "currentLoadSteal": 0,
    "currentLoadGuest": 0,
    "rawCurrentLoad": 421930,
    "rawCurrentLoadUser": 316580,
    "rawCurrentLoadSystem": 104500,
    "rawCurrentLoadNice": 850,
    "rawCurrentLoadIdle": 30524270,
    "rawCurrentLoadIrq": 0,
    "rawCurrentLoadSteal": 0,
    "rawCurrentLoadGuest": 0,
    "cpus": [
      {
        "load": 1.1821926415489517,
        "loadUser": 0.9242667535469657,
        "loadSystem": 0.2571501710455889,
        "loadNice": 0.0007757169563969499,
        "loadIdle": 98.81780735845105,
        "loadIrq": 0,
        "loadSteal": 0,
        "loadGuest": 0,
        "rawLoad": 30480,
        "rawLoadUser": 23830,
        "rawLoadSystem": 6630,
        "rawLoadNice": 20,
        "rawLoadIdle": 2547780,
        "rawLoadIrq": 0,
        "rawLoadSteal": 0,
        "rawLoadGuest": 0
      },
      {
        "load": 1.1983386140380132,
        "loadUser": 0.9280337551433546,
        "loadSystem": 0.26914142334704894,
        "loadNice": 0.0011634355476097217,
        "loadIdle": 98.80166138596199,
        "loadIrq": 0,
        "loadSteal": 0,
        "loadGuest": 0,
        "rawLoad": 30900,
        "rawLoadUser": 23930,
        "rawLoadSystem": 6940,
        "rawLoadNice": 30,
        "rawLoadIdle": 2547670,
        "rawLoadIrq": 0,
        "rawLoadSteal": 0,
        "rawLoadGuest": 0
      },
      {
        "load": 2.9501094721614045,
        "loadUser": 2.168443239753756,
        "loadSystem": 0.7672773515125825,
        "loadNice": 0.01438888089506617,
        "loadIdle": 97.0498905278386,
        "loadIrq": 0,
        "loadSteal": 0,
        "loadGuest": 0,
        "rawLoad": 75860,
        "rawLoadUser": 55760,
        "rawLoadSystem": 19730,
        "rawLoadNice": 370,
        "rawLoadIdle": 2495570,
        "rawLoadIrq": 0,
        "rawLoadSteal": 0,
        "rawLoadGuest": 0
      },
      {
        "load": 2.8999020933376847,
        "loadUser": 2.156277681943214,
        "loadSystem": 0.7280836713444294,
        "loadNice": 0.015540740050041182,
        "loadIdle": 97.10009790666231,
        "loadIrq": 0,
        "loadSteal": 0,
        "loadGuest": 0,
        "rawLoad": 74640,
        "rawLoadUser": 55500,
        "rawLoadSystem": 18740,
        "rawLoadNice": 400,
        "rawLoadIdle": 2499240,
        "rawLoadIrq": 0,
        "rawLoadSteal": 0,
        "rawLoadGuest": 0
      },
      {
        "load": 0.9689321592459382,
        "loadUser": 0.7398765968001983,
        "loadSystem": 0.22905556244573977,
        "loadNice": 0,
        "loadIdle": 99.03106784075406,
        "loadIrq": 0,
        "loadSteal": 0,
        "loadGuest": 0,
        "rawLoad": 25000,
        "rawLoadUser": 19090,
        "rawLoadSystem": 5910,
        "rawLoadNice": 0,
        "rawLoadIdle": 2555160,
        "rawLoadIrq": 0,
        "rawLoadSteal": 0,
        "rawLoadGuest": 0
      },
      {
        "load": 0.8228507672579776,
        "loadUser": 0.6341839482115393,
        "loadSystem": 0.18827941284716437,
        "loadNice": 0.0003874061992740008,
        "loadIdle": 99.17714923274202,
        "loadIrq": 0,
        "loadSteal": 0,
        "loadGuest": 0,
        "rawLoad": 21240,
        "rawLoadUser": 16370,
        "rawLoadSystem": 4860,
        "rawLoadNice": 10,
        "rawLoadIdle": 2560030,
        "rawLoadIrq": 0,
        "rawLoadSteal": 0,
        "rawLoadGuest": 0
      },
      {
        "load": 0.8525535899135815,
        "loadUser": 0.6761498230146822,
        "loadSystem": 0.1764037668988993,
        "loadNice": 0,
        "loadIdle": 99.14744641008642,
        "loadIrq": 0,
        "loadSteal": 0,
        "loadGuest": 0,
        "rawLoad": 21990,
        "rawLoadUser": 17440,
        "rawLoadSystem": 4550,
        "rawLoadNice": 0,
        "rawLoadIdle": 2557320,
        "rawLoadIrq": 0,
        "rawLoadSteal": 0,
        "rawLoadGuest": 0
      },
      {
        "load": 0.6568678711826332,
        "loadUser": 0.5267336702879606,
        "loadSystem": 0.13013420089467262,
        "loadNice": 0,
        "loadIdle": 99.34313212881737,
        "loadIrq": 0,
        "loadSteal": 0,
        "loadGuest": 0,
        "rawLoad": 16960,
        "rawLoadUser": 13600,
        "rawLoadSystem": 3360,
        "rawLoadNice": 0,
        "rawLoadIdle": 2564990,
        "rawLoadIrq": 0,
        "rawLoadSteal": 0,
        "rawLoadGuest": 0
      },
      {
        "load": 1.8337659717291181,
        "loadUser": 1.2874387418953055,
        "loadSystem": 0.545939213335351,
        "loadNice": 0.00038801649846151456,
        "loadIdle": 98.16623402827088,
        "loadIrq": 0,
        "loadSteal": 0,
        "loadGuest": 0,
        "rawLoad": 47260,
        "rawLoadUser": 33180,
        "rawLoadSystem": 14070,
        "rawLoadNice": 10,
        "rawLoadIdle": 2529950,
        "rawLoadIrq": 0,
        "rawLoadSteal": 0,
        "rawLoadGuest": 0
      },
      {
        "load": 1.8115112991611435,
        "loadUser": 1.341860221600847,
        "loadSystem": 0.4692632566870014,
        "loadNice": 0.0003878208732950425,
        "loadIdle": 98.18848870083886,
        "loadIrq": 0,
        "loadSteal": 0,
        "loadGuest": 0,
        "rawLoad": 46710,
        "rawLoadUser": 34600,
        "rawLoadSystem": 12100,
        "rawLoadNice": 10,
        "rawLoadIdle": 2531800,
        "rawLoadIrq": 0,
        "rawLoadSteal": 0,
        "rawLoadGuest": 0
      },
      {
        "load": 0.604089219330855,
        "loadUser": 0.4507434944237918,
        "loadSystem": 0.1533457249070632,
        "loadNice": 0,
        "loadIdle": 99.39591078066915,
        "loadIrq": 0,
        "loadSteal": 0,
        "loadGuest": 0,
        "rawLoad": 15600,
        "rawLoadUser": 11640,
        "rawLoadSystem": 3960,
        "rawLoadNice": 0,
        "rawLoadIdle": 2566800,
        "rawLoadIrq": 0,
        "rawLoadSteal": 0,
        "rawLoadGuest": 0
      },
      {
        "load": 0.5918900609697086,
        "loadUser": 0.4505951804896932,
        "loadSystem": 0.14129488048001548,
        "loadNice": 0,
        "loadIdle": 99.40810993903028,
        "loadIrq": 0,
        "loadSteal": 0,
        "loadGuest": 0,
        "rawLoad": 15290,
        "rawLoadUser": 11640,
        "rawLoadSystem": 3650,
        "rawLoadNice": 0,
        "rawLoadIdle": 2567960,
        "rawLoadIrq": 0,
        "rawLoadSteal": 0,
        "rawLoadGuest": 0
      }
    ]
  },
  "cpuTemperature": {
    "main": 50.6,
    "cores": [],
    "max": 50.6,
    "socket": [],
    "chipset": null
  },
  "memData": {
    "total": 132485623808,
    "free": 123843194880,
    "used": 8642428928,
    "active": 6241452032,
    "available": 126244171776,
    "buffers": 105873408,
    "cached": 2962051072,
    "slab": 409976832,
    "buffcache": 3477901312,
    "reclaimable": 102109184,
    "swaptotal": 8589930496,
    "swapused": 0,
    "swapfree": 8589930496,
    "writeback": 0,
    "dirty": 450560
  },
  "memLayoutData": [
    {
      "size": 132485623808,
      "bank": "",
      "type": "",
      "ecc": null,
      "clockSpeed": 0,
      "formFactor": "",
      "partNum": "",
      "serialNum": "",
      "voltageConfigured": null,
      "voltageMin": null,
      "voltageMax": null
    }
  ],
  "storage": [
    {
      "device": "/dev/nvme0n1",
      "type": "NVMe",
      "name": "CT1000P310SSD8",
      "vendor": "",
      "size": 1000204886016,
      "bytesPerSector": null,
      "totalCylinders": null,
      "totalHeads": null,
      "totalSectors": null,
      "totalTracks": null,
      "tracksPerCylinder": null,
      "sectorsPerTrack": null,
      "firmwareRevision": "V8CR001",
      "serialNum": "252551006DE1",
      "interfaceType": "PCIe",
      "smartStatus": "unknown",
      "temperature": null
    }
  ],
  "gpuData": {
    "controllers": [
      {
        "vendor": "NVIDIA Corporation",
        "subVendor": "",
        "model": "Device 2c05",
        "bus": "Onboard",
        "busAddress": "01:00.0",
        "vram": 32,
        "vramDynamic": false,
        "pciID": ""
      },
      {
        "vendor": "Advanced Micro Devices, Inc. [AMD/ATI]",
        "model": "Device 13c0",
        "bus": "Onboard",
        "busAddress": "70:00.0",
        "vram": 512,
        "vramDynamic": false
      }
    ],
    "displays": [
      {
        "vendor": "",
        "model": "IPS28UHDRC65W",
        "deviceName": "",
        "main": true,
        "builtin": false,
        "connection": "HDMI-A-1",
        "sizeX": 620,
        "sizeY": 349,
        "pixelDepth": 24,
        "resolutionX": 3840,
        "resolutionY": 2160,
        "currentResX": 3840,
        "currentResY": 2160,
        "positionX": 0,
        "positionY": 0,
        "currentRefreshRate": 59
      }
    ]
  }
}
*/
