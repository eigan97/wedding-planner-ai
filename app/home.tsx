"use client";
import { useRef, useState, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { ChatCard } from "@/components/chat-card";

export default function Home() {
    const constraintsRef = useRef<HTMLDivElement>(null);
    const [minimized, setMinimized] = useState(false);
    const [constraints, setConstraints] = useState({ top: 0, left: 0, right: 0, bottom: 0 });
    const [pinned, setPinned] = useState(false);

    useLayoutEffect(() => {
        if (constraintsRef.current) {
            const rect = constraintsRef.current.getBoundingClientRect();
            setConstraints({
                top: 0,
                left: 0,
                right: rect.width - (minimized ? 320 : 384), // 320px = w-80, 384px = max-w-md
                bottom: rect.height - (minimized ? 64 : 500), // 64px = altura minimizada aprox, 500px = altura expandida aprox
            });
        }
    }, [minimized]);

    return (
        <div
            className="flex flex-col gap-4 w-full min-h-screen relative"
            ref={constraintsRef}
            style={{ overflow: "hidden" }}
        >
            <h1>Hello World</h1>
            <motion.div
                drag={!pinned}
                dragConstraints={constraints}
                style={
                    pinned
                        ? {
                            position: "fixed",
                            left: 24,
                            top: 24,
                            zIndex: 50,
                            margin: 0,
                        }
                        : { position: "absolute", zIndex: 10 }
                }
            >
                <ChatCard
                    minimized={minimized}
                    setMinimized={setMinimized}
                    pinned={pinned}
                    setPinned={setPinned}
                />
            </motion.div>
        </div>
    );
}
