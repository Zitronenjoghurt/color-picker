import {Color} from "../types/Color.ts";
import {useCallback, useEffect, useState} from "react";

type ColorCodeFieldProps = {
    color: Color;
    setColor: (color: Color) => void;
    color_format: ColorFormat;
}

export const ColorFormat = {
    HEX_hashtag: '#FFFFFF',
    HEX_0x: '0xFFFFFF',
    HEX: 'FFFFFF',
    RGB: 'r,g,b',
    RGB_parentheses: '(r,g,b)',
    RGB_parentheses_and_text: 'rgb(r,g,b)',
} as const;
export type ColorFormat = typeof ColorFormat[keyof typeof ColorFormat];

export default function ColorCodeField({
                                           color,
                                           setColor,
                                           color_format = ColorFormat.HEX
                                       }: ColorCodeFieldProps) {
    const format_color = useCallback((color: Color) => {
        const [r, g, b] = color.toRGB();

        switch (color_format) {
            case ColorFormat.HEX_hashtag:
                return `#${color.toRGBHex()}`;
            case ColorFormat.HEX_0x:
                return `0x${color.toRGBHex()}`;
            case ColorFormat.HEX:
                return color.toRGBHex();
            case ColorFormat.RGB:
                return `${r},${g},${b}`;
            case ColorFormat.RGB_parentheses:
                return `(${r},${g},${b})`;
            case ColorFormat.RGB_parentheses_and_text:
                return `rgb(${r},${g},${b})`;
        }
    }, [color_format])

    const parse_color = useCallback((color: string) => {
        switch (color_format) {
            case ColorFormat.HEX_hashtag:
                return Color.fromRGBHex(color.replace('#', ''));
            case ColorFormat.HEX_0x:
                return Color.fromRGBHex(color.replace('0x', ''));
            case ColorFormat.HEX:
                return Color.fromRGBHex(color);
            case ColorFormat.RGB:
                try {
                    return Color.fromRGB(parseInt(color.split(',')[0]), parseInt(color.split(',')[1]), parseInt(color.split(',')[2]));
                } catch (e) {
                    return null;
                }
            case ColorFormat.RGB_parentheses:
                try {
                    return Color.fromRGB(parseInt(color.split('(')[1].split(',')[0]), parseInt(color.split('(')[1].split(',')[1]), parseInt(color.split('(')[1].split(',')[2]));
                } catch (e) {
                    return null;
                }
            case ColorFormat.RGB_parentheses_and_text:
                try {
                    return Color.fromRGB(parseInt(color.split('rgb(')[1].split(',')[0]), parseInt(color.split('rgb(')[1].split(',')[1]), parseInt(color.split('rgb(')[1].split(',')[2]));
                } catch (e) {
                    return null;
                }
        }
    }, [color_format])

    const [colorBuffer, setColorBuffer] = useState<string>(format_color(color));
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        setColorBuffer(format_color(color));
    }, [color, format_color]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(colorBuffer)
            .then(() => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            })
            .catch(err => console.error('Failed to copy: ', err));
    };

    const onBlur = useCallback(() => {
        const parsedColor = parse_color(colorBuffer);
        if (parsedColor && parsedColor.isValid()) {
            setColor(parsedColor);
        } else {
            setColorBuffer(format_color(color));
        }
    }, [color, colorBuffer, format_color, parse_color, setColor])

    return (
        <>
            <div style={{position: 'relative', display: 'inline-block', alignItems: 'center'}}>
                <input
                    type="text"
                    value={colorBuffer}
                    onChange={(e) => setColorBuffer(e.target.value)}
                    onBlur={() => onBlur()}
                    style={{
                        marginBottom: '25px',
                        padding: '5px 45px',
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        width: '100px',
                        textAlign: 'center',
                        borderRadius: '6px',
                        border: '1px dashed #ccc',
                        backgroundColor: '#f9f9f9',
                        marginLeft: '30px',
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                        msUserSelect: 'none',
                    }}
                />

                {/* Copy button */}
                <button
                    onClick={copyToClipboard}
                    style={{
                        marginBottom: '25px',
                        padding: '5px 10px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        backgroundColor: '#f9f9f9',
                        marginLeft: '10px',
                    }}
                >
                    Copy
                </button>
            </div>
            {showToast && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#333',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                        opacity: 0.9,
                        transition: 'opacity 0.3s ease-in-out',
                        zIndex: 1000,
                    }}
                >
                    Copied to clipboard!
                </div>
            )}
        </>
    );
}