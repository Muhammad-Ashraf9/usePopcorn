import React, { useState } from "react";
import PropTyes from "prop-types";

export default function TextExpander({
  children,
  className = "",
  collapsedNumWords = Math.round(children.length / 2),
  expandButtonText = "Show text",
  collapseButtonText = "Collapse text",
  buttonColor = "#2e70fc",
  expanded = false,
}) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const buttonStyle = {
    border: "0",
    color: buttonColor,
    backgroundColor: "transparent",
  };
  const collapsedText = children.slice(0, collapsedNumWords);
  return (
    <div className={className}>
      {isExpanded ? children : collapsedText}...
      <button
        style={buttonStyle}
        onClick={() => setIsExpanded((isExpanded) => !isExpanded)}
      >
        {isExpanded ? collapseButtonText : expandButtonText}
      </button>
    </div>
  );
}
TextExpander.propTypes = {
  children: PropTyes.string.isRequired,
  className: PropTyes.string,
  collapsedNumWords: PropTyes.number,
  expandButtonText: PropTyes.string,
  collapseButtonText: PropTyes.string,
  buttonColor: PropTyes.string,
  expanded: PropTyes.bool,
};
