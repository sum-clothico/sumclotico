"use client";

import React from "react";

/**
 * Catches render + commit errors from children (Clerk dev portals,
 * stray GSAP DOM mutations) and transparently re-mounts to recover.
 * Never shows UI — crashes become silent soft-reloads of the subtree.
 */
export default class SafeBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { crashKey: 0 };
  }

  static getDerivedStateFromError() {
    // Signal recovery via key bump (forces subtree remount)
    return {};
  }

  componentDidCatch(error) {
    if (typeof window !== "undefined") {
      console.warn("[SafeBoundary caught]", error?.message || error);
    }
    this.setState((s) => ({ crashKey: s.crashKey + 1 }));
  }

  render() {
    return (
      <React.Fragment key={this.state.crashKey}>
        {this.props.children}
      </React.Fragment>
    );
  }
}
