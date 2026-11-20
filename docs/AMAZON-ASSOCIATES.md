# Amazon Associates: what must happen before links earn

Checked 2026-11-20 against Amazon's own pages: Operating Agreement (updated Oct 15, 2025), Program Policies (updated Apr 14, 2026), and the Associates Central help pages "Application Review Process" and "Account Dormancy". The owner's account status was read by Cowork on 2026-11-19 (old project file `AMAZON-POLICY-READ.md`) and has **not** been re-read since.

**Correction.** Earlier docs said tracking must stay off "until the account is fully approved". Amazon's rules do not say that. Amazon expects a new Associate to use links during the first 180 days, because qualifying sales are what trigger the final review. What stays true: public tracking stays **off** until the owner confirms eligibility (items below) and authorises launch.

## The five stages (not the same thing)
| | Stage | What Amazon says | Status for this site |
|---|---|---|---|
| a | **Registration; create links at once** | Policies: "After you have applied to the Associates Program, you are permitted to display Special Links on your Site." Help: SiteStripe shows when you are logged in with the Associates account and builds a tagged link. | Owner's master account exists, SiteStripe enabled (Cowork read, 2026-11-19). |
| b | **Registered, compliant website** | Policies: "Your Site(s) must contain original content and be publicly available via the website address provided in the application." Help: "You must own your website"; content "generally within the last 60 days"; "robust original content", "a good rule of thumb is at least 10 posts". | planspastfive.com was added to the account's website list on 2026-11-19. The site is **not yet public** and has far fewer than 10 posts. |
| c | **An active tracking ID** | Created in Associates Central (Manage Your Tracking IDs). A tag only works on links that carry it. | `planspastfive-20` exists (created 2026-11-19). |
| d | **Initial qualifying-sales period** | Help: "Once you've applied, you have 180 days to refer a sale through one of your Associates links." Review page: "we require at least three within the first 180 days"; "personal orders do not qualify". Dormancy page: the application "can be withdrawn if there were not enough qualifying sales for 180 days". | Sign-up date not found in the console (owner note: applied 2026-11-18, so the 180 days would end about 2027-05-17, UNVERIFIED). 0 sales so far. |
| e | **Final review and approval** | Help: "Once you have referred three qualifying sales, we'll evaluate your application within a day or two". Rejection is final: "we aren't able to reassess an application once it's been rejected"; "We're unable to reinstate your account or Associates ID". You may reapply once your site is established. | Not reached. |

## What the rules allow during the review period
- Tagged links may be displayed after applying (stage a quote above). So an applicant does **not** have to wait for final approval to use links; the sales made through them are what lead to approval.
- Sales only count if the link carries the tag, the buyer is not the Associate, and the item ships within the window (Policies: shipped "within 180 days of the purchase").
- The required sentence stays exactly: "As an Amazon Associate I earn from qualifying purchases." (Operating Agreement section 5).
- UNVERIFIED: whether commission earned before final approval is paid if the application is later rejected (Amazon's pages read do not say; third parties claim it is forfeited). UNVERIFIED: whether the account sign-up date can be seen anywhere; the exact meaning of "three qualifying sales" (third parties say three separate orders; Amazon's pages read only say "three"). UNVERIFIED: the "Account Dormancy" page also mentions a possible fee and unclaimed income rules for accounts that go dormant; read it before relying on a long quiet period.

## What this means for launch
1. Tracking stays **off** in `src/content/settings.json` until the owner confirms: the site is public on planspastfive.com, has meaningful recent content, the website is on the account's list, and the owner is happy to start the 180-day sales window (it already started on sign-up, so a private, empty site is using up that time).
2. The owner then authorises switching it on (Pages CMS > Site settings > tracking on, then Publish). Claude should not switch it on without that authorisation.
3. Click every Amazon button on the live site once (do not buy through your own links; personal orders do not qualify).

## Not transferable
Operating Agreement: "You may not assign this Agreement, by operation of law or otherwise, without our express prior written approval." A buyer applies for **their own** Associates account, adds the site to it, creates their own tracking ID and replaces `amazonTrackingId` in Site settings (see `docs/TRANSFER.md`). The seller's 180-day clock and any sales history do not pass to the buyer.

Sources: https://affiliate-program.amazon.com/help/operating/agreement , https://affiliate-program.amazon.com/help/operating/policies , https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM (Application Review Process), https://affiliate-program.amazon.com/help/node/topic/G7MJTPEP9NC3YKMG (Account Dormancy).
