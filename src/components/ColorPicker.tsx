import * as React from "react";
import {useEffect, useRef, useState} from "react";

export default function ColorPicker({
                                        hue = 0
                                    }) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [selectedColor, setSelectedColor] = useState<string>('#ff0000');
    const [pickerPos, setPickerPos] = useState<{ x: number, y: number }>({x: 0, y: 0});
    const [canvasMouseDown, setCanvasMouseDown] = useState<boolean>(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
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
    }, [hue]);

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
        const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
        setSelectedColor(hex);
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
            <div style={{backgroundColor: selectedColor}}/>
            <span>{selectedColor}</span>
        </div>
    );
}