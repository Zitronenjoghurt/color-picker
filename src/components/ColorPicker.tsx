import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Color} from "../types/Color.ts";

type ColorPickerProps = {
    color: Color;
    setColor: (color: Color) => void;
}

const CANVAS_SIZE = 300;
const PADDING = 16;

export default function ColorPicker({
                                        color,
                                        setColor
                                    }: ColorPickerProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [pickerPos, setPickerPos] = useState<{ x: number, y: number }>({x: 0, y: 0});
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const svToXy = (sat: number, val: number) => {
        const x = sat * CANVAS_SIZE;
        const y = (1 - val) * CANVAS_SIZE;
        return {x, y};
    }

    const xyToSv = (x: number, y: number) => {
        const sat = x / CANVAS_SIZE;
        const val = 1 - y / CANVAS_SIZE;
        return {sat, val};
    }

    useEffect(() => {
        setPickerPos(svToXy(color.sat, color.val));
    }, [color]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imageData = ctx.createImageData(CANVAS_SIZE, CANVAS_SIZE);
        const data = imageData.data;

        for (let y = 0; y < CANVAS_SIZE; y++) {
            for (let x = 0; x < CANVAS_SIZE; x++) {
                const {sat, val} = xyToSv(x, y);

                const pixelColor = new Color(color.hue, sat, val);
                const [r, g, b] = pixelColor.toRGB();

                const i = (y * CANVAS_SIZE + x) * 4;
                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
                data[i + 3] = 255;
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }, [color.hue]);

    const handlePointerEvent = (e: React.PointerEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const clampedX = Math.max(0, Math.min(CANVAS_SIZE, x));
        const clampedY = Math.max(0, Math.min(CANVAS_SIZE, y));

        setPickerPos({x: clampedX, y: clampedY});

        const {sat, val} = xyToSv(clampedX, clampedY);
        const pickedColor = new Color(color.hue, sat, val);
        setColor(pickedColor);
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleGlobalPointerMove = (e: PointerEvent) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;

            const x = Math.max(0, Math.min(CANVAS_SIZE, e.clientX - rect.left));
            const y = Math.max(0, Math.min(CANVAS_SIZE, e.clientY - rect.top));

            setPickerPos({x, y});
            const {sat, val} = xyToSv(x, y);
            setColor(new Color(color.hue, sat, val));
        };

        const handleGlobalPointerUp = () => setIsDragging(false);

        window.addEventListener('pointermove', handleGlobalPointerMove);
        window.addEventListener('pointerup', handleGlobalPointerUp);

        return () => {
            window.removeEventListener('pointermove', handleGlobalPointerMove);
            window.removeEventListener('pointerup', handleGlobalPointerUp);
        };
    }, [isDragging, color.hue, setColor]);

    return (
        <div style={{
            position: 'relative',
            display: 'inline-block',
            padding: PADDING,
            margin: -PADDING,
            cursor: 'crosshair'
        }}
             onPointerDown={(e) => {
                 setIsDragging(true);
                 handlePointerEvent(e);
             }}
        >
            <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="ColorCanvas"
            />
            {pickerPos && (
                <div
                    style={{
                        position: 'absolute',
                        left: PADDING + pickerPos.x,
                        top: PADDING + pickerPos.y,
                        width: 16,
                        height: 16,
                        border: '1.5px solid white',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                        boxShadow: '0 0 0 1px rgba(0,0,0,0.3)'
                    }}
                />
            )}
            <div style={{backgroundColor: color.toRGBHex()}}/>
        </div>
    );
}