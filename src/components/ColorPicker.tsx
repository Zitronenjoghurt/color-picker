import {useEffect, useRef, useState} from "react";

export default function ColorPicker({
                                        hue = 0
                                    }) {
    const canvasRef = useRef(null);
    const [selectedColor, setSelectedColor] = useState('#ff0000');

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
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

    const handleClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ctx = canvas.getContext('2d');
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
        setSelectedColor(hex);
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={300}
                height={300}
                onClick={handleClick}
            />
            <div
                style={{backgroundColor: selectedColor}}
            />
            <span>{selectedColor}</span>
        </div>
    );
}