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

    useEffect(() => {
        setColorBuffer(color.toRGBHex());
    }, [color]);

    return (
        <div style={{position: 'relative', display: 'inline-block'}}>
            <input
                type="text"
                value={colorBuffer}
                onChange={(e) => setColorBuffer(e.target.value)}
                onBlur={() => setColor(Color.fromRGBHex(colorBuffer))}
            />
        </div>
    );
}