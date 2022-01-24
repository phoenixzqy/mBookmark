import { Icon, appid } from "./Icon";

import { ApplicationConfig } from '../interfaces';
import { QRCodeScannerApp } from './Application';

export const QRCodeApplication: ApplicationConfig = {
  id: appid,
  name: "QRCode Scanner",
  description: "Scan qrcode",
  icon: Icon,
  application: QRCodeScannerApp
}

