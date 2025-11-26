import {Color} from "../types/Color.ts";
import {useEffect, useState} from "react";

type ColorCodeFieldProps = {
    color: Color;
    setColor: (color: Color) => void;
}

export default function ColorCodeField({
                                           color,
                                           setColor
                                       }: ColorCodeFieldProps) {
    const [colorBuffer, setColorBuffer] = useState<string>(color.toRGBHex());
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        setColorBuffer(color.toRGBHex());
    }, [color]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(colorBuffer)
            .then(() => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
            })
            .catch(err => console.error('Failed to copy: ', err));
    };    

    return (
        <>
            <div style={{position: 'relative', display: 'inline-block', alignItems: 'center'}}>
                <input
                    type="text"
                    value={colorBuffer}
                    onChange={(e) => setColorBuffer(e.target.value)}
                    onBlur={() => setColor(Color.fromRGBHex(colorBuffer))}
                    style={{
                        marginTop: '30px',
                        padding: '5px',
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        fontWeight: 'bold',
                        width: '100px',
                        textAlign: 'center',
                        borderRadius: '6px',
                        border: '1px dashed #ccc',
                        backgroundColor: '#f9f9f9',
                        marginLeft: '10px',
                    }}
                />

            {/* Copy button */}
                <button
                    onClick={copyToClipboard}
                    style={{
                        marginTop: '30px',
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