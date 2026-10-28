# Test matrix - LS-202 Long-stay discount

| # | Nights | Room | Guests | Expected | Type |
|---|--------|------|--------|----------|------|
| 1 | 3 | Standard | 2 | "3 night(s) · Total 1,620,000 VND (10% long-stay discount)" (AC1) | Happy path |
| 2 | 4 | Deluxe | 1 | 3,240,000 + discount note (AC2) | Happy path |
| 3 | 10 | Standard | 2 | "10 night(s) · Total 5,400,000 VND (10% long-stay discount)" (AC4) | Happy path |
| 4 | 1 | Standard | 2 | "1 night(s) · Total 600,000 VND", no note | Boundary (min nights) |
| 5 | 2 | Standard | 2 | "2 night(s) · Total 1,200,000 VND", no note (AC3) | Boundary below |
| 6 | 2 | Deluxe | 2 | 1,800,000, no note | Boundary below |
| 7 | 3 | Deluxe | 2 | 2,430,000 + note | Boundary at |
| 8 | 30 | Deluxe | 2 | 24,300,000 + note | Boundary (long stay) |
| 9 | 2 → 3 | Standard | 2 | 1,200,000 → 1,620,000, note appears (AC5) | Happy path (re-check) |
| 10 | 3 → 2 | Standard | 2 | 1,620,000 → 1,200,000, note disappears | Boundary (re-check) |
| 11 | 3 | Standard → Deluxe | 2 | 1,620,000 → 2,430,000, note stays | Data variation |
| 12 | 3 | Standard | 1 | 1,620,000 + note | Boundary (min guests) |
| 13 | 3 | Deluxe | 6 | 2,430,000 + note | Boundary (max guests) |
| 14 | 3 (Nov 29 → Dec 2) | Standard | 2 | 1,620,000 + note | Across month end |
| 15 | 3 (Dec 30 → Jan 2) | Deluxe | 2 | 2,430,000 + note | Across year end |
| 16 | 2 (Feb 27 → Mar 1) | Standard | 2 | 1,200,000, no note (2027 not a leap year) | Data variation (February) |
| 17 | 3 (today Oct 28 → Oct 31) | Standard | 2 | 1,620,000 + note | Boundary (R2, check-in today) |
| 18 | 0 (same day) | Standard | 2 | Error R3, no price, no note | Negative |
| 19 | -3 (checkout before checkin) | Standard | 2 | Error R3, no price | Negative |
| 20 | 3 (yesterday Oct 27) | Standard | 2 | Error R2, no price | Negative |
| 21 | 3 | Standard | 0 | Error R1, no price | Negative |
| 22 | 3 | Standard | 7 | Error R1, no price | Negative |
| 23 | 3 | Standard | 2.5 | Error R1, no price | Negative |
| 24 | 3 | Standard | blank | Error R1, no price | Negative |
| 25 | 3 | No room type | 2 | Validation error, no price | Negative |

Not sure yet: 
- Do guests affect price? R4 is nights × rate only, so cases 12–13 assume not. Can a Deluxe room hold 6 guests?
- Error wording and order: no messages are specified, and it's unclear which error shows when several rules fail at once.
- Stale price: if dates change after “Check price”, should the old total and note hide until the next click?
- Maximum stay: case 8 assumes 30 nights is allowed; the ticket sets no upper limit.
- “Today” timezone: assumed Hoi An time (UTC+7). A foreign guest near midnight could fail R2.
- Number format: 1,620,000 (ticket) or 1.620.000 (Vietnamese locale)?
- Singular wording: “1 night(s)” or “1 night”?
- Conflicts with the policy decision doc: LS-202 gives 10% from 3 nights; the doc recommends tiers from 7 nights (10% / 15% / 25%). The client must choose one (ticket open question 4).