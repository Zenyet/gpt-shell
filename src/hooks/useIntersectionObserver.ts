import {useCallback, useEffect, useRef, useState} from 'react';

export const useIntersectionObserver = (ref, rootMargin = '0px', threshold = 0, rootRef = null) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const observerRef = useRef(null);

    const handleIntersection = useCallback(([entry]) => {
        setIsIntersecting(entry.isIntersecting);
    }, []);

    useEffect(() => {
        if (!observerRef.current) {
            observerRef.current = new IntersectionObserver(handleIntersection, {
                root: rootRef.current,
                rootMargin,
                threshold,
            });
        }

        if (ref.current) {
            observerRef.current.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observerRef.current.unobserve(ref.current);
            }
        };
    }, [ref, rootMargin, threshold, handleIntersection, observerRef, rootRef]);

    return isIntersecting;
};