# ReliefMesh Guardian concept device pricing — November 18, 2026

This is **provisional cost-aware pricing**, not a manufacturing quotation, purchase offer, or certification claim. The devices are illustrative product designs and are not currently available for sale.

Prices on the public website are **indicative Sri Lankan retail targets**. They are set above estimated fully landed per-unit build allowances. The calculations reserve a conservative illustrative 18% output VAT and a separate 3% payment-processing fee from the tax-inclusive display price; whether VAT is legally charged depends on registration, supply and tax circumstances.

## Proposed prices and contribution model (LKR / unit)

| Device | Target retail | Electronics & power | Enclosure | Assembly & test | Packaging & logistics | Warranty, tooling allocation & contingency | Total estimated unit cost | Contribution after 18% illustrative VAT + 3% payment fee |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Guardian Button | 4,990 | 1,150 | 450 | 500 | 400 | 750 | 3,250 | 829 |
| Guardian Ring Lite | 8,490 | 2,050 | 1,250 | 900 | 500 | 800 | 5,500 | 1,440 |
| Guardian Ring Pro | 17,990 | 4,850 | 2,600 | 1,850 | 700 | 2,000 | 12,000 | 2,706 |
| Guardian Remote | 19,990 | 7,700 | 1,500 | 1,500 | 800 | 2,100 | 13,600 | 2,741 |

Formula: contribution = retail target / 1.18 − (retail target × 0.03) − unit cost. Rounded *down* to the nearest whole LKR. The model is intentionally preliminary, not based on RFQs from contract manufacturers. It assumes that sourcing and design allow the target unit cost to be achieved. Do **not** claim that these prices guarantee profitability.

## Capability and scope assumptions
- **Guardian Button**: Bluetooth LE SOS trigger that requires a compatible paired phone or gateway. No standalone GPS or cellular function.
- **Guardian Ring Lite**: compact smartphone-assisted SOS ring concept. A ring with an integrated LTE/GPS modem is **not** assumed possible at this target.
- **Guardian Ring Pro**: smartphone-assisted ring with exploratory optical/temperature sensing. Measurements are **not** medically validated.
- **Guardian Remote**: 4G/LTE-capable cellular and location concept (not a promise that an inexpensive legacy SIM800L 2G modem is deployment-ready). A SIM/data plan is excluded from the device price.

## Evidence informing component assumptions
Retail prices are only reference points and must **not** be treated as verified manufacturing/bulk pricing:
- ESP32-WROOM development board (LKR 1,700 at time of review): https://www.atomelectronics.lk/product/esp32-wroom-development-board/
- NEO-6M GPS module (LKR 1,400): https://www.atomelectronics.lk/product/neo-6m-gps-module-with-antenna/
- SIM800L reference (LKR 1,200, **2G only**, not the proposed production LTE modem): https://www.atomelectronics.lk/product/sim800l-gsm-gprs-module/
- MAX30102 sensor module (LKR 420): https://etusker.com/product/max30102-high-sensitivity-pulse-oximeter-and-heart-rate-sensor/
- TP4056 charger module (LKR 60): https://www.atomelectronics.lk/product/tp4056-1a-li-ion-battery-charger/
- 500mAh LiPo indicative retail listing: https://37left.lk/product/3-7v-500mah-lipo-battery
- 4G LTE-capable modem concept: https://alphatronic.lk/product/sima7670c-fs-mcore-4g-lte-module/
- Sri Lankan Inland Revenue Department VAT reference (standard 18%): https://www.ird.gov.lk/en/Type%20of%20Taxes/SitePages/Value%20Added%20Tax%20%28VAT%29.aspx

## Gate before taking pre-orders or claiming cost coverage
Obtain written BOM quotes at the target batch size, battery test results, enclosure manufacturing/tooling prices, ingress protection tests, electrical/RF compliance costs, warranty rate assumptions, payment and distribution fees, and an operator-level recurring service budget. In particular, custom smart-ring tooling, miniaturization and certification and LTE network certification could exceed these preliminary allowances.

One-time R&D, lab certifications, clinical testing, recurring SIM/data, software/cloud operations, advertising, taxes other than illustrative VAT, and retail-channel commissions are **not** included unless explicitly budgeted in the unit allowances. Recalculate retail targets if supplier quotes or applicable taxes/fees change; don't silently hold a loss-making retail price. No live checkout is included in the website.
