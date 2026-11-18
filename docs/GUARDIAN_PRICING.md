# ReliefMesh Guardian bulk-sourcing affordability plan
Updated: 18 November 2026. Project stage: **concept only; no sales, tax exemption, manufacturer quotations, government approval or certified devices.**

## Revised price targets

The previous proposals assumed relatively small-scale purchasing. These revised targets assume negotiation for **500–1,000 units**, assembled locally where practical. The prices are intended to be more affordable for Sri Lankan families; production and legal feasibility are still unverified.

**The base prices are before any legally applicable output VAT.** ReliefMesh intends to seek a government-supported exemption, zero-rating, or other appropriate mechanism; none has been granted or verified. Do not display the base price as a final VAT-inclusive consumer quotation unless legally permissible.

| Device | Old target | New base target (before VAT) | Bulk unit cost ceiling (estimated) | Estimated surplus before fixed overhead and any VAT, after 3% fee | If standard 18% VAT is added: illustrated consumer total | Estimated surplus at VAT scenario after VAT + 3% fee |
|---|---:|---:|---:|---:|---:|---:|
| Guardian Button | 4,990 | 2,990 | 1,900 | 1,000 | 3,530 | 985 |
| Guardian Ring Lite | 8,490 | 5,490 | 3,650 | 1,675 | 6,480 | 1,647 |
| Guardian Ring Pro | 17,990 | 11,990 | 8,000 | 3,630 | 14,150 | 3,567 |
| Guardian Remote | 19,990 | 14,990 | 10,000 | 4,540 | 17,690 | 4,460 |

*Contribution formula (base scenario): price − 3% processing allowance − estimated per-unit landed build cost. VAT scenario: rounded-up gross / 1.18 − 3% of gross − unit cost. Contribution is **not** net company profit and does **not** cover unbudgeted software operations, financing, installation, certification, research, distribution commission or unforeseen component prices.*

## Preliminary per-unit cost ceilings (LKR)

| Component grouping | Button | Ring Lite | Ring Pro | Remote |
|---|---:|---:|---:|---:|
| Electronics & power | 800 | 1,450 | 3,550 | 5,700 |
| Enclosure, tooling allocation | 240 | 650 | 1,550 | 1,000 |
| Assembly & testing | 220 | 480 | 1,000 | 1,050 |
| Packaging & logistics | 170 | 270 | 400 | 450 |
| Warranty, tooling & contingency | 470 | 800 | 1,500 | 1,800 |
| **Target unit cost ceiling** | **1,900** | **3,650** | **8,000** | **10,000** |

These are **desired procurement targets, not supplier quotations**, and may be too low for short production runs, miniaturized smart rings, or certification-grade hardware. Stop sales planning and reprice if written supplier and assembly quotes do not support these ceilings.

## Product comparisons and required compromises

| Device | Primary audience | SOS communications | Location source | Needs paired smartphone? | Wellness sensors | Ongoing network cost |
|---|---|---|---|---|---|---|
| Button | Families, older adults | BLE to mobile app | Paired smartphone | Yes | No | Smartphone data |
| Ring Lite | Everyday wearable safety | BLE to mobile app | Paired smartphone | Yes | No | Smartphone data |
| Ring Pro | Personal safety and *exploratory* wellness | BLE to mobile app | Paired smartphone | Yes | Proposed PPG/temp (unvalidated) | Smartphone data |
| Remote | Independent location-capable concept | Proposed LTE/GNSS cellular hardware | Built-in GNSS (planned) | No | No | SIM/data plan |

None of these designs should claim dispatch integration, guaranteed coverage, waterproof certification, medical-grade metrics or verified battery life. Bluetooth depends on the paired phone's presence and connection; LTE requires reliable network coverage and supported modem bands.

## Component procurement strategy

1. Request written quotations for 100, 500, 1,000 and 5,000 units from **at least three independent suppliers**; do not confuse prototype dev boards with production modules.
2. Seek genuine ESP32-C3/MINI family production modules for Bluetooth-based products, using a shared PCB/power design across Button/Ring Lite where feasible.
3. Negotiate local PCB assembly, battery sourcing, enclosure moulding, button manufacturing, testing, packaging, freight, taxes and warranty replacement costs separately.
4. For Ring Pro, obtain miniaturized PPG/temperature sensor, charging, power-budget, comfort and battery testing quotes. For Remote, specify LTE bands valid in Sri Lanka, GNSS and antenna design before accepting any modem offer. **Do not substitute 2G SIM800L for 4G/LTE**.
5. Verify written quotes for the full landed unit cost, minimum order quantities, assembly yield, rework/scrap, lead times and safety compliance.
6. Seek government support for humanitarian/affordability aims and confirm tax treatment **in writing** with the appropriate fiscal authorities and professional tax/legal advice. A meeting or intent to request relief does not make sales VAT-exempt.

### External price and tax references (informational, *not* quote evidence)

- ESP32-C3-MINI reference with 500-unit tier from LCSC: https://www.lcsc.com/product-detail/wifi-modules_espressif-esp32-c3-mini-1-n4-a_C5224444.html
- Other ESP32-C3 module reference: https://www.lcsc.com/product-detail/C2926676.html
- SIMCom LTE/M2M modules catalog: https://www.tme.eu/en/katalog/m2m-gprs-lte-5g-modules_113195/p%2Csimcom_109/
- Sri Lanka IRD VAT rates/registration (standard VAT 18%, legal exemption dependent): https://www.ird.gov.lk/en/Type%20of%20Taxes/SitePages/Value%20Added%20Tax%20%28VAT%29.aspx
- Sri Lanka IRD VAT exemption schedule and consolidated act: https://www.ird.gov.lk/en/publications/Value%20Added%20Tax_Acts/VAT_Act_No_14%5BE%5D_2002_%28Consolidation_2025%29.pdf

**VAT note:** Under current IRD guidance, commercial importers may have VAT registration obligations irrespective of ordinary turnover thresholds. Further levies/customs/import fees and implications of exemption versus zero-rating or being non-registered must be evaluated separately. A zero-VAT hypothetical is **not** a legal status or current sale price.

## Readiness gate

Before publishing confirmed prices or accepting payment, require: completed hardware/firmware prototypes, at least 3 BOM quotes, fully landed per-unit costs for realistic order volume, enclosure/tooling RFQs, waterproof/battery/electrical/RF testing plans, written tax opinion, written government support status, warranty funding, support/cloud/data recurring-cost budget, and manufacturing batch-loss buffer. Neither fixed R&D overhead nor these further compliance costs are guaranteed covered by this per-unit model.
