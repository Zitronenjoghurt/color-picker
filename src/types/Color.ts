export class Color {
    hue: number;
    sat: number;
    val: number;

    constructor(hue: number, sat: number, val: number) {
        this.hue = hue;
        this.sat = sat;
        this.val = val;
    }

    // https://www.rapidtables.com/convert/color/rgb-to-hsv.html
    static fromRGB(red: number, green: number, blue: number): Color {
        const r = red / 255;
        const g = green / 255;
        const b = blue / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        let hue = 0;
        let sat = 0;
        let val = max;

        if (delta !== 0) {
            if (max === r) {
                hue = 60 * (((g - b) / delta) % 6);
            } else if (max === g) {
                hue = 60 * (((b - r) / delta) + 2);
            } else if (max === b) {
                hue = 60 * (((r - g) / delta) + 4);
            }
        }

        if (max !== 0) {
            sat = delta / max;
        }

        return new Color(hue / 360, sat / 100, val / 100);
    }

    static fromRGBHex(hex: string): Color {
        const [r, g, b] = hex.slice(1).match(/.{1,2}/g)!.map(x => parseInt(x, 16));
        return Color.fromRGB(r, g, b);
    }

    // https://www.rapidtables.com/convert/color/hsv-to-rgb.html
    toRGB(this: Color): [number, number, number] {
        const hue = this.hue * 360;
        const sat = this.sat * 100;
        const val = this.val * 100;

        const c = val * sat;
        const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
        const m = val - c;

        let r = 0;
        let g = 0;
        let b = 0;
        if (hue < 60) {
            r = c;
            g = x;
        } else if (hue < 120) {
            r = x;
            g = c;
        } else if (hue < 180) {
            g = c;
            b = x;
        } else if (hue < 240) {
            g = x;
            b = c;
        } else if (hue < 300) {
            r = x;
            b = c;
        } else {
            r = c;
            b = x;
        }

        return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
    }

    toRGBHex(this: Color): string {
        const [r, g, b] = this.toRGB();
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
}