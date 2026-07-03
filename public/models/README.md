# /public/models/

Drop your 3D model files here. One pair per menu item:

- burger.glb + burger.usdz
- iced-latte.glb + iced-latte.usdz
- croissant.glb + croissant.usdz
- acai-bowl.glb + acai-bowl.usdz
- avocado-toast.glb + avocado-toast.usdz
- matcha.glb + matcha.usdz

Once files are present, set `AR_READY = true` in:
  screens/ItemDetailScreen.jsx  (line ~20)

The <model-viewer> component in components/ARViewer.jsx is already wired
with all AR attributes:
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  auto-rotate
  scale="1 1 1"

The "View on Table" button will automatically activate.
