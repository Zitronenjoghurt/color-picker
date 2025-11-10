import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Color} from "../types/Color.ts";

type ColorPickerProps = {
    color: Color;
    setColor: (color: Color) => void;
}

export default function ColorPicker({
                                        color,
                                        setColor
                                    }: ColorPickerProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [pickerPos, setPickerPos] = useState<{ x: number, y: number }>({x: 0, y: 0});
    const [canvasMouseDown, setCanvasMouseDown] = useState<boolean>(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = `hsl(${color.hue * 360}, 100%, 50%)`;
        ctx.fillRect(0, 0, width, height);

        // Horizontal
        const whiteGrad = ctx.createLinearGradient(0, 0, width, 0);
        whiteGrad.addColorStop(0, "rgba(255,255,255,1)");
        whiteGrad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = whiteGrad;
        ctx.fillRect(0, 0, width, height);

        // Vertical
        const blackGrad = ctx.createLinearGradient(0, 0, 0, height);
        blackGrad.addColorStop(0, "rgba(0,0,0,0)");
        blackGrad.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = blackGrad;
        ctx.fillRect(0, 0, width, height);
    }, [color]);

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPickerPos({x, y});

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const pixel = ctx.getImageData(x, y, 1, 1).data;
        setColor(Color.fromRGB(pixel[0], pixel[1], pixel[2]));
    };

    return (
        <div style={{position: 'relative', display: 'inline-block'}}>
            <canvas
                ref={canvasRef}
                width={300}
                height={300}
                onMouseDown={() => setCanvasMouseDown(true)}
                onMouseUp={() => setCanvasMouseDown(false)}
                onMouseMove={(e) => {
                    if (canvasMouseDown) {
                        handleClick(e);
                    }
                }}
                onClick={(e) => handleClick(e)}
                className="ColorCanvas"
            />
            {pickerPos && (
                <div
                    style={{
                        position: 'absolute',
                        left: pickerPos.x,
                        top: pickerPos.y,
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
            <span>{color.toRGBHex()}</span>
        </div>
    );
}