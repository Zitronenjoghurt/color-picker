import './App.css'
import ColorPicker from "./components/ColorPicker.tsx";
import {useState} from "react";
import {Slider} from "radix-ui";

function App() {
    const [hue, setHue] = useState(0);

    return (
        <>
            <ColorPicker hue={hue}/>
            <form>
                <Slider.Root
                    className="SliderRoot"
                    min={0}
                    max={255}
                    step={1}
                    onValueChange={(value) => setHue(value[0])}
                >
                    <Slider.Track className="SliderTrack">
                        <Slider.Range className="SliderRange"/>
                    </Slider.Track>
                    <Slider.Thumb className="SliderThumb"/>
                </Slider.Root>
            </form>
        </>
    )
}

export default App
