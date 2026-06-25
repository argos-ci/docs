# Wait for loading

Master timing in visual tests with Argos: Use `aria-busy` to ensure screenshots are captured post full page load, enhancing accuracy and consistency.

### Usage

`argosScreenshot()` delays capturing screenshots until no elements with `aria-busy` are detected, ensuring full page load.

```jsx
<Loader aria-busy={true} />
```

**We recommend applying `aria-busy` to your loader components to ensure that your page is fully loaded before a screenshot is taken.**
