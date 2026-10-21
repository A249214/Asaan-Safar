import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeCanvasProps {
  value: string;
  size?: number;
  className?: string;
  altText?: string;
}

export function QRCodeCanvas({ value, size = 160, className = '', altText = 'Ticket QR Code' }: QRCodeCanvasProps) {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    if (!value) return;

    QRCode.toDataURL(value, {
      width: size * 2, // 2x for retina & crisp printing
      margin: 1,
      color: {
        dark: '#171A1D',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) {
          setDataUrl(url);
          setError(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR code', err);
        if (isMounted) setError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  if (error || !dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`bg-white rounded-lg border border-[#DDD5C5] flex items-center justify-center p-2 text-center ${className}`}
      >
        <span className="text-[10px] text-[#A9A59B] font-mono">Generating Secure QR...</span>
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-block bg-white p-1 rounded-lg border border-[#DDD5C5] shadow-sm ${className}`}
    >
      <img
        src={dataUrl}
        alt={altText}
        width={size}
        height={size}
        className="w-full h-full object-contain block select-none"
      />
    </div>
  );
}
