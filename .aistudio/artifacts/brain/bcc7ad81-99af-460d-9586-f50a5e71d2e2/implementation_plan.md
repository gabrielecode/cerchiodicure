# Implementation Plan: Homepage Redesign & PWA Installation Enhancement

## 1. Homepage Redesign (Wireframe Match)
We will restructure `src/components/LandingPage.tsx` to align with the provided wireframe:
- **Header**: Refine to include logo and navigation.
- **Hero**: Update with headline, image, and CTA.
- **Benefits**: Create a new grid for benefits (stars or icons).
- **Testimonials**: Add a testimonial section.
- **Features List**: Add a bulleted list section.
- **Form / CTA**: Add a prominent lead generation form.
- **Footer**: Ensure social media links are prominent.

## 2. PWA Installation Improvement
We will implement the user's requested installation prompts:
- **Header**: Add a discrete "Install App" link/button in the navigation bar.
- **Overlay/Footer**: Enhance the `InstallBanner.tsx` to be more persistent and robust.
- **Sidebar**: Update `src/components/Sidebar.tsx` to include an installation option.

## 3. PWA Verification
- Ensure `manifest.json` is compliant (icons, display, start_url).
- Verify `vite-plugin-pwa` configuration in `vite.config.ts`.
- Ensure mobile/iOS Safari meta tags are present in `index.html`.

## 4. Verification
- Compile and lint the app.
- Check PWA installability in the preview.
