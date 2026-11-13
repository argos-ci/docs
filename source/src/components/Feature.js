export const FeatureImage = (props) => (
  <img style={{ maxHeight: 40, maxWidth: 40, margin: "auto" }} {...props} />
);

export const FeatureTitle = (props) => <h4 className="title4" {...props} />;

export const FeatureParagraph = (props) => (
  <div className="featureParagraph" {...props} />
);

export const Feature = (props) => <div className="feature" {...props} />;

export const Features = (props) => (
  <div className="rounded features" {...props} />
);
