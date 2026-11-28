# Get Contest Votes Online design system

This file and `source/components.css` govern shared components. Read before changing UI. Update both together. Do not add component overrides in site.css, forms.css or polish.css.

## Tokens

Cream page #fcfaf7; white raised surface #fffdfa; plum text #302239; secondary text #71647b; orange action #ee8736; orange hover #f49a50; secondary border #c9b7d1; focus #ad6032. TildaSans with Arial fallback. Body 18px, form controls 16px, buttons 16px/650. Spacing uses multiples of 4px.

## Buttons

| Variant | Usage | Appearance |
|---|---|---|
| `.button` | Main quote/send action | Orange, dark text |
| `.button.secondary` | Supporting action | Cream, plum text, outlined |
| `.button.small` | Header | Same style, compact |
| `.dock-whatsapp` | External WhatsApp | Green, same compact geometry |
| `.text-link` | Supporting CTA outside article text | Secondary button |

All use pill radius, 48px minimum height (44px compact), 12px 24px padding, no arrow, no underline. Hover changes colour; keyboard focus has visible 3px outline. Disabled controls cannot activate and use 60% opacity. Loading disables duplicate submission and returns to a usable state after failure. Hidden wins over all display rules. Inline article links, footer links and navigation remain text links; do not turn whole articles into buttons.

## Forms and receipts

Controls have one fixed-size chevron, never a repeating image. Visible labels, optional/required text, 16px input font. WhatsApp reply selection requires a phone number. Validation preserves entered details. Review and send are separate actions. Confirmed receipt replaces all sending controls with a checkmark, confirmation, reference and one optional chat action. Never show provider names in the receipt.

## Contact controls and prompt

Dock appears on every page as one horizontal compact unit; WhatsApp is green and quote is orange. The help card aligns above it with a 16px gap. WhatsApp and quote remain separate actions. Reserve footer clearance and hide overlays during field focus. Help card appears once per tab session, can be dismissed with its close button or Escape, and must not steal focus. Returning visitors can still use the dock. No email in popup; support email belongs in every footer. A quote-help card is not live chat. Only advertise online presence after a real message service and staff status are connected.

## Verification

Build and check all links; inspect homepage, blog, quote, review and success states. Check shared styles at desktop and narrow widths. Keep metadata/URLs stable for visual-only changes. Deploy only public/ using the existing worker config.

Quote layout: wide form on left, three-step after-send explanation on right; stack below 800px. Visible entry notes precede contact fields. Preserve the review/receipt flow and dedicated endpoint.
