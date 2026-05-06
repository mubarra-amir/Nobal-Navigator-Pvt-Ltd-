import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <h2 className="text-center p-8 text-red-600">
          Something went wrong.
        </h2>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;