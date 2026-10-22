# Hoàng Duy portrait and wordmark

Source photograph: user-provided 51859b8b-3c13-4802-beda-321c46134ea5.png. Edited with the built-in image_gen tool (not CLI). Original source photograph was not modified.

Saved asset: public/assets/portraits/hoang-duy.png (1024 × 1536, alpha cutout). Optimized website derivative: public/assets/portraits/hoang-duy.webp, quality 90, full alpha. Both homepage portraits now use this asset. Caption and alt text identify the supplied portrait rather than a fictional placeholder. Existing layout/CSS, pink circle, image window, object-fit and responsive dimensions are preserved.

Header wordmark: Hoàng Duy, existing Pacifico font; H and D pink, remaining letters white. Footer logo text also updated. No hardware content or project results were changed.

## Final editing prompt

Use case: identity-preserve / background-extraction. Edit target: the attached photograph of the user Hoàng Duy. Create a website portrait cutout on a genuinely transparent background, 1024x1536 portrait canvas, to replace an existing grayscale folded-arms engineer portrait. Preserve the EXACT person's facial features, identity, natural skin texture, hairstyle, neutral expression, polo shirt, folded arms, hands and body proportions from the supplied photo. Do not invent a new person, glasses, clothing, pose or a smile. Remove only the gray studio backdrop, convert the subject to polished natural monochrome photography with soft studio contrast, clean detailed hair edges and realistic texture. Center the subject. Frame from top of hair to lower torso with all folded arms visible and a small top margin, subject approximately 88% canvas width, matching a professional black-and-white portfolio portrait. No pink ring, text, graphic, glow or backdrop in the asset; the website supplies its existing circular pink border. True alpha outside the silhouette. Retain original likeness strictly.

## Validation

pnpm lint, pnpm build and pnpm check:export passed. Production Edge checks at 1479, 390 and 375px verified the Hoàng Duy wordmark, both new portrait sources, font, no horizontal overflow, mobile menu open/Escape and no runtime errors. Compared hero circle/window/heading x/y/width/height against the Phase 4 baseline: unchanged within 0.1px. Screenshots and checks are in docs/personalization/.
