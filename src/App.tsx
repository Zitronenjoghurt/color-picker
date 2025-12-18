import './App.css'
import ColorPicker from "./components/ColorPicker.tsx";
import {useState} from "react";
import {Slider} from "radix-ui";
import {Color} from "./types/Color.ts";
import ColorCodeField, {ColorFormat} from "./components/ColorCodeField.tsx";

function App() {
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

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'row'}}>
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
                    <ColorCodeField color={color} setColor={setColor}
                                    color_format={ColorFormat.RGB_parentheses_and_text}/>
                    <div
                        style={{
                            backgroundColor: color.toCssRGB(),
                            width: '100px',
                            height: '100px',
                            marginLeft: '30px',
                            border: 'solid #ccc 1px'
                        }}>
                    </div>
                </div>

            </div>
        </>
    )
}

export default App
