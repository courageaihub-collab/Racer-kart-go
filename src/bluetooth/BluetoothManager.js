/**
 * BluetoothManager.js
 * Comprehensive Bluetooth & Wireless Controller Support for Desk Racer:
 * 1. Web Gamepad API for standard Bluetooth Wireless Controllers (Xbox, PS5 DualSense, Switch Pro, Joy-Con, mobile Bluetooth gamepads)
 * 2. Web Bluetooth API (navigator.bluetooth) for custom BLE racing wheels, pedals, and micro-controllers
 * 3. Dual-Rumble Haptics for crashes and drift tire friction
 */

export class BluetoothManager {
  constructor(onInputCallback, onStatusCallback) {
    this.onInputCallback = onInputCallback || (() => {});
    this.onStatusCallback = onStatusCallback || (() => {});
    this.connectedGamepad = null;
    this.bleDevice = null;
    this.bleServer = null;
    this.isBleConnecting = false;
    this.pollRafId = null;

    // Track active analog/button state
    this.state = {
      steer: 0, // -1.0 (left) to +1.0 (right)
      throttle: 0, // 0.0 to 1.0
      brake: 0, // 0.0 to 1.0
      drift: false,
      camToggle: false,
      autopilotToggle: false,
    };

    this.lastCamButtonPressed = false;
    this.lastAutopilotButtonPressed = false;

    this.initGamepadListeners();
  }

  // ---------------------------------------------------------------------------
  // 1. BLUETOOTH GAMEPAD (XBOX, DUALSENSE, SWITCH, 8BITDO, MOBILE)
  // ---------------------------------------------------------------------------
  initGamepadListeners() {
    window.addEventListener('gamepadconnected', (e) => {
      this.connectedGamepad = e.gamepad;
      const name = this.sanitizeGamepadName(e.gamepad.id);
      this.onStatusCallback({
        type: 'gamepad:connected',
        name,
        index: e.gamepad.index,
        buttons: e.gamepad.buttons.length,
        axes: e.gamepad.axes.length,
      });
      this.startPolling();
      this.rumble(0.3, 0.4, 200); // Friendly connection vibration
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      if (this.connectedGamepad && this.connectedGamepad.index === e.gamepad.index) {
        this.connectedGamepad = null;
        this.onStatusCallback({
          type: 'gamepad:disconnected',
          name: this.sanitizeGamepadName(e.gamepad.id),
        });
      }
    });

    // Check if a gamepad was already paired before page load
    const existingPads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const pad of existingPads) {
      if (pad && pad.connected) {
        this.connectedGamepad = pad;
        this.onStatusCallback({
          type: 'gamepad:connected',
          name: this.sanitizeGamepadName(pad.id),
          index: pad.index,
        });
        this.startPolling();
        break;
      }
    }
  }

  sanitizeGamepadName(rawId) {
    if (!rawId) return 'Bluetooth Controller';
    // Clean up vendor/product IDs like (Vendor: 045e Product: 02e0)
    let cleaned = rawId.replace(/\s*\(Vendor:.*?\)/i, '').trim();
    if (cleaned.length > 28) cleaned = cleaned.substring(0, 26) + '...';
    return cleaned || 'Bluetooth Controller';
  }

  startPolling() {
    if (this.pollRafId) return;
    const poll = () => {
      this.pollGamepadState();
      this.pollRafId = requestAnimationFrame(poll);
    };
    this.pollRafId = requestAnimationFrame(poll);
  }

  stopPolling() {
    if (this.pollRafId) {
      cancelAnimationFrame(this.pollRafId);
      this.pollRafId = null;
    }
  }

  pollGamepadState() {
    if (!navigator.getGamepads) return;
    const gamepads = navigator.getGamepads();
    const pad = gamepads[this.connectedGamepad ? this.connectedGamepad.index : 0];
    if (!pad || !pad.connected) return;

    this.connectedGamepad = pad;

    // Standard Gamepad Mapping:
    // Axes:
    // Axis 0: Left Stick Horizontal (Steering: -1 left, +1 right)
    // Buttons:
    // 0: A / Cross (Gas / Accelerate)
    // 1: B / Circle (Brake / Reverse)
    // 2: X / Square (Drift / Hop)
    // 3: Y / Triangle (Toggle Camera)
    // 6: Left Trigger (Analog Brake: 0.0 to 1.0)
    // 7: Right Trigger (Analog Gas: 0.0 to 1.0)
    // 9: Start / Options (Toggle Autopilot / Pause)
    // 14: D-Pad Left
    // 15: D-Pad Right

    const deadzone = 0.12;
    let rawSteer = pad.axes && pad.axes[0] !== undefined ? pad.axes[0] : 0;
    if (Math.abs(rawSteer) < deadzone) rawSteer = 0;

    // D-Pad steering fallback
    const dpadLeft = pad.buttons[14] && pad.buttons[14].pressed;
    const dpadRight = pad.buttons[15] && pad.buttons[15].pressed;
    if (dpadLeft) rawSteer = -1.0;
    if (dpadRight) rawSteer = 1.0;

    // Analog triggers (preferred) or face buttons
    const triggerGas = pad.buttons[7] ? pad.buttons[7].value : 0;
    const buttonGas = pad.buttons[0] && pad.buttons[0].pressed ? 1.0 : 0;
    const throttle = Math.max(triggerGas, buttonGas);

    const triggerBrake = pad.buttons[6] ? pad.buttons[6].value : 0;
    const buttonBrake = pad.buttons[1] && pad.buttons[1].pressed ? 1.0 : 0;
    const brake = Math.max(triggerBrake, buttonBrake);

    const drift = Boolean(pad.buttons[2] && pad.buttons[2].pressed);

    // Camera Toggle (Button Y / 3)
    const isCamDown = Boolean(pad.buttons[3] && pad.buttons[3].pressed);
    let camTrigger = false;
    if (isCamDown && !this.lastCamButtonPressed) {
      camTrigger = true;
    }
    this.lastCamButtonPressed = isCamDown;

    // Autopilot Toggle (Button Start / 9)
    const isAutopilotDown = Boolean(pad.buttons[9] && pad.buttons[9].pressed);
    let autopilotTrigger = false;
    if (isAutopilotDown && !this.lastAutopilotButtonPressed) {
      autopilotTrigger = true;
    }
    this.lastAutopilotButtonPressed = isAutopilotDown;

    this.state.steer = rawSteer;
    this.state.throttle = throttle;
    this.state.brake = brake;
    this.state.drift = drift;

    this.onInputCallback({
      steer: rawSteer,
      throttle,
      brake,
      drift,
      camTrigger,
      autopilotTrigger,
      padName: this.sanitizeGamepadName(pad.id),
    });
  }

  /**
   * Dual-Motor Haptic Vibration Feedback
   */
  rumble(weakMagnitude = 0.4, strongMagnitude = 0.5, durationMs = 180) {
    if (!this.connectedGamepad) return;
    const actuator = this.connectedGamepad.vibrationActuator;
    if (actuator && actuator.playEffect) {
      try {
        actuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration: durationMs,
          weakMagnitude: Math.min(1.0, Math.max(0, weakMagnitude)),
          strongMagnitude: Math.min(1.0, Math.max(0, strongMagnitude)),
        });
      } catch (_e) {
        // Ignore haptic errors on unsupported hardware
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 2. WEB BLUETOOTH API (CUSTOM BLE WHEELS, RACING SENSORS & MICRO-CONTROLLERS)
  // ---------------------------------------------------------------------------
  isWebBluetoothSupported() {
    return typeof navigator !== 'undefined' && Boolean(navigator.bluetooth);
  }

  async scanAndConnectBleDevice() {
    if (!this.isWebBluetoothSupported()) {
      throw new Error('Web Bluetooth is not supported in this browser. Please use a Chromium browser or connect a standard Bluetooth Gamepad.');
    }

    this.isBleConnecting = true;
    try {
      // Prompt user to select any Bluetooth device or custom racing service
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          'generic_access',
          'battery_service',
          0x1812, // Human Interface Device
        ],
      });

      this.bleDevice = device;
      device.addEventListener('gattserverdisconnected', () => {
        this.onStatusCallback({
          type: 'ble:disconnected',
          name: device.name || 'Bluetooth BLE Device',
        });
      });

      const server = await device.gatt.connect();
      this.bleServer = server;

      this.onStatusCallback({
        type: 'ble:connected',
        name: device.name || 'Bluetooth Device',
        id: device.id,
      });

      return {
        success: true,
        name: device.name || 'Bluetooth Device',
      };
    } catch (err) {
      if (err.name === 'NotFoundError') {
        // User cancelled picker
        return { success: false, cancelled: true };
      }
      throw err;
    } finally {
      this.isBleConnecting = false;
    }
  }

  disconnectBle() {
    if (this.bleDevice && this.bleDevice.gatt && this.bleDevice.gatt.connected) {
      this.bleDevice.gatt.disconnect();
    }
    this.bleDevice = null;
    this.bleServer = null;
  }
}
