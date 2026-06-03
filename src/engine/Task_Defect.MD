
Evaluated defect statuses and updated feature implementations
กำลังสรุปว่าตรงไหนแก้ไปแล้วและตรงไหนยังค้าง — รายการสั้น ๆ ด้านล่างครับ.

เสร็จแล้ว (แก้/เพิ่มโค้ด)

Feeding Draw (Main) — เลือกคืน 2 ใบเป็น multi-select และคืนเข้าด้านล่างของเด็ค (engine + UI): game.js, app.js
Feeding Draw (Flash +3000 BP) — handler อยู่แล้ว (engine): game.js
The Barrage Forest — เพิ่มการ resolve effect เพื่อทำลายเป้าหมาย (engine): game.js
Bubble Cluster Realm — onDeploy exhaust handler + onMainStep (Start of Main) จะถูกทริกเกอร์จาก startTurn (engine): game.js
Quarry Plain — เพิ่มการเลือก/resolve เพื่อ refresh Mineroid spirit (engine): game.js
The Menhir Circle — แก้ UI + engine ให้เลือก up to 2 White Mineroid กลับลงเด็คและจั่วตามจำนวน (engine + UI): game.js, app.js
Rock Drilling / Nestling (Mineroid/Thunder Dragon selection flows) — รองรับการเลือกหลายใบ (engine + UI): game.js, app.js
Heavy exhaust (ArmoredHands Squid) — เพิ่ม flag สำหรับ heavy-exhaust และทำให้ไม่ถูก refresh ทันทีที่ refresh step (engine): game.js
เรียกใช้งาน onMainStep ให้ Nexus ตอนเริ่ม Main phase (startTurn) — ทำให้ความสามารถแบบ "Start of Your Main Step" ทำงาน (engine): game.js
ยังไม่ได้แก้ / ยังต้องทำ

Invoke: Main — ยังไม่มีปุ่ม UI สำหรับเรียก Invoke:Main แบบ manual (เช่น Utmost Depth ตัวอย่าง) — engine ทริกเกอร์ onMainStep แล้ว แต่ถ้าต้องการปุ่ม/flow เพิ่มจะต้องเขียน UI เพิ่ม (pending).
Flutty (Flash — Opposing Attack Step flash-summon by defender) — engine มี canFlashSummon/flashSummon แต่ UI ยังไม่มีปุ่มสำหรับผู้ป้องกัน flash-summon (pending): game.js, UI ต้องเพิ่ม handler.
Blood Sip / Vortex Shave (Flash-in-Main edge cases) — ยังต้องตรวจสอบ/ปรับ UI/flow ของ Flash ในช่วง Main (pending).
Garizarot (When Attacks — allow selecting exhausted opposing spirit to force block) — ต้องเพิ่ม UI เลือกเป้าหมายในหน้าต่าง attack/when-attacks flow (pending).
รายการอื่น ๆ ที่คุณระบุ แต่ไม่ได้ถูกแก้โดยตรง เพราะเป็นปัญหา UI/flow ของ Flash/Invoke หรือยังต้อง reproduce เพิ่ม (pending).

reveal xxx cards หลายใบไม่แสดงว่าใบไหน