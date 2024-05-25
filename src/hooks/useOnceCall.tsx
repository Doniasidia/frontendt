import React from "react";

export function useOnceCall(func: () => void, condition = true) {
    const isCalledRef = React.useRef(false);

    React.useEffect(() => {
        if (condition && !isCalledRef.current) {
            isCalledRef.current = true;
            func();
        }
    }, [func, condition]);
}