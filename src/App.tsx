import './App.css'
import ColorPicker from "./components/ColorPicker.tsx";
import {useState} from "react";
import {Slider} from "radix-ui";
import {Color} from "./types/Color.ts";
import ColorCodeField from "./components/ColorCodeField.tsx";
import ColorCodeFieldDummy from './components/ColorCodeFieldDummy.tsx';

function App() {
    const [color, setColor] = useState<Color>(new Color(0, 0, 0));

    return (
        <>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{flexDirection: 'column'}}>
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
            </div >
            <div style={{display: "flex", flexDirection:"column"}}>
            <ColorCodeField color={color} setColor={setColor}/>
            <ColorCodeFieldDummy placeholder='0x hex'/>
            <ColorCodeFieldDummy placeholder='hex ohne'/>
            <ColorCodeFieldDummy placeholder='r,g,b'/>
            <ColorCodeFieldDummy placeholder='(r,g,b)'/>
            <ColorCodeFieldDummy placeholder='rgb(r,g,b)'/>
            </div>
        </div>
        </>
    )
}

export default App
