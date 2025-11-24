import './App.css'
import ColorPicker from "./components/ColorPicker.tsx";
import {useState} from "react";
import {Slider} from "radix-ui";
import {Color} from "./types/Color.ts";
import ColorCodeField from "./components/ColorCodeField.tsx";

function App() {
    const [color, setColor] = useState<Color>(new Color(0, 0, 0));

    return (
        <>
            <ColorPicker color={color} setColor={setColor}/>
            <form>
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
                        style={{
                            backgroundColor: `hsl(${color.hue * 100}%, ${color.sat * 100}%, ${color.val * 100}%)`
                        }}
                    />
                </Slider.Root>
            </form>
            <ColorCodeField color={color} setColor={setColor}/>
        </>
    )
}

export default App
