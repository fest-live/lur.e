import { addEvent, setIdleInterval } from "fest/dom";
import { ref } from "fest/object";

//
export const batteryStatusRef = ()=>{
    const rv = ref("battery-charging");

    // @ts-ignore
    const batteryStatus = navigator.getBattery?.();
    const batteryIcons = new Map([
        [0, "battery-warning"],
        [25, "battery"],
        [50, "battery-low"],
        [75, "battery-medium"],
        [100, "battery-full"],
    ]);

    //
    const byLevel = (lv = 1.0)=>(batteryIcons.get(Math.max(Math.min(Math.round(lv * 4) * 25, 100), 0))||"battery");
    const changeBatteryStatus = ()=>{
        let battery = "battery-charging";
        if (!batteryStatus) {
            rv.value = battery;
        } else {
            batteryStatus?.then?.((btr)=>{
                if (btr.charging)
                    { battery = "battery-charging"; } else // @ts-ignore
                    { battery = byLevel(btr.level)||"battery"; };
                    rv.value = battery;
            })?.catch?.(console.warn.bind(console));
        }
    }

    //
    changeBatteryStatus(); setIdleInterval(changeBatteryStatus, 1000);
    batteryStatus?.then?.((btr)=>{
        addEvent(btr, "chargingchange", changeBatteryStatus);
        addEvent(btr, "levelchange", changeBatteryStatus);
        changeBatteryStatus();
    }); return rv;
}

// TODO? support of seconds option (user-defined)
export const timeStatusRef = ()=>{
    const rv = ref("00:00:00");
    const updateTime = ()=> (rv.value = new Date().toLocaleTimeString(navigator.language, { hour12: false, timeStyle: "short" }))
    setIdleInterval(updateTime, 15000); document.addEventListener("DOMContentLoaded", updateTime, { once: true });
    return rv;
};

//
export const signalStatusRef = ()=>{
    const rv = ref("wifi-off");

    // @ts-ignore
    const changeSignal = ()=>(rv.value = signalIcons[navigator.onLine ? (navigator?.connection?.effectiveType || "4g") : "offline"]);
    const signalIcons  = {
        "offline": "wifi-off",
        "4g": "wifi",
        "3g": "wifi-high",
        "2g": "wifi-low",
        "slow-2g": "wifi-zero"
    }

    // @ts-ignore
    addEvent(navigator.connection, "change", changeSignal);
    setIdleInterval(changeSignal, 1000);
    changeSignal?.(); return rv;
};
