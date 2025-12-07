import {useState} from "react";

type ColorCodeFieldProps = {
  placeholder?: string;
};

export default function ColorCodeField({placeholder} : ColorCodeFieldProps) {
    const [showToast, setShowToast] = useState(false);


    const copyToClipboard = () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };    

    return (
        <>
            <div style={{position: 'relative', display: 'inline-block', alignItems: 'center'}}>
                <input
                    type="text"
                    placeholder={placeholder}
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