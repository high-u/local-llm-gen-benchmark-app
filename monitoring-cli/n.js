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

/*
{
  "?xml": "",
  "nvidia_smi_log": {
    "timestamp": "Sun Sep 28 22:52:31 2025",
    "driver_version": "580.82.07",
    "cuda_version": 13,
    "attached_gpus": 1,
    "gpu": {
      "product_name": "NVIDIA GeForce RTX 5070 Ti",
      "product_brand": "GeForce",
      "product_architecture": "Blackwell",
      "display_mode": "Requested functionality has been deprecated",
      "display_attached": "No",
      "display_active": "Disabled",
      "persistence_mode": "Enabled",
      "addressing_mode": "HMM",
      "mig_mode": {
        "current_mig": "N/A",
        "pending_mig": "N/A"
      },
      "mig_devices": "None",
      "accounting_mode": "Disabled",
      "accounting_mode_buffer_size": 4000,
      "driver_model": {
        "current_dm": "N/A",
        "pending_dm": "N/A"
      },
      "serial": 0,
      "uuid": "GPU-ea08020b-a9d0-c731-2700-e331a1e51bd6",
      "pdi": 13278730478939372000,
      "minor_number": 0,
      "vbios_version": "98.03.58.00.99",
      "multigpu_board": "No",
      "board_id": 256,
      "board_part_number": "N/A",
      "gpu_part_number": "2C05-300-A1",
      "gpu_fru_part_number": "N/A",
      "platformInfo": {
        "chassis_serial_number": "",
        "slot_number": 0,
        "tray_index": 0,
        "host_id": 1,
        "peer_type": "Direct Connected",
        "module_id": 1,
        "gpu_fabric_guid": 0
      },
      "inforom_version": {
        "img_version": "G005.0000.98.01",
        "oem_object": 2.1,
        "ecc_object": "N/A",
        "pwr_object": "N/A"
      },
      "inforom_bbx_flush": {
        "latest_timestamp": "N/A",
        "latest_duration": "N/A"
      },
      "gpu_operation_mode": {
        "current_gom": "N/A",
        "pending_gom": "N/A"
      },
      "c2c_mode": "Disabled",
      "gpu_virtualization_mode": {
        "virtualization_mode": "None",
        "host_vgpu_mode": "N/A",
        "vgpu_heterogeneous_mode": "N/A"
      },
      "gpu_recovery_action": "None",
      "gsp_firmware_version": "580.82.07",
      "ibmnpu": {
        "relaxed_ordering_mode": "N/A"
      },
      "pci": {
        "pci_bus": 1,
        "pci_device": 0,
        "pci_domain": 0,
        "pci_base_class": 3,
        "pci_sub_class": 0,
        "pci_device_id": "2C0510DE",
        "pci_bus_id": "00000000:01:00.0",
        "pci_sub_system_id": 53151462,
        "pci_gpu_link_info": {
          "pcie_gen": {
            "max_link_gen": 5,
            "current_link_gen": 1,
            "device_current_link_gen": 1,
            "max_device_link_gen": 5,
            "max_host_link_gen": 5
          },
          "link_widths": {
            "max_link_width": "16x",
            "current_link_width": "16x"
          }
        },
        "pci_bridge_chip": {
          "bridge_chip_type": "N/A",
          "bridge_chip_fw": "N/A"
        },
        "replay_counter": 0,
        "replay_rollover_counter": 0,
        "tx_util": "1706 KB/s",
        "rx_util": "1451 KB/s",
        "atomic_caps_outbound": "N/A",
        "atomic_caps_inbound": "FETCHADD_32 FETCHADD_64 SWAP_32 SWAP_64 CAS_32 CAS_64"
      },
      "fan_speed": "0 %",
      "performance_state": "P8",
      "clocks_event_reasons": {
        "clocks_event_reason_gpu_idle": "Not Active",
        "clocks_event_reason_applications_clocks_setting": "Not Active",
        "clocks_event_reason_sw_power_cap": "Active",
        "clocks_event_reason_hw_slowdown": "Not Active",
        "clocks_event_reason_hw_thermal_slowdown": "Not Active",
        "clocks_event_reason_hw_power_brake_slowdown": "Not Active",
        "clocks_event_reason_sync_boost": "Not Active",
        "clocks_event_reason_sw_thermal_slowdown": "Not Active",
        "clocks_event_reason_display_clocks_setting": "Not Active"
      },
      "clocks_event_reasons_counters": {
        "clocks_event_reasons_counters_sw_power_cap": "2623863050 us",
        "clocks_event_reasons_counters_sync_boost": "0 us",
        "clocks_event_reasons_counters_sw_therm_slowdown": "0 us",
        "clocks_event_reasons_counters_hw_therm_slowdown": "0 us",
        "clocks_event_reasons_counters_hw_power_brake": "0 us"
      },
      "sparse_operation_mode": "N/A",
      "fb_memory_usage": {
        "total": "16303 MiB",
        "reserved": "463 MiB",
        "used": "18 MiB",
        "free": "15823 MiB"
      },
      "bar1_memory_usage": {
        "total": "16384 MiB",
        "used": "3 MiB",
        "free": "16381 MiB"
      },
      "cc_protected_memory_usage": {
        "total": "0 MiB",
        "used": "0 MiB",
        "free": "0 MiB"
      },
      "compute_mode": "Default",
      "utilization": {
        "gpu_util": "0 %",
        "memory_util": "0 %",
        "encoder_util": "0 %",
        "decoder_util": "0 %",
        "jpeg_util": "0 %",
        "ofa_util": "0 %"
      },
      "encoder_stats": {
        "session_count": 0,
        "average_fps": 0,
        "average_latency": 0
      },
      "fbc_stats": {
        "session_count": 0,
        "average_fps": 0,
        "average_latency": 0
      },
      "dram_encryption_mode": {
        "current_dram_encryption": "Disabled",
        "pending_dram_encryption": "Disabled"
      },
      "ecc_mode": {
        "current_ecc": "N/A",
        "pending_ecc": "N/A"
      },
      "ecc_errors": {
        "volatile": {
          "sram_correctable": "N/A",
          "sram_uncorrectable_parity": "N/A",
          "sram_uncorrectable_secded": "N/A",
          "dram_correctable": "N/A",
          "dram_uncorrectable": "N/A"
        },
        "aggregate": {
          "sram_correctable": "N/A",
          "sram_uncorrectable_parity": "N/A",
          "sram_uncorrectable_secded": "N/A",
          "dram_correctable": "N/A",
          "dram_uncorrectable": "N/A",
          "sram_threshold_exceeded": "N/A"
        },
        "aggregate_uncorrectable_sram_sources": {
          "sram_l2": "N/A",
          "sram_sm": "N/A",
          "sram_microcontroller": "N/A",
          "sram_pcie": "N/A",
          "sram_other": "N/A"
        },
        "channel_repair_pending": "No",
        "tpc_repair_pending": "No"
      },
      "retired_pages": {
        "multiple_single_bit_retirement": {
          "retired_count": "N/A",
          "retired_pagelist": "N/A"
        },
        "double_bit_retirement": {
          "retired_count": "N/A",
          "retired_pagelist": "N/A"
        },
        "pending_blacklist": "N/A",
        "pending_retirement": "N/A"
      },
      "remapped_rows": "N/A",
      "temperature": {
        "gpu_temp": "33 C",
        "gpu_temp_tlimit": "55 C",
        "gpu_temp_max_tlimit_threshold": "-5 C",
        "gpu_temp_slow_tlimit_threshold": "-2 C",
        "gpu_temp_max_gpu_tlimit_threshold": "0 C",
        "gpu_target_temperature": "N/A",
        "memory_temp": "N/A",
        "gpu_temp_max_mem_tlimit_threshold": "N/A"
      },
      "supported_gpu_target_temp": {
        "gpu_target_temp_min": "N/A",
        "gpu_target_temp_max": "N/A"
      },
      "gpu_power_readings": {
        "power_state": "P8",
        "average_power_draw": "10.61 W",
        "instant_power_draw": "10.64 W",
        "current_power_limit": "300.00 W",
        "requested_power_limit": "300.00 W",
        "default_power_limit": "300.00 W",
        "min_power_limit": "250.00 W",
        "max_power_limit": "330.00 W"
      },
      "gpu_memory_power_readings": {
        "average_power_draw": "N/A",
        "instant_power_draw": "N/A"
      },
      "module_power_readings": {
        "power_state": "P8",
        "average_power_draw": "N/A",
        "instant_power_draw": "N/A",
        "current_power_limit": "N/A",
        "requested_power_limit": "N/A",
        "default_power_limit": "N/A",
        "min_power_limit": "N/A",
        "max_power_limit": "N/A"
      },
      "power_smoothing": "N/A",
      "power_profiles": {
        "power_profile_requested_profiles": "N/A",
        "power_profile_enforced_profiles": "N/A"
      },
      "clocks": {
        "graphics_clock": "180 MHz",
        "sm_clock": "180 MHz",
        "mem_clock": "405 MHz",
        "video_clock": "600 MHz"
      },
      "applications_clocks": {
        "graphics_clock": "N/A",
        "mem_clock": "N/A"
      },
      "default_applications_clocks": {
        "graphics_clock": "N/A",
        "mem_clock": "N/A"
      },
      "deferred_clocks": {
        "mem_clock": "N/A"
      },
      "max_clocks": {
        "graphics_clock": "3090 MHz",
        "sm_clock": "3090 MHz",
        "mem_clock": "14001 MHz",
        "video_clock": "3090 MHz"
      },
      "max_customer_boost_clocks": {
        "graphics_clock": "N/A"
      },
      "clock_policy": {
        "auto_boost": "N/A",
        "auto_boost_default": "N/A"
      },
      "fabric": {
        "state": "N/A",
        "status": "N/A",
        "cliqueId": "N/A",
        "clusterUuid": "N/A",
        "health": {
          "summary": "N/A",
          "bandwidth": "N/A",
          "route_recovery_in_progress": "N/A",
          "route_unhealthy": "N/A",
          "access_timeout_recovery": "N/A",
          "incorrect_configuration": "N/A"
        }
      },
      "supported_clocks": {},
      "processes": {
        "process_info": {
          "gpu_instance_id": "N/A",
          "compute_instance_id": "N/A",
          "pid": 2835,
          "type": "G",
          "process_name": "/usr/lib/xorg/Xorg",
          "used_memory": "4 MiB"
        }
      },
      "accounted_processes": "",
      "capabilities": {
        "egm": "disabled"
      }
    }
  }
}
*/