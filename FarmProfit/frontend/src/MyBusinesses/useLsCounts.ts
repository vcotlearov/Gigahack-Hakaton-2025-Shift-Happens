import React from "react";

export function useLsCount(lsKey: string, extraEvents: string[] = []) {
    const [count, setCount] = React.useState(0);

    const load = React.useCallback(() => {
        try {
            const raw = localStorage.getItem(lsKey);
            const arr = raw ? JSON.parse(raw) : [];
            setCount(Array.isArray(arr) ? arr.length : 0);
        } catch {
            setCount(0);
        }
    }, [lsKey]);

    React.useEffect(() => {
        load();
        const handler = () => load();
        window.addEventListener('storage', handler);
        extraEvents.forEach((ev) => window.addEventListener(ev, handler as EventListener));
        return () => {
            window.removeEventListener('storage', handler);
            extraEvents.forEach((ev) => window.removeEventListener(ev, handler as EventListener));
        };
    }, [load, extraEvents]);

    return count;
}
