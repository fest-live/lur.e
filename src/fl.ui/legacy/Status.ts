import { setIdleInterval, throttleMap } from "../core/Utils";

//
const roots: any[]      = []; let initialized = false; // TODO! support of `hour12` option (used-defined)
const updateTime        = () => setElementContent(".ui-time", new Date().toLocaleTimeString(navigator.language, { hour12: false, timeStyle: "short" }));
const setElementIcon    = (selector, value)=> throttleMap.set(selector, ()=> roots.forEach((root)=>root.querySelectorAll(selector).forEach((element)=>{ if (element?.getAttribute?.("icon") != value) { element?.setAttribute?.("icon", value); }})));
const setElementContent = (selector, value)=> throttleMap.set(selector, ()=> roots.forEach((root)=>root.querySelectorAll(selector).forEach((element)=>{ if (element.innerHTML != value) { element.innerHTML = value; }; })));

//
const runBatteryStatus = (async()=>{
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
            setElementIcon(".ui-battery", battery);
        } else {
            batteryStatus?.then?.((btr)=>{
                if (btr.charging)
                    { battery = "battery-charging"; } else // @ts-ignore
                    { battery = byLevel(btr.level)||"battery"; };
                    setElementIcon(".ui-battery", battery);
            })?.catch?.(console.warn.bind(console));
        }
    }

    //
    changeBatteryStatus(); setIdleInterval(changeBatteryStatus, 1000);
    batteryStatus?.then?.((btr)=>{
        btr.addEventListener("chargingchange", changeBatteryStatus);
        btr.addEventListener("levelchange", changeBatteryStatus);
        changeBatteryStatus();
    });
});

// TODO! support of seconds option (user-defined)
export const runTimeStatus   = (async()=>{ updateTime(); setIdleInterval(updateTime, 15000); document.addEventListener("DOMContentLoaded", updateTime, { once: true }); });
export const runSignalStatus = (async()=>{
    // @ts-ignore
    const changeSignal = ()=>setElementIcon(".ui-network", signalIcons[navigator.onLine ? (navigator?.connection?.effectiveType || "4g") : "offline"]);
    const signalIcons  = {
        "offline": "wifi-off",
        "4g": "wifi",
        "3g": "wifi-high",
        "2g": "wifi-low",
        "slow-2g": "wifi-zero"
    }

    // @ts-ignore
    navigator.connection?.addEventListener("change", changeSignal);
    setIdleInterval(changeSignal, 1000);
    changeSignal?.();
});

//
export const connect = (receiver = document)=>{ if (!initialized) initStatus(); roots.push(receiver); }
export const initStatus = ()=>{
    if (!initialized) {
        initialized = true;
        runBatteryStatus();
        runSignalStatus();
        runTimeStatus();
    };
}

//
export default initStatus;
