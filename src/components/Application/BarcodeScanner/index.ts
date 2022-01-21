import { Icon, appid } from "./Icon";

import { ApplicationConfig } from '../interfaces';
import { BarcodeScannerApp } from './Application';

export const BarcodeApplication: ApplicationConfig = {
  id: appid,
  name: "Barcode Scanner",
  description: "Scan barcode",
  icon: Icon,
  application: BarcodeScannerApp
}

