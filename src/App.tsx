import './App.css'
import ColorPicker from "./components/ColorPicker.tsx";
import {useState} from "react";
import {Slider} from "radix-ui";
import {Color} from "./types/Color.ts";
import ColorCodeField, {ColorFormat} from "./components/ColorCodeField.tsx";
import { useEffect, useRef } from "react";


function App() {
    const [showVideo, setShowVideo] = useState(false);
    const [color, setColor] = useState<Color>(new Color(0, 0, 0));

    const satLeft = new Color(color.hue, 0, color.val).toCssRGB();
    const satRight = new Color(color.hue, 1, color.val).toCssRGB();

    const saturationGradient = `linear-gradient(
    to right,
    ${satLeft},
    ${satRight}
    )`;

    const valLeft = new Color(color.hue, color.sat, 0).toCssRGB();
    const valRight = new Color(color.hue, color.sat, 1).toCssRGB();

    const valueGradient = `linear-gradient(
    to right,
    ${valLeft},
    ${valRight}
    )`;

    const sequence = ["ArrowUp", "ArrowDown", "ArrowDown"];
   
    const indexRef = useRef(0);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === sequence[indexRef.current]) {
                indexRef.current++;

                if (indexRef.current === sequence.length) {
                    setShowVideo(prev => !prev); // toggle
                    indexRef.current = 0;
                }
            } else {
                indexRef.current = 0; // reset on wrong key
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);


    return (
        <>
            <div style={{display: 'flex', flexDirection: 'row'}}>

            {showVideo && (
                <div style={{ marginRight: 50 }}>
                    <iframe
                        width="250"
                        height="560"
                        src="https://www.youtube.com/embed/zZ7AimPACzc?autoplay=1&mute=1"
                        allow="autoplay; encrypted-media;"
                    />
                </div>
            )}


                <div style={{flexDirection: 'column'}}>
                    <ColorPicker color={color} setColor={setColor}/>
                    <form>
                        {/* Hue Slider */}
                        <Slider.Root
                            className="SliderRoot"
                            min={0}
                            max={360}
                            step={1}
                            value={[color.hue * 360]}
                            onValueChange={(value) => {
                                const newColor = new Color(
                                    value[0] / 360,
                                    color.sat,
                                    color.val
                                );
                                setColor(newColor);
                            }}
                        >
                            <Slider.Track className="SliderTrack">
                                <Slider.Range className="SliderRange"/>
                            </Slider.Track>
                            <Slider.Thumb
                                className="SliderThumb"
                            />
                        </Slider.Root>

                        {/* Saturation Slider */}
                        <Slider.Root
                            className="SliderRoot"
                            min={0}
                            max={100}
                            step={1}
                            value={[color.sat * 100]}
                            onValueChange={(value) => {
                                const newColor = new Color(
                                    color.hue,
                                    value[0] / 100,
                                    color.val
                                );
                                setColor(newColor);
                            }}
                        >
                            <Slider.Track className="SliderTrack"
                                          style={{background: saturationGradient}}>
                                <Slider.Range className="SliderRange"/>
                            </Slider.Track>
                            <Slider.Thumb
                                className="SliderThumb"/>
                        </Slider.Root>

                        {/* Value Slider */}
                        <Slider.Root
                            className="SliderRoot"
                            min={0}
                            max={100}
                            step={1}
                            value={[color.val * 100]}
                            onValueChange={(value) => {
                                const newColor = new Color(
                                    color.hue,
                                    color.sat,
                                    value[0] / 100,
                                );
                                setColor(newColor);
                            }}
                        >
                            <Slider.Track className="SliderTrack"
                                          style={{background: valueGradient}}>
                                <Slider.Range className="SliderRange"/>
                            </Slider.Track>
                            <Slider.Thumb
                                className="SliderThumb"
                            />
                        </Slider.Root>
                    </form>
                </div>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <ColorCodeField color={color} setColor={setColor} color_format={ColorFormat.HEX_hashtag}/>
                    <ColorCodeField color={color} setColor={setColor} color_format={ColorFormat.HEX_0x}/>
                    <ColorCodeField color={color} setColor={setColor} color_format={ColorFormat.HEX}/>
                    <ColorCodeField color={color} setColor={setColor} color_format={ColorFormat.RGB}/>
                    <ColorCodeField color={color} setColor={setColor} color_format={ColorFormat.RGB_parentheses}/>
                    <ColorCodeField color={color} setColor={setColor} color_format={ColorFormat.RGB_parentheses_and_text}/>
                    <div style={{display:'flex', justifyContent: 'center'}}>
                    <div
                        style={{
                            backgroundColor: color.toCssRGB(),
                            width: '100px',
                            height: '100px',
                            marginLeft: '30px',
                            border: 'solid #ccc 1px'
                        }}>
                    </div>
                                        <div
                        style={{
                            backgroundColor: color.complementary(),
                            width: '100px',
                            height: '100px',
                            marginLeft: '30px',
                            border: 'solid #ccc 1px',
                            cursor: 'pointer'
                        }}
                        onClick={() => setColor(color.complementaryColor())}
                        >    
                    </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default App
