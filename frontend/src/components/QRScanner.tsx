import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export const QRScanner = ({ onScan }: { onScan: (decodedText: string) => void }) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        scanner.render(
            (decodedText) => {
                scanner.clear();
                onScan(decodedText);
            },
            (err) => { // ignore active frame scan errors
            }
        );

        return () => {
            scanner.clear().catch(() => { });
        };
    }, [onScan]);

    return (
        <div className="w-full max-w-sm mx-auto overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white">
            <div id="qr-reader" className="w-full h-full [&>button]:!bg-primary-600 [&>button]:!text-white [&>button]:!px-4 [&>button]:!py-2 [&>button]:!rounded-md [&>button]:!mt-2" />
        </div>
    );
};
