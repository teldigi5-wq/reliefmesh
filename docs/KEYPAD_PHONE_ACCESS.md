# ReliefMesh: emergency access for keypad-phone-only households

Reviewed: 18 November 2026. **Engineering plans only — no tested cellular Guardian Button, deployed SMS hotline, operator contract, government subsidy or certified response service exists.**

## Why this matters

Many intended ReliefMesh beneficiaries use simple button/keypad/feature phones, not smartphones. A **Bluetooth-only Guardian Button (concept target Rs. 1,990 before VAT)** or **Guardian Ring Lite (Rs. 4,490 before VAT)** relies on a paired smartphone to generate and forward a message. That design is **not directly usable** by somebody who only has an ordinary feature phone. A basic mobile phone can receive a normal carrier SMS or voice call without installing an app.

## Three access paths to investigate

1. **Guardian Cellular Button — NEW variant, unpriced:** the user wears/carries one simple tactile SOS button with built-in cellular LTE Cat 1 modem, SIM/eSIM, microcontroller, antenna, rechargeable battery and optional audible/vibration acknowledgement. Long-press for SOS → retry via supported mobile network → preconfigured SMS/call to at least one contact with a keypad phone. The recipient can read SMS or answer calls. No dedicated smartphone or GPS in the basic concept. No accurate GNSS coordinates in base version; avoid implying precise location. Explore carrier network-location if permission and technical integration allow. This is not the existing Rs. 1,990 BLE Button.
2. **Guardian Remote — existing price model, conceptual:** planned standalone LTE/GNSS alert device, provisional Rs. 8,990 before applicable VAT, or Rs. 3,990 household contribution only if **Rs. 5,000 per unit of uncommitted external funding** is secured. A future SMS and/or automated voice alert could reach keypad phones. SIM, connectivity, network certification, live device and SMS routing remain unverified. Must be compact/clip-on, rather than a handset users carry everywhere.
3. **Feature phone manual fallback — future service:** user dials or texts a published, staffed ReliefMesh number, which forwards verified incident details into the dashboard via a telecom/SMS gateway. No such number is presently deployed. People should rely on existing verified emergency contacts and emergency numbers rather than this prototype during an emergency.

A **BLE ring → pocket LTE gateway** is an additional future investigation for users who want an on-finger trigger without a smartphone, but it increases equipment price, battery requirements and carried-device burden. Do not present this as available, cheaper or independent of a hub.

## Illustrative concept flows (not implemented)

- Cellular Button → its **own SIM/cellular network** → SMS/call → ordinary button phone carried by family member.
- Remote → its **own SIM + planned GNSS** → SMS/call containing SOS and location when available → ordinary button phone.
- Ordinary button phone → manually sent SMS / initiated voice call → *future* dedicated inbound number → *future* controlled backend webhook and incident record.

Note: SMS/voice reception on a keypad phone is different from expecting that phone to pair with a BLE wearable or install the ReliefMesh app.

## Network, compliance and safety considerations

- Operator Dialog notes that older 2G SIMs are being phased toward 4G SIMs; a 2G-only phone may still make/receive voice/SMS, but this is not a durable assumption for future product cellular modem design: https://dialog.lk/convert-2g-sim-to-4g
- Dialog + HMD announced new 4G feature phones in Oct 2026: https://www.ft.lk/a/b/1-798208
- LTE Cat 1/GNSS modem development hardware illustrates possible SMS, call and location capabilities; module version/firmware/VoLTE and Sri Lankan network compatibility must be verified: https://www.waveshare.com/wiki/A7670E_Cat-1/GNSS_HAT
- TRCSL requires approval/clearance for importation of SIM-connected cellular devices: https://trc.gov.lk/licensing/pages_e.php?id=63
- TRCSL also regulates low-power short-range/IoT equipment: https://www.trc.gov.lk/licensing/pages_e.php?id=68

Before selling or calling any device ready: source production-quality cellular modems; quote complete per-unit BOM at 100/500/1,000-unit volumes; evaluate SMS delivery/latency, telephone-call fallback, carrier coverage in rural Sri Lanka, batteries/charging and power-on time, activation confirmation, accidental activation, contact opt-in and privacy, maintenance cost, tamper resistance, type approval, taxes, and a feasible dispatch workflow. **SMS delivery is not guaranteed**, and an emergency service must have an independent contingency and staffed operational agreements.

## Price caution

Keep the existing Bluetooth Button Rs. 1,990 (planning target only) **clearly separate from the unpriced Cellular Button**. The independent cellular version has materially different modem, radio, SIM, antenna, battery, PCB, test and certification costs. No credible exact cellular-button price or operating margin can be offered until complete supplier quotations are received. A lower household-access price would require explicit, confirmed sponsorship, consistent with the Remote programme's unapproved goal.
