# ReliefMesh Guardian: family-first device and accessibility plan
Updated 18 November 2026. This document is a pricing and product-concept planning scenario—not a verified quotation, tax determination, product sale or sponsor agreement.

## Product strategy

ReliefMesh does **not** expect people to carry all four Guardian devices.

- **Guardian Button** — the most affordable tactile SOS trigger for low-income households **with a compatible smartphone**. Bluetooth alone cannot contact a responder.
- **Guardian Ring Lite** — the everyday-wear ring for people who want a fast, discreet SOS control. It also relies on a paired smartphone.
- **Guardian Ring Pro** — an optional, higher-cost sensor concept, not the humanitarian entry product. PPG/temperature features are experimental and not medically validated.
- **Guardian Remote** — phone-free emergency communications using planned LTE/GNSS hardware for people without a smartphone. It should be **redesigned toward compact clip-on, lanyard or bag attachment** rather than requiring a bulky device carried in the hand. Size, reliability and battery life are unverified.

A shared Remote at home only supports the location and person actually equipped with it. **It is not coverage for family members travelling elsewhere.** A Button-to-Remote Bluetooth gateway is a possible future design, but it does not exist or work in the current prototype and must not be advertised as an implemented capability.

## Lower bulk-price and unit-cost TARGETS (LKR)

The scenario assumes 500–1,000 units and supplier/module sourcing rather than retail development boards. Cost ceilings below are *goals, not supplier quotes*. Prices are proposed base targets before legally applicable VAT.

| Device | Previous base target | Revised base target | Estimated unit cost ceiling | Balance after 3% payment fee & unit cost (before overhead/VAT) | Price if an illustrative 18% VAT is added |
|---|---:|---:|---:|---:|---:|
| Guardian Button | 2,990 | **1,990** | **1,400** | 530 | 2,350 |
| Guardian Ring Lite | 5,490 | **4,490** | **3,000** | 1,355 | 5,300 |
| Guardian Ring Pro | 11,990 | **11,990** | **8,000** | 3,630 | 14,150 |
| Guardian Remote | 14,990 | **8,990** | **6,400** | 2,320 | 10,610 |

**Model:** balance = floor(base retail price − 0.03 × base retail price − fully landed unit-cost ceiling). The VAT scenario is a separately rounded **customer total** under an assumed standard 18% rate, not an assertion of the project's real tax status. This balance is not operating profit and does not guarantee commercial viability.

### Unit-cost ceilings by cost group

| Category | Button | Ring Lite | Ring Pro | Remote |
|---|---:|---:|---:|---:|
| Electronics / power | 610 | 1,180 | 3,550 | 3,650 |
| Enclosure | 180 | 510 | 1,550 | 570 |
| Assembly / test | 170 | 370 | 1,000 | 650 |
| Packaging / logistics | 130 | 240 | 400 | 380 |
| Warranty, tooling / contingency allowance | 310 | 700 | 1,500 | 1,150 |
| **Total** | **1,400** | **3,000** | **8,000** | **6,400** |

The **Remote target is aggressive**. Small-batch cellular/GNSS boards, GNSS antennas, certified batteries, reliability tests and network certifications could easily exceed its assumed budget. Design and price must be adjusted to actual manufacturing quotes; never silently use a margin calculation to claim a verified cost.

## Family access: Free or low contribution, only IF funded

The earlier Rs. 3,990 assisted Remote goal remains too expensive for many intended families. The redesigned **proposed** programme has two household access tiers; **neither is currently approved, funded or available**:

| Proposal | Household contributes | Outside funding required for each Remote | Combined device funding target |
|---|---:|---:|---:|
| Highest-need households — fully sponsored | **Rs. 0** | **Rs. 8,990** | Rs. 8,990 |
| Other eligible low-income households — nominal contribution | **Rs. 499** | **Rs. 8,491** | Rs. 8,990 |

The full Rs. 8,990 is the same **unverified** target base funding amount as the current procurement model, not an audited factory price. The model assumes a preliminary production ceiling of Rs. 6,400 per Remote and an illustrative 3% payment fee on full receipts: Rs. 8,990 − Rs. 269.70 − Rs. 6,400 = Rs. 2,320.30 before fixed overhead, applicable VAT and any other unbudgeted expenses. Under either tier, the required sponsor pays the remainder. Receiving only Rs. 0 or Rs. 499 from the family **does not recover manufacturing costs**.

Mandatory limitations:
- No sponsoring organisation, government agency, NGO, CSR partner or telecom operator has committed to this support.
- No enrolment process, subsidy approval, sales, free distribution or pre-order is currently available.
- Applicable VAT, SIM/data service, maintenance, certification, repairs, outreach and operating expenses must be supported separately or explicitly included in a verified and sufficient funding agreement.
- Eligibility criteria must be developed transparently and fairly, especially for households without smartphones and people at high risk.
- Families with only basic phones cannot use the Rs. 1,990 Bluetooth Guardian Button independently; a separate Cellular Button remains an unpriced, unbuilt product concept.
- Actual quotes, tax treatment, device design and sponsor terms must be reviewed before confirming any financial commitment or public availability.

### Government discussion vs approved VAT relief

Sri Lanka's standard VAT is currently 18%; an exemption or zero rating depends on statutory conditions. Interest in discussing this with government is **not** sufficient to say device sales are VAT-free. Any assisted sales programme must take import VAT, domestic output VAT, customs duties/levies, and the business's registration obligations into account, with professional advice and written approval where required.

IRD: https://www.ird.gov.lk/en/Type%20of%20Taxes/SitePages/Value%20Added%20Tax%20%28VAT%29.aspx

## Sourcing opportunities and engineering validation

A public bulk listing for a SIMCom A7670E LTE Cat 1 module shows a **1,000+ tier around US$6.66 for the modem module alone**. Other variants do **not** all provide GNSS. Do not confuse a basic LTE modem with a finished, Sri Lanka-network-compatible GNSS SOS device. The module's variant, LTE bands, GNSS capability, antenna, certification, logistics and actual 2026 price must be confirmed.

- https://electrotechglobal.com/product/a7670e/
- https://www.lcsc.com/product-detail/2g-3g-4g-5g-modules_simcom-wireless-solutions-a7670e-fase_C7435296.html
- https://zephyr-t.com/products?cat=cellular-modules
- Sri Lanka LTE module reference: https://alphatronic.lk/product/sima7670c-fs-mcore-4g-lte-module/

**Supplier RFQs** must request 100 / 500 / 1,000 / 5,000 unit price breaks, original part traceability, Sri Lankan network frequency compatibility, GNSS variant and antenna, power consumption, BOM, assembly, enclosure/clip design, battery cell, charging safety, RF approval, water resistance claims, bench tests, rework yield, shipping and tax.

A no-smartphone household could use a properly deployed independent Remote, but would still need a supported SIM/data subscription and a tested response workflow. Bluetooth-only Button and rings require a nearby paired phone, unless an entirely separate, verified gateway is built.

## Commercial readiness checklist

- [ ] Functional physical prototypes and usability testing (including elderly and mobility-impaired users)
- [ ] Three independently sourced bulk quotations meeting the entire landed-cost ceiling, not just chip prices
- [ ] Test battery size, charge life, button activation and connectivity in representative Sri Lankan networks
- [ ] Validate assembly yield, warranty replacements and accessible physical form factor
- [ ] Validate product compliance and import obligations and obtain tax advice
- [ ] Obtain **actual written sponsor commitments** before advertising any fully sponsored or Rs. 499 household-access plan
- [ ] Budget cloud/application operating expenses, SIM subscription, outreach, R&D and response coordination
- [ ] Recalculate target prices or reduce BOM scope if any of the above assumptions fail

This is an emergency-safety engineering concept, not a certified response service. It must not be portrayed as life-saving hardware with guaranteed dispatch until end-to-end reliability and partnerships have been validated.
